import React, { useEffect, useMemo, useState } from 'react'
import styled from 'styled-components'
import { Fraction, TokenAmount } from 'uniswap-xdai-sdk'

import { NUMBER_OF_DIGITS_FOR_INVERSION } from '../../../constants/config'
import { useActiveWeb3React } from '../../../hooks'
import { ApprovalState, useApproveCallback } from '../../../hooks/useApproveCallback'
import { useAuctionDetails } from '../../../hooks/useAuctionDetails'
import { usePlaceOrderCallback } from '../../../hooks/usePlaceOrderCallback'
import { useSignature } from '../../../hooks/useSignature'
import { useWalletModalToggle } from '../../../state/application/hooks'
import {
  AuctionState,
  DerivedAuctionInfo,
  tryParseAmount,
  useGetOrderPlacementError,
  useOrderPlacementState,
  useSwapActionHandlers,
} from '../../../state/orderPlacement/hooks'
import { AuctionIdentifier } from '../../../state/orderPlacement/reducer'
import { useOrderState } from '../../../state/orders/hooks'
import { OrderState } from '../../../state/orders/reducer'
import { useTokenBalancesTreatWETHAsETH } from '../../../state/wallet/hooks'
import {
  ChainId,
  EASY_AUCTION_NETWORKS,
  getTokenDisplay,
  isTokenWETH,
  isTokenXDAI,
} from '../../../utils'
import { convertPriceIntoBuyAndSellAmount, getInverse } from '../../../utils/prices'
import { getChainName } from '../../../utils/tools'
import { Button } from '../../buttons/Button'
import { InlineLoading } from '../../common/InlineLoading'
import { SpinnerSize } from '../../common/Spinner'
import AmountInputPanel from '../../form/AmountInputPanel'
import PriceInputPanel from '../../form/PriceInputPanel'
import { Calendar } from '../../icons/Calendar'
import { LockBig } from '../../icons/LockBig'
import ConfirmationModal from '../../modals/ConfirmationModal'
import WarningModal from '../../modals/WarningModal'
import SwapModalFooter from '../../modals/common/PlaceOrderModalFooter'
import { BaseCard } from '../../pureStyledComponents/BaseCard'
import { EmptyContentText } from '../../pureStyledComponents/EmptyContent'
import { InfoType } from '../../pureStyledComponents/FieldRow'
import { PageTitle } from '../../pureStyledComponents/PageTitle'

const Wrapper = styled(BaseCard)`
  max-width: 100%;
  min-height: 392px;
  min-width: 100%;
  padding: 20px;
`

const ActionButton = styled(Button)`
  flex-shrink: 0;
  height: 40px;
  margin-top: auto;
`

const PrivateWrapper = styled.div`
  align-items: center;
  display: flex;
  flex-direction: column;
  height: 300px;
  justify-content: center;
`

const TextBig = styled(EmptyContentText)`
  font-size: 22px;
  margin-bottom: 15px;
  margin-top: 5px;
`

const EmptyContentTextNoMargin = styled(EmptyContentText)`
  line-height: 1.2;
  margin-top: 0;
`

const EmptyContentTextSmall = styled(EmptyContentText)`
  font-size: 16px;
  font-weight: 400;
  margin-top: 0;
`

const Warning = styled.div`
  align-items: center;
  display: flex;
  margin-bottom: 16px;
`

const WarningText = styled.div`
  color: ${({ theme }) => theme.text1};
  font-size: 15px;
  font-weight: 600;
  line-height: 1.2;
  margin-left: 8px;
  position: relative;
  top: 2px;
  text-align: left;
`

interface OrderPlacementProps {
  auctionIdentifier: AuctionIdentifier
  derivedAuctionInfo: DerivedAuctionInfo
}

