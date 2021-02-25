import React from 'react'
import { RouteComponentProps } from 'react-router-dom'
import styled from 'styled-components'

import Claimer from '../../components/Claimer'
import OrderPlacement from '../../components/OrderPlacement'
import { OrderBookBtn } from '../../components/OrderbookBtn'
import AuctionDetails from '../../components/auction/AuctionDetails'
import OrdersTable from '../../components/auction/OrdersTable'
import { ButtonCopy } from '../../components/buttons/ButtonCopy'
import { PageTitle } from '../../components/pureStyledComponents/PageTitle'
import {
  AuctionState,
  useCurrentUserOrders,
  useDefaultsFromURLSearch,
  useDerivedAuctionInfo,
  useDerivedAuctionState,
  useSwapState,
} from '../../state/orderPlacement/hooks'
import { useOrderbookDataCallback } from '../../state/orderbook/hooks'
import { useOrderState } from '../../state/orders/hooks'
import { OrderState } from '../../state/orders/reducer'

const Title = styled(PageTitle)`
  margin-bottom: 2px;
`

const SectionTitle = styled(PageTitle)`
  margin-bottom: 16px;
  margin-top: 0;
`

const SubTitleWrapper = styled.div`
  align-items: center;
  display: flex;
  margin: 0 0 40px;
`

const SubTitle = styled.h2`
  color: ${({ theme }) => theme.text1};
  font-size: 15px;
  font-weight: 400;
  line-height: 1.2;
  margin: 0 6px 0 0;
`

const CopyButton = styled(ButtonCopy)`
  height: 14px;
  position: relative;
  top: -1px;
  width: 14px;
`

const Grid = styled.div`
  column-gap: 18px;
  display: grid;
  grid-template-columns: 1fr 1fr;
  margin: 0 0 40px;
`

const Auction = ({ location: { search } }: RouteComponentProps) => {
  const { auctionState } = useDerivedAuctionState()
  const orders: OrderState | undefined = useOrderState()
  const { auctionId } = useSwapState()
  const url = window.location.href
  const { auctioningToken, biddingToken } = useDerivedAuctionInfo()

  useDefaultsFromURLSearch(search)
  useCurrentUserOrders()
  useOrderbookDataCallback()

  return (
    <>
      <Title>Auction Details</Title>
      <SubTitleWrapper>
        <SubTitle>Auction Id #{auctionId}</SubTitle>
        <CopyButton copyValue={url} title="Copy URL" />
      </SubTitleWrapper>
      <AuctionDetails />
      <SectionTitle>
        {(auctionState === AuctionState.ORDER_PLACING ||
          auctionState === AuctionState.ORDER_PLACING_AND_CANCELING) &&
          'Place Order'}
        {auctionState === AuctionState.CLAIMING && 'Claim Proceedings'}
      </SectionTitle>
      <Grid>
        {(auctionState === AuctionState.ORDER_PLACING ||
          auctionState === AuctionState.ORDER_PLACING_AND_CANCELING) && <OrderPlacement />}
        {auctionState === AuctionState.CLAIMING && <Claimer />}
        {auctionState !== undefined && auctionState !== AuctionState.NOT_YET_STARTED && (
          <OrderBookBtn baseToken={auctioningToken} quoteToken={biddingToken} />
        )}
      </Grid>
      {(auctionState === undefined || auctionState === AuctionState.NOT_YET_STARTED) && (
        <>Auction not started yet.</>
      )}
      <OrdersTable orders={orders.orders} />
    </>
  )
}

export default Auction
