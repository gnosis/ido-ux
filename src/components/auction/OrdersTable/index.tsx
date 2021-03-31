import React, { useCallback, useState } from 'react'
import styled from 'styled-components'

import { useCancelOrderCallback } from '../../../hooks/useCancelOrderCallback'
import {
  AuctionState,
  DerivedAuctionInfo,
  useAllUserOrders,
} from '../../../state/orderPlacement/hooks'
import { AuctionIdentifier } from '../../../state/orderPlacement/reducer'
import { useOrderActionHandlers, useOrderState } from '../../../state/orders/hooks'
import { OrderState, OrderStatus } from '../../../state/orders/reducer'
import { abbreviation } from '../../../utils/numeral'
import { getChainName } from '../../../utils/tools'
import { Button } from '../../buttons/Button'
import { KeyValue } from '../../common/KeyValue'
import { Tooltip } from '../../common/Tooltip'
import { ErrorInfo } from '../../icons/ErrorInfo'
import { InfoIcon } from '../../icons/InfoIcon'
import { OrderPending } from '../../icons/OrderPending'
import { OrderPlaced } from '../../icons/OrderPlaced'
import ConfirmationModal from '../../modals/ConfirmationModal'
import WarningModal from '../../modals/WarningModal'
import CancelModalFooter from '../../modals/common/CancelModalFooter'
import { BaseCard } from '../../pureStyledComponents/BaseCard'
import { Cell, CellRow } from '../../pureStyledComponents/Cell'
import { EmptyContentText, EmptyContentWrapper } from '../../pureStyledComponents/EmptyContent'
import { PageTitle } from '../../pureStyledComponents/PageTitle'
import { SubTitle, SubTitleWrapper } from '../../pureStyledComponents/SubTitle'

const Wrapper = styled.div`
  padding-bottom: 50px;
`

const TableWrapper = styled(BaseCard)`
  padding: 4px 0;
`

const Title = styled(PageTitle)`
  margin-bottom: 16px;
  margin-top: 0;
`

const SubTitleWrapperStyled = styled(SubTitleWrapper)`
  margin-bottom: 12px;
`

const ErrorIcon = styled(ErrorInfo)`
  margin-right: 8px;
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
  auctionState: AuctionState
  derivedAuctionInfo: DerivedAuctionInfo
}

const OrderTable: React.FC<OrderTableProps> = (props) => {
  const { auctionIdentifier, auctionState, derivedAuctionInfo, ...restProps } = props
  const orders: OrderState | undefined = useOrderState()
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
        confirmText={'Cancel Order'}
        onCancelOrder={onCancelOrder}
        orderId={orderId}
      />
    )
  }

  const hasLastCancellationDate =
    derivedAuctionInfo?.auctionEndDate !== derivedAuctionInfo?.orderCancellationEndDate &&
    derivedAuctionInfo?.orderCancellationEndDate !== 0
  const orderCancellationEndMilliseconds = derivedAuctionInfo?.orderCancellationEndDate * 1000
  const orderCancellationEndDate = React.useMemo(() => new Date(orderCancellationEndMilliseconds), [
    orderCancellationEndMilliseconds,
  ])
  const cancelDateFull = React.useMemo(
    () => (hasLastCancellationDate ? orderCancellationEndDate.toLocaleString() : undefined),
    [orderCancellationEndDate, hasLastCancellationDate],
  )

  const pendingText = `Cancelling Order`
  const now = Math.trunc(Date.now())
  const ordersEmpty = !orders.orders || orders.orders.length == 0

  // the array is frozen in strict mode, we will need to copy the array before sorting it
  const ordersSortered = orders.orders
    .slice()
    .sort((orderA, orderB) => Number(orderB.price) - Number(orderA.price))
  const orderPlacingOnly = auctionState === AuctionState.ORDER_PLACING
  const isOrderCancellationExpired =
    hasLastCancellationDate && now > orderCancellationEndMilliseconds && orderPlacingOnly
  const orderSubmissionFinished =
    auctionState === AuctionState.CLAIMING || auctionState === AuctionState.PRICE_SUBMISSION
  const hideCancelButton = orderPlacingOnly || orderSubmissionFinished

  useAllUserOrders(auctionIdentifier, derivedAuctionInfo)

  return (
    <Wrapper {...restProps}>
      <Title as="h2">Your Orders</Title>
      {!orderSubmissionFinished && (hasLastCancellationDate || orderPlacingOnly) && (
        <SubTitleWrapperStyled>
          <ErrorIcon />
          {orderPlacingOnly && (
            <SubTitle as="h3">Orders for this auction can&apos;t be cancelled</SubTitle>
          )}
          {!orderPlacingOnly && !isOrderCancellationExpired && (
            <SubTitle as="h3">
              The order cancellation period expires on&nbsp;<strong>{cancelDateFull}</strong>. You
              can&apos;t cancel your orders after that.
            </SubTitle>
          )}
        </SubTitleWrapperStyled>
      )}
      {ordersEmpty && (
        <EmptyContentWrapper>
          <InfoIcon />
          <EmptyContentText>You have no orders for this auction.</EmptyContentText>
        </EmptyContentWrapper>
      )}
      {!ordersEmpty && (
        <TableWrapper>
          {ordersSortered.map((order, index) => (
            <CellRow columns={hideCancelButton ? 4 : 5} key={index}>
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
                  itemValue={abbreviation(order.sellAmount)}
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
                  itemValue={abbreviation(order.price)}
                />
              </Cell>
              <Cell>
                <KeyValue
                  align="flex-start"
                  itemKey={<span>Status</span>}
                  itemValue={
                    order.status === OrderStatus.PLACED ? (
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
              {!hideCancelButton && (
                <Cell>
                  <ButtonWrapper>
                    <ActionButton
                      disabled={isOrderCancellationExpired}
                      onClick={() => {
                        setOrderId(order.id)
                        setShowConfirm(true)
                      }}
                    >
                      Cancel
                    </ActionButton>
                  </ButtonWrapper>
                </Cell>
              )}
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
            title="Warning!"
            width={394}
          />
          <WarningModal
            content={orderError}
            isOpen={showWarning}
            onDismiss={() => {
              resetModal()
              setOrderError(null)
              setShowWarning(false)
            }}
            title="Warning!"
          />
        </TableWrapper>
      )}
    </Wrapper>
  )
}

export default OrderTable
