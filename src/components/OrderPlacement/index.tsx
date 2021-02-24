import React, { useEffect, useMemo, useState } from 'react'
import { ChainId, Fraction, TokenAmount } from 'uniswap-xdai-sdk'

import { Text } from 'rebass'

import { ButtonLight, ButtonPrimary } from '../../components/Button'
import { AutoColumn } from '../../components/Column'
import ConfirmationModal from '../../components/ConfirmationModal'
import CurrencyInputPanel from '../../components/CurrencyInputPanel'
import PriceInputPanel from '../../components/PriceInputPanel'
import SwapModalHeader from '../../components/swap/SwapModalHeader'
import { BottomGrouping, Dots, Wrapper } from '../../components/swap/styleds'
import { EASY_AUCTION_NETWORKS } from '../../constants'
import { useActiveWeb3React } from '../../hooks'
import { ApprovalState, useApproveCallback } from '../../hooks/useApproveCallback'
import { usePlaceOrderCallback } from '../../hooks/usePlaceOrderCallback'
import { useWalletModalToggle } from '../../state/application/hooks'
import {
  useDerivedAuctionInfo,
  useGetOrderPlacementError,
  useSwapActionHandlers,
  useSwapState,
} from '../../state/orderPlacement/hooks'
import { getTokenDisplay } from '../../utils'
import SwapModalFooter from '../swap/PlaceOrderModalFooter'

export default function OrderPlacement() {
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
    <>
      <Wrapper id="swap-page">
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
        <AutoColumn gap={'md'}>
          <>
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
          </>
        </AutoColumn>
        <BottomGrouping>
          {!account ? (
            <ButtonLight onClick={toggleWalletModal}>Connect Wallet</ButtonLight>
          ) : approval === ApprovalState.NOT_APPROVED || approval === ApprovalState.PENDING ? (
            <ButtonPrimary disabled={approval === ApprovalState.PENDING} onClick={approveCallback}>
              {approval === ApprovalState.PENDING ? (
                <Dots>Approving {biddingTokenDisplay}</Dots>
              ) : (
                `Approve ${biddingTokenDisplay}`
              )}
            </ButtonPrimary>
          ) : (
            <ButtonPrimary
              disabled={!isValid}
              id="swap-button"
              onClick={() => {
                setShowConfirm(true)
              }}
            >
              <Text fontSize={20} fontWeight={500}>
                {error ?? `Place Order`}
              </Text>
            </ButtonPrimary>
          )}
        </BottomGrouping>
      </Wrapper>
    </>
  )
}
