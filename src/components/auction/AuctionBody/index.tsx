import React from 'react'
import styled from 'styled-components'

import { AuctionState, useDerivedAuctionState } from '../../../state/orderPlacement/hooks'
import { InlineLoading } from '../../common/InlineLoading'
import { PageTitle } from '../../pureStyledComponents/PageTitle'
import { AuctionNotStarted } from '../AuctionNotStarted'
import { AuctionPending } from '../AuctionPending'
import Claimer from '../Claimer'
import OrderPlacement from '../OrderPlacement'
import { OrderBook } from '../Orderbook'
import OrdersTable from '../OrdersTable'

const SectionTitle = styled(PageTitle)`
  margin-bottom: 16px;
  margin-top: 0;
`

const Grid = styled.div`
  column-gap: 18px;
  display: grid;
  grid-template-columns: 1fr 1fr;
  margin: 0 0 40px;
`

const AuctionBody = () => {
  const { auctionState, loading } = useDerivedAuctionState()
  const auctionStarted = React.useMemo(
    () => auctionState !== undefined && auctionState !== AuctionState.NOT_YET_STARTED,
    [auctionState],
  )

  const isNotLoading = React.useMemo(() => auctionState !== null && !loading, [
    loading,
    auctionState,
  ])
  return (
    <>
      {!isNotLoading && <InlineLoading message="Loading..." />}
      {auctionStarted && isNotLoading && (
        <SectionTitle as="h2">
          {(auctionState === AuctionState.ORDER_PLACING ||
            auctionState === AuctionState.ORDER_PLACING_AND_CANCELING) &&
            'Place Order'}
          {auctionState === AuctionState.CLAIMING && 'Claim Proceedings'}
        </SectionTitle>
      )}
      {auctionStarted && isNotLoading && (
        <Grid>
          {(auctionState === AuctionState.ORDER_PLACING ||
            auctionState === AuctionState.ORDER_PLACING_AND_CANCELING) && <OrderPlacement />}
          {auctionState === AuctionState.CLAIMING && <Claimer />}
          {auctionState === AuctionState.PRICE_SUBMISSION && (
            <AuctionPending>Auction closed. Pending on-chain price-calculation.</AuctionPending>
          )}
          <OrderBook />
        </Grid>
      )}
      {auctionState === AuctionState.NOT_YET_STARTED && <AuctionNotStarted />}
      {auctionStarted && isNotLoading && <OrdersTable />}
    </>
  )
}
export default AuctionBody
