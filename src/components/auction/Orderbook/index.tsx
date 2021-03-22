import React from 'react'
import styled from 'styled-components'

import { DerivedAuctionInfo } from '../../../state/orderPlacement/hooks'
import { AuctionIdentifier } from '../../../state/orderPlacement/reducer'
import { useOrderbookDataCallback, useOrderbookState } from '../../../state/orderbook/hooks'
import { InlineLoading } from '../../common/InlineLoading'
import { SpinnerSize } from '../../common/Spinner'
import { BaseCard } from '../../pureStyledComponents/BaseCard'
import OrderBookChart, { OrderBookError } from '../OrderbookChart'
import { processOrderbookData } from '../OrderbookWidget'

const Wrapper = styled(BaseCard)`
  max-width: 100%;
  min-width: 100%;
`
interface OrderbookProps {
  auctionIdentifier: AuctionIdentifier
  derivedAuctionInfo: DerivedAuctionInfo
}

export const OrderBook: React.FC<OrderbookProps> = (props) => {
  const { auctionIdentifier, derivedAuctionInfo } = props
  const { auctionId, chainId } = auctionIdentifier
  useOrderbookDataCallback(auctionIdentifier)
  const { asks, bids } = useOrderbookState()
  const {
    auctionId: orderbookAuctionId,
    chainId: orderbookChainId,
    error,
    userOrderPrice,
    userOrderVolume,
  } = useOrderbookState()
  let data = { bids, asks }
  if (orderbookAuctionId != auctionId && chainId != orderbookChainId) {
    data = null
  }

  const processedOrderbook = processOrderbookData({
    data,
    userOrder: { price: userOrderPrice, volume: userOrderVolume },
    baseToken: derivedAuctionInfo?.auctioningToken,
    quoteToken: derivedAuctionInfo?.biddingToken,
  })

  return (
    <>
      <Wrapper>
        {!data ? (
          <InlineLoading size={SpinnerSize.small} />
        ) : error || !asks || asks.length === 0 ? (
          <OrderBookError error={error} />
        ) : (
          <OrderBookChart
            baseToken={derivedAuctionInfo?.auctioningToken}
            data={processedOrderbook}
            quoteToken={derivedAuctionInfo?.biddingToken}
          />
        )}
      </Wrapper>
    </>
  )
}
