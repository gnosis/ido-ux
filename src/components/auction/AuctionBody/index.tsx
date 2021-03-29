import React from 'react'
import styled from 'styled-components'

import { AuctionState, DerivedAuctionInfo } from '../../../state/orderPlacement/hooks'
import { AuctionIdentifier } from '../../../state/orderPlacement/reducer'
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

interface AuctionBodyProps {
  auctionIdentifier: AuctionIdentifier
  derivedAuctionInfo: DerivedAuctionInfo
  auctionState: Maybe<AuctionState>
}

const AuctionBody = (props: AuctionBodyProps) => {
  const { auctionIdentifier, auctionState, derivedAuctionInfo } = props
  const auctionStarted = React.useMemo(
    () => auctionState !== undefined && auctionState !== AuctionState.NOT_YET_STARTED,
    [auctionState],
  )

  return (
    <>
      {auctionStarted && (
        <SectionTitle as="h2">
          {(auctionState === AuctionState.ORDER_PLACING ||
            auctionState === AuctionState.ORDER_PLACING_AND_CANCELING) &&
            'Place Order'}
          {auctionState === AuctionState.CLAIMING && 'Claim Proceeds'}
        </SectionTitle>
      )}
      {auctionStarted && (
        <Grid>
          {(auctionState === AuctionState.ORDER_PLACING ||
            auctionState === AuctionState.ORDER_PLACING_AND_CANCELING) && (
            <OrderPlacement
              auctionIdentifier={auctionIdentifier}
              auctionState={auctionState}
              derivedAuctionInfo={derivedAuctionInfo}
            />
          )}
          {auctionState === AuctionState.CLAIMING && (
            <Claimer
              auctionIdentifier={auctionIdentifier}
              derivedAuctionInfo={derivedAuctionInfo}
            />
          )}
          {auctionState === AuctionState.PRICE_SUBMISSION && (
            <AuctionPending>Auction closed. Pending on-chain price-calculation.</AuctionPending>
          )}
          <OrderBook
            auctionIdentifier={auctionIdentifier}
            derivedAuctionInfo={derivedAuctionInfo}
          />
        </Grid>
      )}
      {auctionState === AuctionState.NOT_YET_STARTED && <AuctionNotStarted />}
      {auctionStarted && (
        <OrdersTable
          auctionIdentifier={auctionIdentifier}
          derivedAuctionInfo={derivedAuctionInfo}
        />
      )}
    </>
  )
}
export default AuctionBody
