import React from 'react'
import { useLocation } from 'react-router-dom'
import styled from 'styled-components'

import { NUMBER_OF_DIGITS_FOR_INVERSION } from '../../../constants/config'
import { DerivedAuctionInfo } from '../../../state/orderPlacement/hooks'
import { parseURL } from '../../../state/orderPlacement/reducer'
import { useOrderbookState } from '../../../state/orderbook/hooks'
import { getInverse, showChartsInverted } from '../../../utils/prices'
import { InlineLoading } from '../../common/InlineLoading'
import { SpinnerSize } from '../../common/Spinner'
import { BaseCard } from '../../pureStyledComponents/BaseCard'
import OrderBookChart, { OrderBookError } from '../OrderbookChart'
import { processOrderbookData } from '../OrderbookWidget'

const Wrapper = styled(BaseCard)`
  align-items: center;
  display: flex;
  justify-content: center;
  max-width: 100%;
  height: 100%;
  min-height: 352px;
  min-width: 100%;
`
interface OrderbookProps {
  derivedAuctionInfo: DerivedAuctionInfo
}

export const OrderBook: React.FC<OrderbookProps> = (props) => {
  const { derivedAuctionInfo } = props
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

  const { auctioningToken: baseToken, biddingToken: quoteToken } = derivedAuctionInfo

  const processedOrderbook = React.useMemo(() => {
    const data = { bids, asks }
    return processOrderbookData({
      data,
      userOrder: {
        price: userOrderPrice,
        volume: userOrderVolume,
      },
      baseToken,
      quoteToken,
    })
  }, [asks, baseToken, bids, quoteToken, userOrderPrice, userOrderVolume])

  if (showChartsInverted(baseToken)) {
    for (const p of processedOrderbook) {
      p.priceNumber = Number(getInverse(p.price.toString(), NUMBER_OF_DIGITS_FOR_INVERSION))
      p.priceFormatted = getInverse(p.price.toString(), NUMBER_OF_DIGITS_FOR_INVERSION)
    }
  }

  return (
    <>
      <Wrapper>
        {orderbookAuctionId != auctionId || chainId != orderbookChainId ? (
          <InlineLoading size={SpinnerSize.small} />
        ) : error || !asks || asks.length === 0 ? (
          <OrderBookError error={error} />
        ) : (
          <OrderBookChart
            baseToken={baseToken}
            chainId={chainId}
            data={processedOrderbook}
            quoteToken={quoteToken}
          />
        )}
      </Wrapper>
    </>
  )
}
