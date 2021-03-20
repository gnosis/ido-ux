import React, { useEffect, useMemo, useState } from 'react'
import styled from 'styled-components'
import { Fraction, TokenAmount } from 'uniswap-xdai-sdk'

import { EASY_AUCTION_NETWORKS } from '../../../constants'
import { useActiveWeb3React } from '../../../hooks'
import { ApprovalState, useApproveCallback } from '../../../hooks/useApproveCallback'
import { useAuctionDetails } from '../../../hooks/useAuctionDetails'
import { usePlaceOrderCallback } from '../../../hooks/usePlaceOrderCallback'
import { useSignature } from '../../../hooks/useSignature'
import { useWalletModalToggle } from '../../../state/application/hooks'
import {
  AuctionState,
  DerivedAuctionInfo,
  useGetOrderPlacementError,
  useSwapActionHandlers,
  useSwapState,
} from '../../../state/orderPlacement/hooks'
import { useOrderState } from '../../../state/orders/hooks'
import { OrderState } from '../../../state/orders/reducer'
import { useTokenBalance } from '../../../state/wallet/hooks'
import { ChainId, getTokenDisplay } from '../../../utils'
import { Button } from '../../buttons/Button'
import { ButtonType } from '../../buttons/buttonStylingTypes'
import { InlineLoading } from '../../common/InlineLoading'
import { SpinnerSize } from '../../common/Spinner'
import TokenLogo from '../../common/TokenLogo'
import CurrencyInputPanel from '../../form/CurrencyInputPanel'
import PriceInputPanel from '../../form/PriceInputPanel'
import { ErrorInfo } from '../../icons/ErrorInfo'
import { ErrorLock } from '../../icons/ErrorLock'
import ConfirmationModal from '../../modals/ConfirmationModal'
import WarningModal from '../../modals/WarningModal'
import { BaseCard } from '../../pureStyledComponents/BaseCard'
import { ErrorRow, ErrorText, ErrorWrapper } from '../../pureStyledComponents/Error'
import SwapModalFooter from '../../swap/PlaceOrderModalFooter'
import SwapModalHeader from '../../swap/SwapModalHeader'

const Wrapper = styled(BaseCard)`
  max-width: 100%;
  min-width: 100%;
`

const ActionButton = styled(Button)`
  height: 52px;
  margin-top: auto;
`

const BalanceWrapper = styled.div`
  display: flex;
  align-items: center;
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
  align-items: center;
  border-radius: 6px;
  border: 1px solid ${({ theme }) => theme.primary1};
  display: flex;
  margin-bottom: 10px;
  padding: 7px 12px;
`

const ApprovalText = styled.p`
  color: ${({ theme }) => theme.primary1};
  font-size: 13px;
  font-weight: normal;
  line-height: 1.23;
  margin: 0 25px 0 0;
  text-align: left;
`

const ApprovalButton = styled(Button)`
  border-radius: 4px;
  font-size: 14px;
  font-weight: 600;
  height: 26px;
  padding: 0 14px;
`
interface OrderPlacementProps {
  derivedAuctionInfo: DerivedAuctionInfo
  auctionState: AuctionState
}

