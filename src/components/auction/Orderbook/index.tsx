import React from 'react'
import { useLocation } from 'react-router-dom'
import styled from 'styled-components'

import { DerivedAuctionInfo } from '../../../state/orderPlacement/hooks'
import { AuctionIdentifier, parseURL } from '../../../state/orderPlacement/reducer'
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
  useOrderbookDataCallback(auctionIdentifier)
  const {
    asks,
    auctionId: orderbookAuctionId,
    bids,
    chainId: orderbookChainId,
    error,
    userOrderPrice,
    userOrderVolume,
  } = useOrderbookState()

  const location = useLocation()
  const { auctionId, chainId } = parseURL(location.search)

  const data = { bids, asks }

  const { auctioningToken: baseToken, biddingToken: quoteToken } = derivedAuctionInfo

  const processedOrderbook = processOrderbookData({
    data,
    userOrder: { price: userOrderPrice, volume: userOrderVolume },
    baseToken,
    quoteToken,
  })

  return (
    <>
      <Wrapper>
        {orderbookAuctionId != auctionId || chainId != orderbookChainId ? (
          <InlineLoading size={SpinnerSize.small} />
        ) : error || !asks || asks.length === 0 ? (
          <OrderBookError error={error} />
        ) : (
          <OrderBookChart baseToken={baseToken} data={processedOrderbook} quoteToken={quoteToken} />
        )}
      </Wrapper>
    </>
  )
}
