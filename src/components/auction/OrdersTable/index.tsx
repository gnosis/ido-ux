import React, { useCallback, useState } from 'react'
import styled from 'styled-components'

import { useCancelOrderCallback } from '../../../hooks/useCancelOrderCallback'
import { DerivedAuctionInfo, useUserAuctionOrders } from '../../../state/orderPlacement/hooks'
import { AuctionIdentifier } from '../../../state/orderPlacement/reducer'
import { useOrderActionHandlers } from '../../../state/orders/hooks'
import { OrderStatus } from '../../../state/orders/reducer'
import { getChainName } from '../../../utils/tools'
import { Button } from '../../buttons/Button'
import { InlineLoading } from '../../common/InlineLoading'
import { KeyValue } from '../../common/KeyValue'
import { SpinnerSize } from '../../common/Spinner'
import { Tooltip } from '../../common/Tooltip'
import { InfoIcon } from '../../icons/InfoIcon'
import { OrderPending } from '../../icons/OrderPending'
import { OrderPlaced } from '../../icons/OrderPlaced'
import ConfirmationModal from '../../modals/ConfirmationModal'
import WarningModal from '../../modals/WarningModal'
import { BaseCard } from '../../pureStyledComponents/BaseCard'
import { Cell, CellRow } from '../../pureStyledComponents/Cell'
import { EmptyContentText, EmptyContentWrapper } from '../../pureStyledComponents/EmptyContent'
import { PageTitle } from '../../pureStyledComponents/PageTitle'
import CancelModalFooter from '../../swap/CancelOrderModealFooter'

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
interface OrderTableProps {
  auctionIdentifier: AuctionIdentifier
  derivedAuctionInfo: DerivedAuctionInfo
}

const OrderTable: React.FC<OrderTableProps> = (props) => {
  const { auctionIdentifier, derivedAuctionInfo } = props
  const { loading, orders } = useUserAuctionOrders(auctionIdentifier, derivedAuctionInfo)
  const cancelOrderCallback = useCancelOrderCallback(
    auctionIdentifier,
    derivedAuctionInfo?.biddingToken,
  )
  const { onDeleteOrder } = useOrderActionHandlers()
  const [showConfirm, setShowConfirm] = useState<boolean>(false)
  const [showWarning, setShowWarning] = useState<boolean>(false)
  const [attemptingTxn, setAttemptingTxn] = useState<boolean>(false) // clicked confirmed
  const [pendingConfirmation, setPendingConfirmation] = useState<boolean>(true) // waiting for user confirmation
  const [orderError, setOrderError] = useState<string>()

  const [txHash, setTxHash] = useState<string>('')
  const [orderId, setOrderId] = useState<string>('')

  const resetModal = useCallback(() => {
    setPendingConfirmation(true)
    setAttemptingTxn(false)
  }, [setPendingConfirmation, setAttemptingTxn])

  const onCancelOrder = useCallback(() => {
    setAttemptingTxn(true)

    cancelOrderCallback(orderId)
      .then((hash) => {
        onDeleteOrder(orderId)
        setTxHash(hash)
        setPendingConfirmation(false)
      })
      .catch((err) => {
        setOrderError(err.message)
        setShowConfirm(false)
        setPendingConfirmation(false)
        setShowWarning(true)
      })
  }, [
    setAttemptingTxn,
    setTxHash,
    setPendingConfirmation,
    onDeleteOrder,
    orderId,
    cancelOrderCallback,
  ])

  const modalBottom = () => {
    return (
      <CancelModalFooter
        biddingToken={derivedAuctionInfo?.biddingToken}
        confirmText={'Cancel'}
        onCancelOrder={onCancelOrder}
        orderId={orderId}
      />
    )
  }

  const cancelDate = React.useMemo(
    () =>
      derivedAuctionInfo?.auctionEndDate !== derivedAuctionInfo?.orderCancellationEndDate &&
      derivedAuctionInfo?.orderCancellationEndDate !== 0
        ? new Date(derivedAuctionInfo?.orderCancellationEndDate * 1000).toLocaleDateString()
        : undefined,
    [derivedAuctionInfo?.auctionEndDate, derivedAuctionInfo?.orderCancellationEndDate],
  )

  const pendingText = `Canceling Order`
  const now = Math.trunc(Date.now() / 1000)
  const isOrderCancelationAllowed = now < derivedAuctionInfo?.orderCancellationEndDate
  const ordersEmpty = !orders || orders.length == 0

  if (loading) {
    return (
      <EmptyContentWrapper>
        <InlineLoading size={SpinnerSize.small} />
      </EmptyContentWrapper>
    )
  }

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
          {orders.map((order, index) => (
            <CellRow columns={cancelDate ? 6 : 5} key={index}>
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
                  itemValue={order.sellAmount}
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
                  itemValue={order.price}
                />
              </Cell>
              <Cell>
                <KeyValue
                  align="flex-start"
                  itemKey={<span>Status</span>}
                  itemValue={
                    order.status == OrderStatus.PLACED ? (
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
                <KeyValue
                  align="flex-start"
                  itemKey={<span>Network</span>}
                  itemValue={
                    <>
                      <span>{getChainName(order.chainId)}</span>
                    </>
                  }
                />
              </Cell>
              {cancelDate && (
                <Cell>
                  <KeyValue
                    align="flex-start"
                    itemKey={
                      <>
                        <span>Last Cancel Date</span>
                        <Tooltip
                          id={`limitPrice_${index}`}
                          text={`After <strong>${cancelDate}</strong> and until the end of the auction, orders cannot be canceled.`}
                        />
                      </>
                    }
                    itemValue={cancelDate}
                  />
                </Cell>
              )}
              <Cell>
                <ButtonWrapper>
                  <ActionButton
                    disabled={!isOrderCancelationAllowed}
                    onClick={() => {
                      if (isOrderCancelationAllowed) {
                        setOrderId(order.id)
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
            content={modalBottom}
            hash={txHash}
            isOpen={showConfirm}
            onDismiss={() => {
              resetModal()
              setShowConfirm(false)
            }}
            pendingConfirmation={pendingConfirmation}
            pendingText={pendingText}
            title="Order Cancellation"
            width={394}
          />
          <WarningModal
            content={orderError}
            isOpen={showWarning}
            onDismiss={() => {
              setOrderError(null)
              setShowWarning(false)
            }}
            title="Warning!"
          />
        </Wrapper>
      )}
    </>
  )
}

export default OrderTable
