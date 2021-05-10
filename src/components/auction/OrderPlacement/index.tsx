import React, { useEffect, useMemo, useState } from 'react'
import styled from 'styled-components'
import { Fraction, TokenAmount } from 'uniswap-xdai-sdk'

import ReactTooltip from 'react-tooltip'

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
import { useTokenBalancesTreatWETHAsETHonXDAI } from '../../../state/wallet/hooks'
import { ChainId, EASY_AUCTION_NETWORKS, getTokenDisplay, isTokenXDAI } from '../../../utils'
import { convertPriceIntoBuyAndSellAmount, getInverse } from '../../../utils/prices'
import { getChainName } from '../../../utils/tools'
import { Button } from '../../buttons/Button'
import { ButtonAnchor } from '../../buttons/ButtonAnchor'
import { ButtonType } from '../../buttons/buttonStylingTypes'
import { InlineLoading } from '../../common/InlineLoading'
import { SpinnerSize } from '../../common/Spinner'
import CurrencyInputPanel from '../../form/CurrencyInputPanel'
import PriceInputPanel from '../../form/PriceInputPanel'
import { ErrorInfo } from '../../icons/ErrorInfo'
import { ErrorLock } from '../../icons/ErrorLock'
import { LockBig } from '../../icons/LockBig'
import ConfirmationModal from '../../modals/ConfirmationModal'
import WarningModal from '../../modals/WarningModal'
import SwapModalFooter from '../../modals/common/PlaceOrderModalFooter'
import { BaseCard } from '../../pureStyledComponents/BaseCard'
import { EmptyContentText } from '../../pureStyledComponents/EmptyContent'
import { ErrorRow, ErrorText, ErrorWrapper } from '../../pureStyledComponents/Error'

const Wrapper = styled(BaseCard)`
  max-width: 100%;
  min-height: 352px;
  min-width: 100%;
`

const ActionButton = styled(Button)`
  flex-shrink: 0;
  height: 52px;
  margin-top: auto;
`

const BalanceWrapper = styled.div`
  align-items: center;
  display: flex;
  margin-bottom: 20px;
`

const Balance = styled.p`
  color: ${({ theme }) => theme.text1};
  font-size: 18px;
  font-weight: 600;
  line-height: 1.2;
  margin: 0 10px 0 0;
  text-align: left;
`

const Total = styled.span`
  font-weight: 400;
`

const ApprovalWrapper = styled.div`
  border-radius: 6px;
  border: 1px solid ${({ theme }) => theme.primary1};
  display: block;
  margin-bottom: 40px;
  padding: 7px 12px;

  @media (min-width: ${({ theme }) => theme.themeBreakPoints.md}) {
    align-items: center;
    display: flex;
    margin-bottom: 10px;
  }
`

const ApprovalText = styled.p`
  color: ${({ theme }) => theme.primary1};
  font-size: 13px;
  font-weight: normal;
  line-height: 1.23;
  margin: 0 0 15px 0;
  text-align: left;

  @media (min-width: ${({ theme }) => theme.themeBreakPoints.md}) {
    margin: 0 25px 0 0;
  }
`

