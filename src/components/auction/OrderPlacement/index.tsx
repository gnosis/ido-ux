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
import { getTokenDisplay } from '../../../utils'
import ConfirmationModal from '../../ConfirmationModal'
import CurrencyInputPanel from '../../CurrencyInputPanel'
import PriceInputPanel from '../../PriceInputPanel'
import { Button } from '../../buttons/Button'
import { BaseCard } from '../../pureStyledComponents/BaseCard'
import SwapModalFooter from '../../swap/PlaceOrderModalFooter'
import SwapModalHeader from '../../swap/SwapModalHeader'

const ActionButton = styled(Button)`
  height: 52px;
`

const OrderPlacement: React.FC = () => {
  const { account, chainId } = useActiveWeb3React()

  // toggle wallet when disconnected
  const toggleWalletModal = useWalletModalToggle()

  // swap state
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
  const atMaxAmountInput: boolean =
    maxAmountInput && parsedBiddingAmount ? maxAmountInput.equalTo(parsedBiddingAmount) : undefined

  useEffect(() => {
    if (price == '-' && initialPrice) {
      onUserPriceInput(initialPrice.multiply(new Fraction('1001', '1000')).toSignificant(4))
    }
  }, [onUserPriceInput, price, initialPrice])

  // reset modal state when closed
  function resetModal() {
    // clear input if txn submitted
    if (!pendingConfirmation) {
      onUserSellAmountInput('')
    }
    setPendingConfirmation(true)
    setAttemptingTxn(false)
  }

  // the callback to execute the swap
  const placeOrderCallback = usePlaceOrderCallback(auctioningToken, biddingToken)

  function onPlaceOrder() {
    setAttemptingTxn(true)

    placeOrderCallback().then((hash) => {
      setTxHash(hash)
      setPendingConfirmation(false)
    })
  }

  // errors
  const [showInverted, setShowInverted] = useState<boolean>(false)

  function modalHeader() {
    return <SwapModalHeader />
  }

  function modalBottom() {
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

  return (
    <BaseCard>
      <CurrencyInputPanel
        id="auction-input"
        label={'Amount'}
        onMax={() => {
          maxAmountInput && onUserSellAmountInput(maxAmountInput.toExact())
        }}
        onUserSellAmountInput={onUserSellAmountInput}
        showMaxButton={!atMaxAmountInput}
        token={biddingToken}
        value={sellAmount}
      />
      <PriceInputPanel
        auctioningToken={auctioningToken}
        biddingToken={biddingToken}
        id="price-input"
        label={`Price — ${biddingTokenDisplay} per ${auctioningTokenDisplay}`}
        onUserPriceInput={onUserPriceInput}
        showMaxButton={false}
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
          id="swap-button"
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
    </BaseCard>
  )
}

export default OrderPlacement
