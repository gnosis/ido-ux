import React, { useCallback, useState } from 'react'
import styled from 'styled-components'

import * as CSS from 'csstype'

import { NUMBER_OF_DIGITS_FOR_INVERSION } from '../../../constants/config'
import { useCancelOrderCallback } from '../../../hooks/useCancelOrderCallback'
import {
  AuctionState,
  DerivedAuctionInfo,
  useAllUserOrders,
  useOrderPlacementState,
} from '../../../state/orderPlacement/hooks'
import { AuctionIdentifier } from '../../../state/orderPlacement/reducer'
import { useOrderState } from '../../../state/orders/hooks'
import { OrderState, OrderStatus } from '../../../state/orders/reducer'
import { abbreviation } from '../../../utils/numeral'
import { getInverse } from '../../../utils/prices'
import { getChainName } from '../../../utils/tools'
import { Button } from '../../buttons/Button'
import { Tooltip } from '../../common/Tooltip'
import { InfoIcon } from '../../icons/InfoIcon'
import { OrderPending } from '../../icons/OrderPending'
import { OrderPlaced } from '../../icons/OrderPlaced'
import ConfirmationModal from '../../modals/ConfirmationModal'
import WarningModal from '../../modals/WarningModal'
import CancelModalFooter from '../../modals/common/CancelModalFooter'
import { BaseCard } from '../../pureStyledComponents/BaseCard'
import { Cell, CellRow, getColumns } from '../../pureStyledComponents/Cell'
import { EmptyContentText, EmptyContentWrapper } from '../../pureStyledComponents/EmptyContent'
import { PageTitle } from '../../pureStyledComponents/PageTitle'

const Wrapper = styled.div``

const TableWrapper = styled(BaseCard)`
  padding: 4px 0;
`

const Title = styled(PageTitle)`
  margin-bottom: 16px;
  margin-top: 0;
`
interface RowProps {
  hiddenMd?: boolean
}

const Row = styled(CellRow)<Partial<CSS.Properties & RowProps>>`
  grid-template-columns: 1fr 1fr;
  row-gap: 15px;
  color: ${({ theme }) => theme.dropdown.item.color};
  ${(props) => props.hiddenMd && 'display : none'};
  align-items: center;
  font-size: 16px;
  p {
    display: flex;
    margin: 0;
    align-items: center;
  }
  p + span {
    display: flex;
    svg {
      margin-left: 6px;
    }
  }
  .tooltipComponent {
    margin-left: 6px;
  }

  @media (min-width: ${({ theme }) => theme.themeBreakPoints.md}) {
    grid-template-columns: ${(props) => getColumns(props.columns)};
    ${(props) => props.hiddenMd && 'display : grid'};
    > span {
      line-height: 1;
    }
    p {
      display: none;
    }
  }
`

const ButtonCell = styled(Cell)`
  grid-column-end: -1;
  grid-column-start: 1;

  @media (min-width: ${({ theme }) => theme.themeBreakPoints.md}) {
    grid-column-end: unset;
    grid-column-start: unset;
  }
`

const ButtonWrapper = styled.div`
  align-items: center;
  display: flex;
  height: 100%;
  justify-content: flex-end;
`

const ActionButton = styled(Button)`
  border-radius: 6px;
  font-size: 14px;
  font-weight: 600;
  height: 28px;
  width: 100%;

  @media (min-width: ${({ theme }) => theme.themeBreakPoints.md}) {
    width: auto;
  }
`

const StyledCell = styled.div`
  display: flex;
  align-items: center;
  color: ${({ theme }) => theme.dropdown.item.color};
  font-size: 18px;
  > *:first-child {
    padding-right: 6px;
  }
`

interface OrdersTableProps {
  auctionIdentifier: AuctionIdentifier
  derivedAuctionInfo: DerivedAuctionInfo
}

