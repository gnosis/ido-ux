import React, { useCallback, useState } from 'react'
import styled from 'styled-components'

import { useCancelOrderCallback } from '../../../hooks/useCancelOrderCallback'
import { useCurrentUserOrders, useDerivedAuctionInfo } from '../../../state/orderPlacement/hooks'
import { useOrderActionHandlers, useOrderState } from '../../../state/orders/hooks'
import { OrderState, OrderStatus } from '../../../state/orders/reducer'
import { Button } from '../../buttons/Button'
import { KeyValue } from '../../common/KeyValue'
import { Tooltip } from '../../common/Tooltip'
import { InfoIcon } from '../../icons/InfoIcon'
import { OrderPending } from '../../icons/OrderPending'
import { OrderPlaced } from '../../icons/OrderPlaced'
import ConfirmationModal from '../../modals/ConfirmationModal'
import { BaseCard } from '../../pureStyledComponents/BaseCard'
import { Cell, CellRow } from '../../pureStyledComponents/Cell'
import { EmptyContentText, EmptyContentWrapper } from '../../pureStyledComponents/EmptyContent'
import { PageTitle } from '../../pureStyledComponents/PageTitle'
import CancelModalFooter from '../../swap/CancelOrderModealFooter'
import SwapModalHeader from '../../swap/SwapModalHeader'

const Wrapper = styled(BaseCard)`
  padding: 4px 0;
`

const SectionTitle = styled(PageTitle)`
  margin-bottom: 16px;
  margin-top: 0;
`

const ActionButton = styled(Button)`
  border-radius: 6px;
  font-size: 14px;
  font-weight: 600;
  height: 28px;
`

const ButtonWrapper = styled.div`
  align-items: center;
  display: flex;
  height: 100%;
  justify-content: flex-end;
`

const OrderTable: React.FC = () => {
  const orders: OrderState | undefined = useOrderState()
  const derivedAuctionInfo = useDerivedAuctionInfo()
  const cancelOrderCallback = useCancelOrderCallback(derivedAuctionInfo?.biddingToken)
  const { onDeleteOrder } = useOrderActionHandlers()
  useCurrentUserOrders()

  const [showConfirm, setShowConfirm] = useState<boolean>(false)
  const [attemptingTxn, setAttemptingTxn] = useState<boolean>(false) // clicked confirmed
  const [pendingConfirmation, setPendingConfirmation] = useState<boolean>(true) // waiting for user confirmation

  const [txHash, setTxHash] = useState<string>('')
  const [orderId, setOrderId] = useState<string>('')

  const resetModal = useCallback(() => {
    setPendingConfirmation(true)
    setAttemptingTxn(false)
  }, [setPendingConfirmation, setAttemptingTxn])

  const onCancelOrder = useCallback(() => {
    setAttemptingTxn(true)

    cancelOrderCallback(orderId).then((hash) => {
      onDeleteOrder(orderId)
      setTxHash(hash)
      setPendingConfirmation(false)
    })
  }, [
    setAttemptingTxn,
    setTxHash,
    setPendingConfirmation,
    onDeleteOrder,
    orderId,
    cancelOrderCallback,
  ])

  const modalHeader = () => {
    return <SwapModalHeader />
  }

  const modalBottom = () => {
    return (
      <CancelModalFooter
        biddingToken={derivedAuctionInfo?.biddingToken}
        confirmText={'Cancel Order'}
        onCancelOrder={onCancelOrder}
        orderId={orderId}
      />
    )
  }

  const pendingText = `Canceling Order`
  const now = Math.trunc(Date.now() / 1000)
  const isOrderCancelationAllowed = now < derivedAuctionInfo?.orderCancellationEndDate
  const ordersEmpty = !orders.orders || orders.orders.length == 0
  return (
    <>
      <SectionTitle as="h2">Your Orders</SectionTitle>
      {ordersEmpty && (
        <EmptyContentWrapper>
          <InfoIcon />
          <EmptyContentText>You have no orders for this auction.</EmptyContentText>
        </EmptyContentWrapper>
      )}
      {!ordersEmpty && (
        <Wrapper>
          {Object.entries(orders.orders).map((order, index) => (
            <CellRow columns={4} key={index}>
              <Cell>
                <KeyValue
                  align="flex-start"
                  itemKey={
                    <>
                      <span>Amount</span>
                      <Tooltip
                        id={`amount_${index}`}
                        text={'The amount of bidding token committed to the order.'}
                      />
                    </>
                  }
                  itemValue={order[1].sellAmount}
                />
              </Cell>
              <Cell>
                <KeyValue
                  align="flex-start"
                  itemKey={
                    <>
                      <span>Limit Price</span>
                      <Tooltip
                        id={`limitPrice_${index}`}
                        text={
                          'The maximum price you are willing to participate at. You might receive a better price, but if the clearing price is higher, you will not participate and can claim your funds back when the auction ends.'
                        }
                      />
                    </>
                  }
                  itemValue={order[1].price}
                />
              </Cell>
              <Cell>
                <KeyValue
                  align="flex-start"
                  itemKey={<span>Status</span>}
                  itemValue={
                    order[1].status == OrderStatus.PLACED ? (
                      <>
                        <span>Placed</span>
                        <OrderPlaced />
                      </>
                    ) : (
                      <>
                        <span>Pending</span>
                        <OrderPending />
                      </>
                    )
                  }
                />
              </Cell>
              <Cell>
                <ButtonWrapper>
                  <ActionButton
                    disabled={!isOrderCancelationAllowed}
                    onClick={() => {
                      if (isOrderCancelationAllowed) {
                        setOrderId(order[1].id)
                        setShowConfirm(true)
                      }
                    }}
                  >
                    Cancel
                  </ActionButton>
                </ButtonWrapper>
              </Cell>
            </CellRow>
          ))}
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
            title="Confirm Order Cancellation"
            topContent={modalHeader}
          />
        </Wrapper>
      )}
    </>
  )
}

export default OrderTable
