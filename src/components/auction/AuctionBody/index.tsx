import React from 'react'
import styled from 'styled-components'

import { AuctionState, DerivedAuctionInfo } from '../../../state/orderPlacement/hooks'
import { AuctionIdentifier } from '../../../state/orderPlacement/reducer'
import { AuctionNotStarted } from '../AuctionNotStarted'
import Claimer from '../Claimer'
import OrderPlacement from '../OrderPlacement'
import { OrderBookContainer } from '../OrderbookContainer'
import OrdersTable from '../OrdersTable'

const Grid = styled.div`
  display: grid;
  grid-template-columns: 1fr;
  row-gap: 20px;
  margin: 0 0 40px;

  @media (min-width: ${({ theme }) => theme.themeBreakPoints.xxl}) {
    column-gap: 18px;
    grid-template-columns: calc(50% - 20px) 50%;
  }
`

const GridCol = styled.div`
  display: flex;
  flex-direction: column;
  max-width: 100%;
  overflow-x: auto;
`

interface AuctionBodyProps {
  auctionIdentifier: AuctionIdentifier
  derivedAuctionInfo: DerivedAuctionInfo
}

const AuctionBody = (props: AuctionBodyProps) => {
  const {
    auctionIdentifier,
    derivedAuctionInfo: { auctionState },
    derivedAuctionInfo,
  } = props
  const auctionStarted = React.useMemo(
    () => auctionState !== undefined && auctionState !== AuctionState.NOT_YET_STARTED,
    [auctionState],
  )

  return (
    <>
      {auctionStarted && (
        <Grid>
          <GridCol>
            {(auctionState === AuctionState.ORDER_PLACING ||
              auctionState === AuctionState.ORDER_PLACING_AND_CANCELING) && (
              <OrderPlacement
                auctionIdentifier={auctionIdentifier}
                derivedAuctionInfo={derivedAuctionInfo}
              />
            )}
            {auctionState === AuctionState.CLAIMING && (
              <Claimer
                auctionIdentifier={auctionIdentifier}
                derivedAuctionInfo={derivedAuctionInfo}
              />
            )}
          </GridCol>
          <GridCol>
            <OrderBookContainer
              auctionIdentifier={auctionIdentifier}
              auctionState={auctionState}
              derivedAuctionInfo={derivedAuctionInfo}
            />
          </GridCol>
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
