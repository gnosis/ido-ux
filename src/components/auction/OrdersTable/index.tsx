import React, { useState } from 'react'
import styled, { css } from 'styled-components'

import { useCancelOrderCallback } from '../../../hooks/useCancelOrderCallback'
import {
  AuctionState,
  useDerivedAuctionInfo,
  useDerivedAuctionState,
} from '../../../state/orderPlacement/hooks'
import { useOrderActionHandlers } from '../../../state/orders/hooks'
import { OrderDisplay, OrderStatus } from '../../../state/orders/reducer'
import ConfirmationModal from '../../ConfirmationModal'
import { Button } from '../../buttons/Button'
import { KeyValue } from '../../common/KeyValue'
import { Tooltip } from '../../common/Tooltip'
import { LockBig } from '../../icons/LockBig'
import { EmptyContentText, EmptyContentWrapper } from '../../pureStyledComponents/EmptyContent'
import { PageTitle } from '../../pureStyledComponents/PageTitle'
import CancelModalFooter from '../../swap/CancelOrderModealFooter'
import SwapModalHeader from '../../swap/SwapModalHeader'

const Wrapper = styled.div`
  border-radius: 12px;
  border: 1px solid ${({ theme }) => theme.border};
  padding: 4px 0;
`

const Grid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr 1fr 115px;
`

const ActionButton = styled(Button)`
  border-radius: 6px;
  font-size: 14px;
  font-weight: 600;
  height: 28px;
`

const CommonCellCSS = css`
  border-bottom: 1px solid ${({ theme }) => theme.border};
  padding: 13px 15px;

  &:nth-last-child(-n + 4) {
    border-bottom: none;
  }
`

const Cell = styled(KeyValue)`
  ${CommonCellCSS}
`

const ButtonWrapper = styled.div`
  ${CommonCellCSS}
  display: flex;
  align-items: center;
  justify-content: flex-end;
`

const OrderTable: React.FC<{ orders: OrderDisplay[] }> = (props) => {
  const { orders } = props
  const { auctionState } = useDerivedAuctionState()
  const { biddingToken } = useDerivedAuctionInfo()
  const cancelOrderCallback = useCancelOrderCallback(biddingToken)
  const { onDeleteOrder } = useOrderActionHandlers()

  // modal and loading
  const [showConfirm, setShowConfirm] = useState<boolean>(false)
  const [attemptingTxn, setAttemptingTxn] = useState<boolean>(false) // clicked confirmed
  const [pendingConfirmation, setPendingConfirmation] = useState<boolean>(true) // waiting for user confirmation

  // txn values
  const [txHash, setTxHash] = useState<string>('')
  const [orderId, setOrderId] = useState<string>('')

  // reset modal state when closed
  function resetModal() {
    setPendingConfirmation(true)
    setAttemptingTxn(false)
  }

  function onCancelOrder() {
    setAttemptingTxn(true)

    cancelOrderCallback(orderId).then((hash) => {
      onDeleteOrder(orderId)
      setTxHash(hash)
      setPendingConfirmation(false)
    })
  }

  function modalHeader() {
    return <SwapModalHeader />
  }

  function modalBottom() {
    return (
      <CancelModalFooter
        biddingToken={biddingToken}
        confirmText={'Cancel Order'}
        onCancelOrder={onCancelOrder}
        orderId={orderId}
      />
    )
  }
  const pendingText = `Canceling Order`
  const orderPlacingOnly = auctionState === AuctionState.ORDER_PLACING
  const ordersEmpty = !orders || orders.length == 0

  return (
    <>
      <PageTitle>Your Orders</PageTitle>
      <Wrapper>
        {ordersEmpty && (
          <EmptyContentWrapper>
            <LockBig />
            <EmptyContentText>You have no orders for this auction.</EmptyContentText>
          </EmptyContentWrapper>
        )}
        {!ordersEmpty && (
          <>
            <Grid>
              {Object.entries(orders).map((order, index) => (
                <>
                  <Cell
                    align="flex-start"
                    itemKey={
                      <>
                        <span>Amount</span>
                        <Tooltip id={`amount_${index}`} text={'Amount tooltip'} />
                      </>
                    }
                    itemValue={order[1].sellAmount}
                  />
                  <Cell
                    align="flex-start"
                    itemKey={
                      <>
                        <span>Limit Price</span>
                        <Tooltip id={`limitPrice_${index}`} text={'Limit Price tooltip'} />
                      </>
                    }
                    itemValue={order[1].price}
                  />
                  <Cell
                    align="flex-start"
                    itemKey={<span>Status</span>}
                    itemValue={order[1].status == OrderStatus.PLACED ? 'Placed' : 'Pending'}
                  />
                  <ButtonWrapper>
                    <ActionButton
                      disabled={orderPlacingOnly}
                      onClick={() => {
                        if (!orderPlacingOnly) {
                          setOrderId(order[1].id)
                          setShowConfirm(true)
                        }
                      }}
                    >
                      Cancel
                    </ActionButton>
                  </ButtonWrapper>
                </>
              ))}
            </Grid>
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
          </>
        )}
      </Wrapper>
    </>
  )
}

export default OrderTable
