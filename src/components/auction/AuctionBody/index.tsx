import React from 'react'
import styled from 'styled-components'

import { AuctionState, DerivedAuctionInfo } from '../../../state/orderPlacement/hooks'
import { AuctionIdentifier } from '../../../state/orderPlacement/reducer'
import { PageTitle } from '../../pureStyledComponents/PageTitle'
import { AuctionNotStarted } from '../AuctionNotStarted'
import Claimer from '../Claimer'
import OrderPlacement from '../OrderPlacement'
import { OrderBookContainer } from '../OrderbookContainer'
import OrdersTable from '../OrdersTable'

const Grid = styled.div`
  display: flex;
  flex-direction: column;
  margin: 0 0 40px;

  @media (min-width: ${({ theme }) => theme.themeBreakPoints.xxl}) {
    display: grid;
    row-gap: 20px;
    column-gap: 18px;
    grid-template-columns: 1fr 1fr;
  }
`

const GridCol = styled.div`
  display: flex;
  flex-direction: column;
  max-width: 100%;
  justify-content: flex-end;
  @media (max-width: ${({ theme }) => theme.themeBreakPoints.xxl}) {
    overflow-x: auto;
  }
`

const Wrap = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 16px;
`

const SectionTitle = styled(PageTitle)`
  margin-bottom: 0;
  margin-top: 0;
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
            <Wrap>
              <SectionTitle as="h2">
                {auctionState === AuctionState.CLAIMING ? 'Claiming Proceeds' : 'Place Order'}
              </SectionTitle>
            </Wrap>
            {(auctionState === AuctionState.ORDER_PLACING ||
              auctionState === AuctionState.ORDER_PLACING_AND_CANCELING) && (
              <OrderPlacement
                auctionIdentifier={auctionIdentifier}
                derivedAuctionInfo={derivedAuctionInfo}
              />
            )}
            {(auctionState === AuctionState.CLAIMING ||
              auctionState === AuctionState.PRICE_SUBMISSION) && (
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
