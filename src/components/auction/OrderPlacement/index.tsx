import React, { useEffect, useMemo, useState } from 'react'
import styled from 'styled-components'
import { ChainId, Fraction, TokenAmount } from 'uniswap-xdai-sdk'

import { EASY_AUCTION_NETWORKS } from '../../../constants'
import { useActiveWeb3React } from '../../../hooks'
import { ApprovalState, useApproveCallback } from '../../../hooks/useApproveCallback'
import { usePlaceOrderCallback } from '../../../hooks/usePlaceOrderCallback'
import { useWalletModalToggle } from '../../../state/application/hooks'
import {
  useDerivedAuctionInfo,
  useGetOrderPlacementError,
  useSwapActionHandlers,
  useSwapState,
} from '../../../state/orderPlacement/hooks'
import { useTokenBalance } from '../../../state/wallet/hooks'
import { getTokenDisplay } from '../../../utils'
import ConfirmationModal from '../../ConfirmationModal'
import TokenLogo from '../../TokenLogo'
import { Button } from '../../buttons/Button'
import PriceInputPanel from '../../form/PriceInputPanel'
import { BaseCard } from '../../pureStyledComponents/BaseCard'
import SwapModalFooter from '../../swap/PlaceOrderModalFooter'
import SwapModalHeader from '../../swap/SwapModalHeader'
import CurrencyInputPanel from '../CurrencyInputPanel'

const Wrapper = styled(BaseCard)`
  max-width: 100%;
  min-width: 100%;
`

const ActionButton = styled(Button)`
  height: 52px;
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

const OrderPlacement: React.FC = () => {
  const { account, chainId } = useActiveWeb3React()
  const toggleWalletModal = useWalletModalToggle()
  const { price, sellAmount } = useSwapState()
  const {
    auctioningToken,
    biddingToken,
    biddingTokenBalance,
    initialPrice,
    parsedBiddingAmount,
  } = useDerivedAuctionInfo()
  const { error } = useGetOrderPlacementError()
  const { onUserSellAmountInput } = useSwapActionHandlers()
  const { onUserPriceInput } = useSwapActionHandlers()

  const isValid = !error

  // modal and loading
  const [showConfirm, setShowConfirm] = useState<boolean>(false)
  const [attemptingTxn, setAttemptingTxn] = useState<boolean>(false) // clicked confirmed
  const [pendingConfirmation, setPendingConfirmation] = useState<boolean>(true) // waiting for user confirmation

  // txn values
  const [txHash, setTxHash] = useState<string>('')

  const approvalTokenAmount: TokenAmount | undefined = parsedBiddingAmount
  // check whether the user has approved the EasyAuction Contract
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

  const maxAmountInput: TokenAmount = biddingTokenBalance ? biddingTokenBalance : undefined

  useEffect(() => {
    if (price == '-' && initialPrice) {
      onUserPriceInput(initialPrice.multiply(new Fraction('1001', '1000')).toSignificant(4))
    }
  }, [onUserPriceInput, price, initialPrice])

  const resetModal = () => {
    // clear input if txn submitted
    if (!pendingConfirmation) {
      onUserSellAmountInput('')
    }
    setPendingConfirmation(true)
    setAttemptingTxn(false)
  }

  // the callback to execute the swap
  const placeOrderCallback = usePlaceOrderCallback(auctioningToken, biddingToken)

  const onPlaceOrder = () => {
    setAttemptingTxn(true)

    placeOrderCallback().then((hash) => {
      setTxHash(hash)
      setPendingConfirmation(false)
    })
  }

  // errors
  const [showInverted, setShowInverted] = useState<boolean>(false)

  const modalHeader = () => {
    return <SwapModalHeader />
  }

  const modalBottom = () => {
    return (
      <SwapModalFooter
        auctioningToken={auctioningToken}
        biddingToken={biddingToken}
        confirmText={'Confirm Order'}
        onPlaceOrder={onPlaceOrder}
        price={price}
        sellAmount={sellAmount}
        setShowInverted={setShowInverted}
        showInverted={showInverted}
      />
    )
  }

  // text to show while loading
  const pendingText = `Placing order`
  const biddingTokenDisplay = useMemo(() => getTokenDisplay(biddingToken), [biddingToken])
  const auctioningTokenDisplay = useMemo(() => getTokenDisplay(auctioningToken), [auctioningToken])
  const userTokenBalance = useTokenBalance(account, biddingToken)

  return (
    <Wrapper>
      <BalanceWrapper>
        <Balance>
          Your Balance:{' '}
          <Total>{`${
            account
              ? `${userTokenBalance?.toSignificant(6)} ${biddingToken.symbol}`
              : 'Connect your wallet'
          } `}</Total>
        </Balance>
        {account && biddingToken && biddingToken.address && (
          <TokenLogo address={biddingToken.address} size={'22px'} />
        )}
      </BalanceWrapper>
      <CurrencyInputPanel
        onMax={() => {
          maxAmountInput && onUserSellAmountInput(maxAmountInput.toExact())
        }}
        onUserSellAmountInput={onUserSellAmountInput}
        token={biddingToken}
        value={sellAmount}
      />
      <PriceInputPanel
        auctioningToken={auctioningToken}
        biddingToken={biddingToken}
        label={`${biddingTokenDisplay} per ${auctioningTokenDisplay} price`}
        onUserPriceInput={onUserPriceInput}
        value={price}
      />
      {!account ? (
        <ActionButton onClick={toggleWalletModal}>Connect Wallet</ActionButton>
      ) : approval === ApprovalState.NOT_APPROVED || approval === ApprovalState.PENDING ? (
        <ActionButton disabled={approval === ApprovalState.PENDING} onClick={approveCallback}>
          {approval === ApprovalState.PENDING
            ? `Approving ${biddingTokenDisplay}`
            : `Approve ${biddingTokenDisplay}`}
        </ActionButton>
      ) : (
        <ActionButton
          disabled={!isValid}
          onClick={() => {
            setShowConfirm(true)
          }}
        >
          {error ?? `Place Order`}
        </ActionButton>
      )}
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