const OrderPlacement: React.FC<OrderPlacementProps> = (props) => {
  const { auctionState, derivedAuctionInfo } = props
  const { account, chainId } = useActiveWeb3React()
  const orders: OrderState | undefined = useOrderState()
  const toggleWalletModal = useWalletModalToggle()
  const { price, sellAmount } = useSwapState()
  const { error } = useGetOrderPlacementError(derivedAuctionInfo)
  const { onUserSellAmountInput } = useSwapActionHandlers()
  const { onUserPriceInput } = useSwapActionHandlers()
  const { loading, signature } = useSignature()
  const auctionInfo = useAuctionDetails()
  const isValid = !error

  const [showConfirm, setShowConfirm] = useState<boolean>(false)
  const [showWarning, setShowWarning] = useState<boolean>(false)
  const [attemptingTxn, setAttemptingTxn] = useState<boolean>(false) // clicked confirmed
  const [pendingConfirmation, setPendingConfirmation] = useState<boolean>(true) // waiting for user confirmation
  const [txHash, setTxHash] = useState<string>('')
  const approvalTokenAmount: TokenAmount | undefined = derivedAuctionInfo?.parsedBiddingAmount

  const [approval, approveCallback] = useApproveCallback(
    approvalTokenAmount,
    EASY_AUCTION_NETWORKS[chainId as ChainId],
  )
  const [approvalSubmitted, setApprovalSubmitted] = useState<boolean>(false)

  useEffect(() => {
    if (approval === ApprovalState.PENDING) {
      setApprovalSubmitted(true)
    }
  }, [approval, approvalSubmitted])

  const maxAmountInput: TokenAmount = derivedAuctionInfo?.biddingTokenBalance
    ? derivedAuctionInfo?.biddingTokenBalance
    : undefined

  useEffect(() => {
    if (price == '-' && derivedAuctionInfo?.initialPrice) {
      onUserPriceInput(
        derivedAuctionInfo?.initialPrice.multiply(new Fraction('1001', '1000')).toSignificant(4),
      )
    }
  }, [onUserPriceInput, price, derivedAuctionInfo])

  const resetModal = () => {
    if (!pendingConfirmation) {
      onUserSellAmountInput('')
    }
    setPendingConfirmation(true)
    setAttemptingTxn(false)
  }

  const placeOrderCallback = usePlaceOrderCallback(
    derivedAuctionInfo?.auctioningToken,
    derivedAuctionInfo?.biddingToken,
  )

  const onPlaceOrder = () => {
    setAttemptingTxn(true)

    placeOrderCallback().then((hash) => {
      setTxHash(hash)
      setPendingConfirmation(false)
    })
  }

  const [showInverted, setShowInverted] = useState<boolean>(false)

  const modalHeader = () => {
    return <SwapModalHeader />
  }

  const modalBottom = () => {
    return (
      <SwapModalFooter
        auctioningToken={derivedAuctionInfo?.auctioningToken}
        biddingToken={derivedAuctionInfo?.biddingToken}
        confirmText={'Confirm Order'}
        onPlaceOrder={onPlaceOrder}
        price={price}
        sellAmount={sellAmount}
        setShowInverted={setShowInverted}
        showInverted={showInverted}
      />
    )
  }

  const pendingText = `Placing order`
  const biddingTokenDisplay = useMemo(() => getTokenDisplay(derivedAuctionInfo?.biddingToken), [
    derivedAuctionInfo,
  ])
  const auctioningTokenDisplay = useMemo(
    () => getTokenDisplay(derivedAuctionInfo?.auctioningToken),
    [derivedAuctionInfo],
  )
  const userTokenBalance = useTokenBalance(account, derivedAuctionInfo?.biddingToken)
  const notApproved = approval === ApprovalState.NOT_APPROVED || approval === ApprovalState.PENDING
  const orderPlacingOnly = auctionState === AuctionState.ORDER_PLACING

  const handleShowConfirm = () => {
    const sameOrder = orders.orders.find((order) => order.price === price)

    if (!sameOrder) {
      setShowConfirm(true)
    } else {
      setShowWarning(true)
    }
  }
  if (loading) {
    return (
      <Wrapper id="chartdiv">
        <InlineLoading size={SpinnerSize.small} />
      </Wrapper>
    )
  }
  if (auctionInfo?.auctionDetails?.isPrivateAuction && !loading && !signature) {
    return (
      <Wrapper>
        <BaseCard>You are not allowed place an order for this auction </BaseCard>
      </Wrapper>
    )
  }
  return (
    <Wrapper>
      <BalanceWrapper>
        <Balance>
          Your Balance:{' '}
          <Total>{`${
            account
              ? `${userTokenBalance?.toSignificant(6)} ${derivedAuctionInfo?.biddingToken?.symbol}`
              : 'Connect your wallet'
          } `}</Total>
        </Balance>
        {account && derivedAuctionInfo?.biddingToken && derivedAuctionInfo?.biddingToken.address && (
          <TokenLogo
            size={'22px'}
            token={{
              address: derivedAuctionInfo?.biddingToken.address,
              symbol: derivedAuctionInfo?.biddingToken.symbol,
            }}
          />
        )}
      </BalanceWrapper>
      <CurrencyInputPanel
        onMax={() => {
          maxAmountInput && onUserSellAmountInput(maxAmountInput.toExact())
        }}
        onUserSellAmountInput={onUserSellAmountInput}
        token={derivedAuctionInfo?.biddingToken}
        value={sellAmount}
      />
      <PriceInputPanel
        auctioningToken={derivedAuctionInfo?.auctioningToken}
        biddingToken={derivedAuctionInfo?.biddingToken}
        label={`${biddingTokenDisplay} per ${auctioningTokenDisplay} price`}
        onUserPriceInput={onUserPriceInput}
        value={price}
      />
      {(error || orderPlacingOnly) && (
        <ErrorWrapper>
          {error && sellAmount !== '' && price !== '' && (
            <ErrorRow>
              <ErrorInfo />
              <ErrorText>{error}</ErrorText>
            </ErrorRow>
          )}
          {orderPlacingOnly && (
            <ErrorRow>
              <ErrorLock />
              <ErrorText>
                New orders can&apos;t be cancelled once you confirm the transaction in the next
                step.
              </ErrorText>
            </ErrorRow>
          )}
        </ErrorWrapper>
      )}
      {notApproved && (
        <ApprovalWrapper>
          <ApprovalText>
            You need to unlock {derivedAuctionInfo?.biddingToken.symbol} to allow the smart contract
            to interact with it. This has to be done for each new token.
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
        <ActionButton disabled={!isValid || notApproved} onClick={handleShowConfirm}>
          Place Order
        </ActionButton>
      )}
      <WarningModal
        content={`Pick a different price, you already has an order for ${price} ${biddingTokenDisplay} per ${auctioningTokenDisplay}`}
        isOpen={showWarning}
        onDismiss={() => {
          setShowWarning(false)
        }}
        title="Warning!"
      />
      <ConfirmationModal
        attemptingTxn={attemptingTxn}
        bottomContent={modalBottom}
        hash={txHash}
        isOpen={showConfirm}
        onDismiss={() => {
          resetModal()
          setShowConfirm(false)
        }}
        pendingConfirmation={pendingConfirmation}
        pendingText={pendingText}
        title="Confirm Order"
        topContent={modalHeader}
      />
    </Wrapper>
  )
}

export default OrderPlacement
