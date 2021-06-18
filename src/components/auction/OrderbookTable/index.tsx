import { transparentize } from 'polished'
import React, { useMemo } from 'react'
import styled from 'styled-components'

import * as CSS from 'csstype'
import round from 'lodash.round'
import { Scrollbars } from 'react-custom-scrollbars'

import { NUMBER_OF_DIGITS_FOR_INVERSION } from '../../../constants/config'
import { DerivedAuctionInfo, useOrderPlacementState } from '../../../state/orderPlacement/hooks'
import { useOrderbookState } from '../../../state/orderbook/hooks'
import { useOrderState } from '../../../state/orders/hooks'
import { getTokenDisplay } from '../../../utils'
import { getInverse } from '../../../utils/prices'
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
  max-height: 100%;
  height: 100%;
  overflow-x: auto;
`

const TableBody = styled(Scrollbars)`
  max-height: 100%;
  overflow-x: hidden;
  min-width: 560px;
  @media (min-width: 1180px) {
    min-width: auto;
  }
  span:last-child {
    padding-right: 25px;
    @media (min-width: 1180px) {
      padding-right: 5px;
    }
  }
`
interface CellProps {
  width?: string
}
const TableCell = styled(Cell)<Partial<CSS.Properties & CellProps>>`
  text-align: right;
  min-width: ${(props) => (props.minWidth ? props.minWidth : 'auto')};
  padding: 13px 5px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;

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
  font-size: 14px;
  margin: ${(props) => (props.margin ? props.margin : '0')};
  white-space: normal;
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
  &:nth-child(odd) {
    ${({ theme }) => `background-color: ${transparentize(0.98, theme.textField.color)};`}
  }
  &:first-child {
    &:before {
      border-top-left-radius: ${({ theme }) => theme.cards.borderRadius};
      border-top-right-radius: ${({ theme }) => theme.cards.borderRadius};
    }
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
  const { bids, chainId, error /*, userOrderPrice, userOrderVolume*/ } = useOrderbookState()
  const { orders } = useOrderState()
  const { showPriceInverted } = useOrderPlacementState()

  const biddingTokenDisplay = useMemo(
    () => getTokenDisplay(derivedAuctionInfo?.biddingToken, chainId),
    [derivedAuctionInfo?.biddingToken, chainId],
  )

  const auctioningTokenDisplay = useMemo(
    () => getTokenDisplay(derivedAuctionInfo?.auctioningToken, chainId),
    [derivedAuctionInfo?.auctioningToken, chainId],
  )

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
              <Wrap margin={'0 10px 0 0'}>
                Price{' '}
                {showPriceInverted
                  ? `(${auctioningTokenDisplay} per ${biddingTokenDisplay})`
                  : `(${biddingTokenDisplay} per ${auctioningTokenDisplay})`}
              </Wrap>
              <Tooltip text={'Price range of limit orders for a given granularity'} />
            </Wrap>
          </TableCell>
          <TableCell minWidth={'150px'}>
            <Wrap>
              <Wrap margin={'0 10px 0 0'}>Amount ({biddingTokenDisplay})</Wrap>
              <Tooltip text={`Sell amount of all orders in the rows particular price range`} />
            </Wrap>
          </TableCell>
          <TableCell minWidth={'120px'}>
            <Wrap>
              <Wrap margin={'0 10px 0 0'}>Sum</Wrap>
              <Tooltip
                text={`Cumulative sum of sell amounts of all orders with a limit price ${
                  showPriceInverted ? 'higher' : 'lower'
                } than the price mentioned in the price column`}
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
        <TableBody style={{ height: '300px' }}>
          {tableData.map((row, i) => {
            return (
              <StyledRow cols={'1fr 1fr 1fr 1fr'} key={i}>
                <TableCell
                  minWidth={'110px'}
                  title={
                    showPriceInverted
                      ? getInverse(String(row.price), NUMBER_OF_DIGITS_FOR_INVERSION)
                      : String(row.price)
                  }
                >
                  {showPriceInverted
                    ? getInverse(String(row.price), NUMBER_OF_DIGITS_FOR_INVERSION)
                    : row.price}
                </TableCell>
                <TableCell minWidth={'150px'} title={round(row.amount, 6)}>
                  {round(row.amount, 6)}
                </TableCell>
                <TableCell minWidth={'120px'} title={round(row.sum, 6)}>
                  {round(row.sum, 6)}
                </TableCell>
                <TableCell minWidth={'90px'}>{row.mySize}%</TableCell>
              </StyledRow>
            )
          })}
        </TableBody>
      </Table>
    </OverflowWrap>
  )
}
