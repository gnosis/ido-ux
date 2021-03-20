import React, { useMemo } from 'react'
import styled from 'styled-components'

import { DerivedAuctionInfo } from '../../../state/orderPlacement/hooks'
import { AuctionIdentifier } from '../../../state/orderPlacement/reducer'
import { useOrderbookDataCallback, useOrderbookState } from '../../../state/orderbook/hooks'
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
  useOrderbookDataCallback(auctionIdentifier)

  const { asks, bids, error, userOrderPrice, userOrderVolume } = useOrderbookState()
  const processedOrderbook = useMemo(
    () =>
      processOrderbookData({
        data: { bids, asks },
        userOrder: { price: userOrderPrice, volume: userOrderVolume },
        baseToken: derivedAuctionInfo?.auctioningToken,
        quoteToken: derivedAuctionInfo?.biddingToken,
      }),
    [bids, asks, derivedAuctionInfo, userOrderPrice, userOrderVolume],
  )

  return (
    <>
      <Wrapper>
        {error || !asks || asks.length === 0 ? (
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
