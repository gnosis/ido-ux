import React from 'react'
import styled from 'styled-components'

import { useWeb3React } from '@web3-react/core'

import { useSignature } from '../../../hooks/useSignature'
import { AuctionState, DerivedAuctionInfo } from '../../../state/orderPlacement/hooks'
import { AuctionIdentifier } from '../../../state/orderPlacement/reducer'
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

interface AuctionBodyProps {
  auctionIdentifier: AuctionIdentifier
  derivedAuctionInfo: DerivedAuctionInfo
  auctionState: AuctionState
  loading?: boolean
}

const AuctionBody = (props: AuctionBodyProps) => {
  console.log('AuctionBody rerender')

  const { auctionIdentifier, auctionState, derivedAuctionInfo, loading } = props
  const auctionStarted = React.useMemo(
    () => auctionState !== undefined && auctionState !== AuctionState.NOT_YET_STARTED,
    [auctionState],
  )

  const isNotLoading = React.useMemo(() => auctionState !== null && !loading, [
    loading,
    auctionState,
  ])
  const { account } = useWeb3React()
  const { loading: loadingSignature, signature } = useSignature(auctionIdentifier, account)

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
            auctionState === AuctionState.ORDER_PLACING_AND_CANCELING) && (
            <OrderPlacement
              auctionIdentifier={auctionIdentifier}
              auctionState={auctionState}
              derivedAuctionInfo={derivedAuctionInfo}
              loading={loadingSignature}
              signature={signature}
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
      {auctionStarted && isNotLoading && (
        <OrdersTable
          auctionIdentifier={auctionIdentifier}
          derivedAuctionInfo={derivedAuctionInfo}
        />
      )}
    </>
  )
}
export default AuctionBody
