import { transparentize } from 'polished'
import React, { useMemo } from 'react'
import styled from 'styled-components'

import * as CSS from 'csstype'
import ScrollArea from 'react-scrollbar'

import { DerivedAuctionInfo } from '../../../state/orderPlacement/hooks'
import { useOrderbookState } from '../../../state/orderbook/hooks'
import { useOrderState } from '../../../state/orders/hooks'
import { Tooltip } from '../../common/Tooltip'
import { InfoIcon } from '../../icons/InfoIcon'
import { BaseCard } from '../../pureStyledComponents/BaseCard'
import { Cell } from '../../pureStyledComponents/Cell'
import { EmptyContentText, EmptyContentWrapper } from '../../pureStyledComponents/EmptyContent'
import { Row } from '../../pureStyledComponents/Row'
import { buildTableData } from './helpers'

export interface Props {
  tableData?: any[]
}

const Table = styled(BaseCard)`
  padding: 0;
  min-height: 352px;
  max-height: 392px;
  overflow-x: auto;
`

const TableBody = styled(ScrollArea)`
  max-height: 100%;
  overflow-x: hidden;
  min-width: 560px;
  @media (min-width: 1180px) {
    min-width: auto;
  }
  .scrollarea-content {
    touch-action: auto;
  }
`
interface CellProps {
  width?: string
}
const TableCell = styled(Cell)<Partial<CSS.Properties & CellProps>>`
  text-align: right;
  min-width: ${(props) => (props.minWidth ? props.minWidth : 'auto')};
  padding: 13px 5px;
  flex-grow: 1;
  .tooltipComponent {
    a {
      border-radius: 50%;
      width: 12px;
      height: 12px;
      border-color: ${({ theme }) => theme.textField.color};
      color: ${({ theme }) => theme.textField.color};
      font-size: 10px;
    }
  }
`
interface WrapProps {
  width?: string
}
const Wrap = styled.div<Partial<CSS.Properties & WrapProps>>`
  display: flex;
  align-items: center;
  justify-content: flex-end;
  color: ${({ theme }) => theme.textField.color};
  font-weight: 600;
  font-size: 16px;
  margin: ${(props) => (props.margin ? props.margin : '0')};
`

const OverflowWrap = styled.div`
  max-width: 100%;
  overflow-x: auto;
  flex-grow: 1;
`

const StyledRow = styled(Row)`
  border-bottom: ${({ theme }) => theme.cards.border};
  margin-bottom: 0;
  padding: 0 13px;
  grid-template-columns: 1fr 1fr 1fr 1fr;
  grid-column-gap: 15px;
  min-width: 560px;
  min-height: 50px;
  &:nth-child(odd) {
    ${({ theme }) => `background-color: ${transparentize(0.98, theme.textField.color)};`}
  }
  &:first-child {
    &:before {
      border-top-left-radius: ${({ theme }) => theme.cards.borderRadius};
      border-top-right-radius: ${({ theme }) => theme.cards.borderRadius};
    }
  }
  @media (min-width: 768px) {
    display: flex;
  }
  @media (min-width: 1180px) {
    min-width: auto;
  }
`

const StyledEmptyContentWrapper = styled(EmptyContentWrapper)`
  min-height: 352px;
`
interface OrderBookTableProps {
  derivedAuctionInfo: DerivedAuctionInfo
  granularity: string
}

export const OrderBookTable: React.FC<OrderBookTableProps> = ({
  derivedAuctionInfo,
  granularity,
}) => {
  // TODO: add the current user order?
  const { bids, error /*, userOrderPrice, userOrderVolume*/ } = useOrderbookState()
  const { orders } = useOrderState()

  const tableData = useMemo(() => {
    const myBids = orders.map((order) => ({
      price: Number(order.price),
      volume: Number(order.sellAmount),
    }))

    return buildTableData(bids, myBids, Number(granularity))
  }, [bids, orders, granularity])

  const noBids = tableData.length === 0

  return noBids || error ? (
    <StyledEmptyContentWrapper>
      <InfoIcon />
      <EmptyContentText>No bids.</EmptyContentText>
    </StyledEmptyContentWrapper>
  ) : (
    <OverflowWrap>
      <Table>
        <StyledRow cols={'1fr 1fr 1fr 1fr'}>
          <TableCell minWidth={'115px'}>
            <Wrap>
              <Wrap margin={'0 10px 0 0'}>Price ({derivedAuctionInfo.biddingToken.symbol})</Wrap>
              <Tooltip text={'Price range of limit orders for a given granularity'} />
            </Wrap>
          </TableCell>
          <TableCell minWidth={'150px'}>
            <Wrap>
              <Wrap margin={'0 10px 0 0'}>Amount ({derivedAuctionInfo.biddingToken.symbol})</Wrap>
              <Tooltip text={`Sell amount of all orders in the rows particular price range`} />
            </Wrap>
          </TableCell>
          <TableCell minWidth={'120px'}>
            <Wrap>
              <Wrap margin={'0 10px 0 0'}>Sum</Wrap>
              <Tooltip
                text={
                  'Cumulative sum of sell amounts of all orders with a limit price lower than the price mentioned in the price column'
                }
              />
            </Wrap>
          </TableCell>
          <TableCell minWidth={'90px'}>
            <Wrap>
              <Wrap margin={'0 10px 0 0'}>My Size</Wrap>
              <Tooltip text="Percentage of your sell amount in the overall sell amount of this column" />
            </Wrap>
          </TableCell>
        </StyledRow>
        <TableBody smoothScrolling speed={0.8}>
          {tableData.map((row, i) => {
            return (
              <StyledRow cols={'1fr 1fr 1fr 1fr'} key={i}>
                <TableCell minWidth={'110px'}>{row.price}</TableCell>
                <TableCell minWidth={'150px'}>{row.amount}</TableCell>
                <TableCell minWidth={'120px'}>{row.sum}</TableCell>
                <TableCell minWidth={'90px'}>{row.mySize}%</TableCell>
              </StyledRow>
            )
          })}
        </TableBody>
      </Table>
    </OverflowWrap>
  )
}
