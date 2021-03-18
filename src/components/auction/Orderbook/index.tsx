import React, { useMemo } from 'react'
import styled from 'styled-components'

import { useDerivedAuctionInfo } from '../../../state/orderPlacement/hooks'
import { useOrderbookDataCallback, useOrderbookState } from '../../../state/orderbook/hooks'
import { BaseCard } from '../../pureStyledComponents/BaseCard'
import OrderBookChart, { OrderBookError } from '../OrderbookChart'
import { processOrderbookData } from '../OrderbookWidget'

const Wrapper = styled(BaseCard)`
  max-width: 100%;
  min-width: 100%;
`

export const OrderBook: React.FC = () => {
  useOrderbookDataCallback()
  const derivedAuctionInfo = useDerivedAuctionInfo()

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