const ApprovalButton = styled(Button)`
  border-radius: 4px;
  font-size: 14px;
  font-weight: 600;
  height: 26px;
  padding: 0 14px;
  width: 100%;

  @media (min-width: ${({ theme }) => theme.themeBreakPoints.md}) {
    width: auto;
  }
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

const ButtonWrap = styled(ButtonAnchor)`
  border-radius: 4px;
  font-size: 12px;
  height: 20px;
  margin: -2px 6px 0 0;
  padding: 0 5px;
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
  const { error } = useGetOrderPlacementError(
    derivedAuctionInfo,
    auctionState,
    auctionIdentifier,
    showPriceInverted,
  )
  const { onInvertPrices } = useSwapActionHandlers()
  const { onUserSellAmountInput } = useSwapActionHandlers()
  const { onUserPriceInput } = useSwapActionHandlers()
  const { auctionDetails, auctionInfoLoading } = useAuctionDetails(auctionIdentifier)
  const isValid = !error
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

  const [approvalSubmitted, setApprovalSubmitted] = useState<boolean>(false)

  const relevantTokenBalances = useTokenBalancesTreatWETHAsETHonXDAI(account ?? undefined, [
    biddingToken,
  ])
  const biddingTokenBalance = relevantTokenBalances?.[biddingToken?.address ?? '']

  useEffect(() => {
    if (approval === ApprovalState.PENDING) {
      setApprovalSubmitted(true)
    }
  }, [approval, approvalSubmitted])

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
      ? getInverse(Number(price), NUMBER_OF_DIGITS_FOR_INVERSION).toString()
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
  const isPlaceOrderDisabled =
    !isValid || notApproved || showWarning || showWarningWrongChainId || showConfirm

  const onMaxInput = React.useCallback(() => {
    maxAmountInput && onUserSellAmountInput(maxAmountInput.toExact())
  }, [maxAmountInput, onUserSellAmountInput])

  const balanceString = React.useMemo(() => {
    return account
      ? chainId !== chainIdFromWeb3
        ? 'Switch network'
        : `${biddingTokenBalance?.toSignificant(6) || '0'} ${getTokenDisplay(
            biddingToken,
            chainId,
          )}`
      : 'Connect your wallet'
  }, [account, biddingToken, biddingTokenBalance, chainId, chainIdFromWeb3])

  return (
    <>
      <Wrapper>
        {auctionInfoLoading && <InlineLoading size={SpinnerSize.small} />}
        {!auctionInfoLoading && isPrivate && !signatureAvailable && (
          <PrivateWrapper>
            <LockBig />
            <TextBig>Private auction</TextBig>
            <EmptyContentTextNoMargin>You are not allowed place an order.</EmptyContentTextNoMargin>
            <EmptyContentTextSmall>Ask the auctioneer to get allow-listed.</EmptyContentTextSmall>
          </PrivateWrapper>
        )}
        {!auctionInfoLoading && (!isPrivate || signatureAvailable) && (
          <>
            <BalanceWrapper>
              <Balance>
                Your Balance: <Total>{`${balanceString} `}</Total>
              </Balance>
              {isTokenXDAI(biddingToken.address, chainId) &&
                account &&
                biddingToken &&
                biddingToken.address && (
                  <span
                    className={`tooltipComponent`}
                    data-for={'wrap_button'}
                    data-html={true}
                    data-multiline={true}
                    data-tip={`Unwrap WXDAI to XDAI on Honeyswap`}
                  >
                    <ReactTooltip
                      arrowColor={'#001429'}
                      backgroundColor={'#001429'}
                      border
                      borderColor={'#174172'}
                      className="customTooltip"
                      delayHide={50}
                      delayShow={250}
                      effect="solid"
                      id={'wrap_button'}
                      textColor="#fff"
                    />
                    <ButtonWrap
                      buttonType={ButtonType.primaryInverted}
                      href={`https://app.honeyswap.org/#/swap?inputCurrency=${biddingToken.address}`}
                      target="_blank"
                    >
                      Unwrap WXDAI
                    </ButtonWrap>
                  </span>
                )}
            </BalanceWrapper>
            <CurrencyInputPanel
              chainId={chainId}
              onMax={onMaxInput}
              onUserSellAmountInput={onUserSellAmountInput}
              token={biddingToken}
              value={sellAmount}
            />
            <PriceInputPanel
              auctioningToken={auctioningToken}
              biddingToken={biddingToken}
              invertPrices={showPriceInverted}
              label={
                showPriceInverted
                  ? `Min ${auctioningTokenDisplay} per ${biddingTokenDisplay} price`
                  : `Max ${biddingTokenDisplay} per ${auctioningTokenDisplay} price`
              }
              onInvertPrices={onInvertPrices}
              onUserPriceInput={onUserPriceInput}
              value={price}
            />
            {(error || orderPlacingOnly || cancelDate) && (
              <ErrorWrapper>
                {error && sellAmount !== '' && price !== '' && (
                  <ErrorRow>
                    <ErrorInfo />
                    <ErrorText>{error}</ErrorText>
                  </ErrorRow>
                )}
                {orderPlacingOnly && !cancelDate && (
                  <ErrorRow>
                    <ErrorLock />
                    <ErrorText>
                      New orders can&apos;t be canceled once you confirm the transaction in the next
                      step.
                    </ErrorText>
                  </ErrorRow>
                )}
                {cancelDate && (
                  <ErrorRow>
                    <ErrorInfo />
                    <ErrorText>
                      Beware: after <strong>{cancelDate}</strong> and until the end of the auction,
                      orders cannot be canceled.
                    </ErrorText>
                  </ErrorRow>
                )}
              </ErrorWrapper>
            )}
            {notApproved && (
              <ApprovalWrapper>
                <ApprovalText>
                  You need to unlock {biddingTokenDisplay} to allow the smart contract to interact
                  with it. This has to be done for each new token.
                </ApprovalText>
                <ApprovalButton
                  buttonType={ButtonType.primaryInverted}
                  disabled={approval === ApprovalState.PENDING}
                  onClick={approveCallback}
                >
                  {approval === ApprovalState.PENDING ? `Approving` : `Approve`}
                </ApprovalButton>
              </ApprovalWrapper>
            )}
            {!account ? (
              <ActionButton onClick={toggleWalletModal}>Connect Wallet</ActionButton>
            ) : (
              <ActionButton disabled={isPlaceOrderDisabled} onClick={handleShowConfirm}>
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