const OrdersTable: React.FC<OrdersTableProps> = (props) => {
  const {
    auctionIdentifier,
    derivedAuctionInfo,
    derivedAuctionInfo: { auctionState },
    ...restProps
  } = props
  const orders: OrderState | undefined = useOrderState()
  const cancelOrderCallback = useCancelOrderCallback(
    auctionIdentifier,
    derivedAuctionInfo?.biddingToken,
  )
  const [showConfirm, setShowConfirm] = useState<boolean>(false)
  const [showWarning, setShowWarning] = useState<boolean>(false)
  const [attemptingTxn, setAttemptingTxn] = useState<boolean>(false) // clicked confirmed
  const [pendingConfirmation, setPendingConfirmation] = useState<boolean>(true) // waiting for user confirmation
  const [orderError, setOrderError] = useState<string>()
  const [txHash, setTxHash] = useState<string>('')
  const [orderId, setOrderId] = useState<string>('')
  const { showPriceInverted } = useOrderPlacementState()

  const resetModal = useCallback(() => {
    setPendingConfirmation(true)
    setAttemptingTxn(false)
  }, [setPendingConfirmation, setAttemptingTxn])

  const onCancelOrder = useCallback(() => {
    setAttemptingTxn(true)

    cancelOrderCallback(orderId)
      .then((hash) => {
        setTxHash(hash)
        setPendingConfirmation(false)
      })
      .catch((err) => {
        setOrderError(err.message)
        setShowConfirm(false)
        setPendingConfirmation(false)
        setShowWarning(true)
      })
  }, [setAttemptingTxn, setTxHash, setPendingConfirmation, orderId, cancelOrderCallback])

  const hasLastCancellationDate =
    derivedAuctionInfo?.auctionEndDate !== derivedAuctionInfo?.orderCancellationEndDate &&
    derivedAuctionInfo?.orderCancellationEndDate !== 0
  const orderCancellationEndMilliseconds = derivedAuctionInfo?.orderCancellationEndDate * 1000

  const pendingText = `Cancelling Order`
  const orderStatusText = {
    [OrderStatus.PLACED]: 'Placed',
    [OrderStatus.PENDING]: 'Pending',
    [OrderStatus.PENDING_CANCELLATION]: 'Cancelling',
  }
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

  const priceExplainer = React.useMemo(
    () =>
      showPriceInverted
        ? 'The minimum price you are willing to participate at. You might receive a better price, but if the clearing price is lower, you will not participate and can claim your funds back when the auction ends.'
        : 'The maximum price you are willing to participate at. You might receive a better price, but if the clearing price is higher, you will not participate and can claim your funds back when the auction ends.',
    [showPriceInverted],
  )

  return (
    <Wrapper {...restProps}>
      <Title as="h2">Your Orders</Title>
      {ordersEmpty && (
        <EmptyContentWrapper>
          <InfoIcon />
          <EmptyContentText>You have no orders for this auction.</EmptyContentText>
        </EmptyContentWrapper>
      )}
      {!ordersEmpty && (
        <TableWrapper>
          <Row columns={hideCancelButton ? 4 : 5} hiddenMd>
            <StyledCell>
              <div>Amount</div>
              <Tooltip text={'The amount of bidding token committed to the order.'} />
            </StyledCell>
            <StyledCell>
              <div>Limit Price</div>
              <Tooltip text={priceExplainer} />
            </StyledCell>
            <StyledCell>
              <div>Status</div>
            </StyledCell>
            <StyledCell>
              <div>Network</div>
            </StyledCell>
          </Row>
          {ordersSortered.map((order) => (
            <Row columns={hideCancelButton ? 4 : 5} key={order.id}>
              <Cell>
                <p>
                  <span>Amount</span>
                  <Tooltip text={'The amount of bidding token committed to the order.'} />
                </p>
                <span>{abbreviation(order.sellAmount)}</span>
              </Cell>
              <Cell>
                <p>
                  <span>Limit Price</span>
                  <Tooltip text={priceExplainer} />
                </p>
                <span>
                  {abbreviation(
                    showPriceInverted
                      ? getInverse(order.price, NUMBER_OF_DIGITS_FOR_INVERSION)
                      : order.price,
                  )}
                </span>
              </Cell>
              <Cell>
                <p>Status</p>
                <span>
                  <span>{orderStatusText[order.status]}</span>
                  {order.status === OrderStatus.PLACED ? <OrderPlaced /> : <OrderPending />}
                </span>
              </Cell>
              <Cell>
                <p>Network</p>
                <span>{getChainName(order.chainId)}</span>
              </Cell>
              {!hideCancelButton && (
                <ButtonCell>
                  <ButtonWrapper>
                    <ActionButton
                      disabled={
                        isOrderCancellationExpired ||
                        order.status === OrderStatus.PENDING_CANCELLATION
                      }
                      onClick={() => {
                        setOrderId(order.id)
                        setShowConfirm(true)
                      }}
                    >
                      Cancel
                    </ActionButton>
                  </ButtonWrapper>
                </ButtonCell>
              )}
            </Row>
          ))}
          <ConfirmationModal
            attemptingTxn={attemptingTxn}
            content={
              <CancelModalFooter confirmText={'Cancel Order'} onCancelOrder={onCancelOrder} />
            }
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

export default OrdersTable