const OrderPlacement: React.FC<OrderPlacementProps> = (props) => {
  const {
    auctionIdentifier,
    derivedAuctionInfo: { auctionState },
    derivedAuctionInfo,
  } = props
  const { chainId } = auctionIdentifier
  const { account, chainId: chainIdFromWeb3 } = useActiveWeb3React()
  const orders: OrderState | undefined = useOrderState()
  const toggleWalletModal = useWalletModalToggle()
  const { price, sellAmount, showPriceInverted } = useOrderPlacementState()
  const { errorAmount, errorPrice } = useGetOrderPlacementError(
    derivedAuctionInfo,
    auctionState,
    auctionIdentifier,
    showPriceInverted,
  )
  const { onInvertPrices } = useSwapActionHandlers()
  const { onUserSellAmountInput } = useSwapActionHandlers()
  const { onUserPriceInput } = useSwapActionHandlers()
  const { auctionDetails, auctionInfoLoading } = useAuctionDetails(auctionIdentifier)
  const { signature } = useSignature(auctionIdentifier, account)

  const [showConfirm, setShowConfirm] = useState<boolean>(false)
  const [showWarning, setShowWarning] = useState<boolean>(false)
  const [showWarningWrongChainId, setShowWarningWrongChainId] = useState<boolean>(false)
  const [attemptingTxn, setAttemptingTxn] = useState<boolean>(false) // clicked confirmed
  const [pendingConfirmation, setPendingConfirmation] = useState<boolean>(true) // waiting for user confirmation
  const [txHash, setTxHash] = useState<string>('')

  const auctioningToken = React.useMemo(() => derivedAuctionInfo.auctioningToken, [
    derivedAuctionInfo.auctioningToken,
  ])

  const biddingToken = React.useMemo(() => derivedAuctionInfo.biddingToken, [
    derivedAuctionInfo.biddingToken,
  ])

  const parsedBiddingAmount = tryParseAmount(sellAmount, biddingToken)
  const approvalTokenAmount: TokenAmount | undefined = parsedBiddingAmount
  const [approval, approveCallback] = useApproveCallback(
    approvalTokenAmount,
    EASY_AUCTION_NETWORKS[chainId as ChainId],
    chainIdFromWeb3 as ChainId,
  )

  const relevantTokenBalances = useTokenBalancesTreatWETHAsETH(account ?? undefined, [biddingToken])
  const biddingTokenBalance = relevantTokenBalances?.[biddingToken?.address ?? '']

  const maxAmountInput: TokenAmount = biddingTokenBalance ? biddingTokenBalance : undefined

  useEffect(() => {
    if (price == '-' && derivedAuctionInfo?.clearingPrice) {
      showPriceInverted
        ? onUserPriceInput(
            derivedAuctionInfo?.clearingPrice
              .invert()
              .multiply(new Fraction('999', '1000'))
              .toSignificant(4),
            true,
          )
        : onUserPriceInput(
            derivedAuctionInfo?.clearingPrice
              .multiply(new Fraction('1001', '1000'))
              .toSignificant(4),
            false,
          )
    }
  }, [onUserPriceInput, price, derivedAuctionInfo, showPriceInverted])

  const resetModal = () => {
    if (!pendingConfirmation) {
      onUserSellAmountInput('')
    }
    setPendingConfirmation(true)
    setAttemptingTxn(false)
  }

  const placeOrderCallback = usePlaceOrderCallback(
    auctionIdentifier,
    signature,
    showPriceInverted,
    auctioningToken,
    biddingToken,
  )

  const onPlaceOrder = () => {
    setAttemptingTxn(true)

    placeOrderCallback()
      .then((hash) => {
        setTxHash(hash)
        setPendingConfirmation(false)
      })
      .catch(() => {
        resetModal()
        setShowConfirm(false)
      })
  }

  const pendingText = `Placing order`
  const biddingTokenDisplay = useMemo(() => getTokenDisplay(biddingToken, chainId), [
    biddingToken,
    chainId,
  ])
  const auctioningTokenDisplay = useMemo(() => getTokenDisplay(auctioningToken, chainId), [
    auctioningToken,
    chainId,
  ])
  const notApproved = approval === ApprovalState.NOT_APPROVED || approval === ApprovalState.PENDING
  const orderPlacingOnly = auctionState === AuctionState.ORDER_PLACING
  const coversClearingPrice = (price: string | undefined, showPriceInverted: boolean): boolean => {
    const standardizedPrice = showPriceInverted
      ? getInverse(price, NUMBER_OF_DIGITS_FOR_INVERSION)
      : price

    const { buyAmountScaled, sellAmountScaled } = convertPriceIntoBuyAndSellAmount(
      derivedAuctionInfo?.auctioningToken,
      derivedAuctionInfo?.biddingToken,
      standardizedPrice == '-' ? '1' : standardizedPrice,
      sellAmount,
    )

    return sellAmountScaled
      ?.mul(derivedAuctionInfo?.clearingPriceSellOrder?.buyAmount.raw.toString())
      .lte(
        buyAmountScaled?.mul(derivedAuctionInfo?.clearingPriceSellOrder?.sellAmount.raw.toString()),
      )
  }
  const hasRiskNotCoveringClearingPrice =
    auctionState === AuctionState.ORDER_PLACING_AND_CANCELING &&
    coversClearingPrice(price, showPriceInverted)

  const handleShowConfirm = () => {
    if (chainId !== chainIdFromWeb3) {
      setShowWarningWrongChainId(true)
      return
    }

    const sameOrder = orders.orders.find((order) => order.price === price)

    if (!sameOrder) {
      setShowConfirm(true)
    } else {
      setShowWarning(true)
    }
  }

  const cancelDate = React.useMemo(
    () =>
      derivedAuctionInfo?.auctionEndDate !== derivedAuctionInfo?.orderCancellationEndDate &&
      derivedAuctionInfo?.orderCancellationEndDate !== 0
        ? new Date(derivedAuctionInfo?.orderCancellationEndDate * 1000).toLocaleString()
        : undefined,
    [derivedAuctionInfo?.auctionEndDate, derivedAuctionInfo?.orderCancellationEndDate],
  )

  const isPrivate = React.useMemo(() => auctionDetails && auctionDetails.isPrivateAuction, [
    auctionDetails,
  ])
  const signatureAvailable = React.useMemo(() => signature && signature.length > 10, [signature])

  const onMaxInput = React.useCallback(() => {
    maxAmountInput && onUserSellAmountInput(maxAmountInput.toExact())
  }, [maxAmountInput, onUserSellAmountInput])

  const balanceString = React.useMemo(() => {
    return biddingTokenBalance?.toSignificant(6)
  }, [biddingTokenBalance])

  const showTopWarning = orderPlacingOnly || cancelDate

  const amountInfo = React.useMemo(
    () =>
      !account
        ? {
            text: 'Please connect your wallet.',
            type: InfoType.info,
          }
        : notApproved && approval !== ApprovalState.PENDING && approval !== ApprovalState.APPROVED
        ? {
            text: `You need to unlock ${biddingTokenDisplay} to allow the smart contract to interact with it.`,
            type: InfoType.info,
          }
        : errorAmount
        ? {
            text: errorAmount,
            type: InfoType.error,
          }
        : null,
    [account, approval, errorAmount, notApproved, biddingTokenDisplay],
  )

  const priceInfo = React.useMemo(
    () =>
      errorPrice
        ? {
            text: errorPrice,
            type: InfoType.error,
          }
        : null,
    [errorPrice],
  )

  const disablePlaceOrder =
    (errorAmount ||
      errorPrice ||
      notApproved ||
      showWarning ||
      showWarningWrongChainId ||
      showConfirm ||
      sellAmount === '' ||
      price === '') &&
    true

  const isWrappable =
    biddingTokenBalance &&
    biddingTokenBalance.greaterThan('0') &&
    (isTokenXDAI(biddingToken.address, chainId) || isTokenWETH(biddingToken.address, chainId)) &&
    !!account &&
    !!biddingToken.address

  return (
    <>
      <Wrapper>
        {auctionInfoLoading && <InlineLoading size={SpinnerSize.small} />}
        {!auctionInfoLoading && isPrivate && !signatureAvailable && (
          <PrivateWrapper>
            <LockBig />
            <TextBig>Private auction</TextBig>
            <EmptyContentTextNoMargin>
              You are not allowed to place an order.
            </EmptyContentTextNoMargin>
            <EmptyContentTextSmall>Ask the auctioneer to get allow-listed.</EmptyContentTextSmall>
          </PrivateWrapper>
        )}
        {!auctionInfoLoading && (!isPrivate || signatureAvailable) && (
          <>
            {showTopWarning && (
              <Warning>
                <Calendar />
                <WarningText>
                  {orderPlacingOnly &&
                    `Orders cannot be canceled once you confirm the transaction.`}
                  {cancelDate &&
                    !orderPlacingOnly &&
                    `Orders cannot be canceled after ${cancelDate}`}
                </WarningText>
              </Warning>
            )}
            <AmountInputPanel
              balance={balanceString}
              chainId={chainId}
              info={amountInfo}
              onMax={onMaxInput}
              onUserSellAmountInput={onUserSellAmountInput}
              token={biddingToken}
              unlock={{ isLocked: notApproved, onUnlock: approveCallback, unlockState: approval }}
              value={sellAmount}
              wrap={{
                isWrappable,
                onClick: () =>
                  chainId == 100
                    ? window.open(
                        `https://app.honeyswap.org/#/swap?inputCurrency=${biddingToken.address}`,
                      )
                    : window.open(
                        `https://app.uniswap.org/#/swap?inputCurrency=${biddingToken.address}`,
                      ),
              }}
            />
            <PriceInputPanel
              chainId={chainId}
              info={priceInfo}
              invertPrices={showPriceInverted}
              onInvertPrices={onInvertPrices}
              onUserPriceInput={onUserPriceInput}
              tokens={{ auctioningToken: auctioningToken, biddingToken: biddingToken }}
              value={price}
            />
            {!account ? (
              <ActionButton onClick={toggleWalletModal}>Connect Wallet</ActionButton>
            ) : (
              <ActionButton disabled={disablePlaceOrder} onClick={handleShowConfirm}>
                Place Order
              </ActionButton>
            )}
          </>
        )}
      </Wrapper>
      <WarningModal
        content={`Pick a different price, you already have an order for ${price} ${biddingTokenDisplay} per ${auctioningTokenDisplay}`}
        isOpen={showWarning}
        onDismiss={() => {
          setShowWarning(false)
        }}
        title="Warning!"
      />
      <WarningModal
        content={`In order to place this order, please connect to the ${getChainName(
          chainId,
        )} network`}
        isOpen={showWarningWrongChainId}
        onDismiss={() => {
          setShowWarningWrongChainId(false)
        }}
        title="Warning!"
      />
      <ConfirmationModal
        attemptingTxn={attemptingTxn}
        content={
          <SwapModalFooter
            auctioningToken={auctioningToken}
            biddingToken={biddingToken}
            cancelDate={cancelDate}
            chainId={chainId}
            confirmText={'Confirm'}
            hasRiskNotCoveringClearingPrice={hasRiskNotCoveringClearingPrice}
            isPriceInverted={showPriceInverted}
            onPlaceOrder={onPlaceOrder}
            orderPlacingOnly={orderPlacingOnly}
            price={price}
            sellAmount={sellAmount}
          />
        }
        hash={txHash}
        isOpen={showConfirm}
        onDismiss={() => {
          resetModal()
          setShowConfirm(false)
        }}
        pendingConfirmation={pendingConfirmation}
        pendingText={pendingText}
        title="Confirm Order"
        width={504}
      />
    </>
  )
}

export default OrderPlacement
