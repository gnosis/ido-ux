import React from 'react'
import styled from 'styled-components'
import { Token } from 'uniswap-xdai-sdk'

import { useActiveWeb3React } from '../../../hooks'
import { useOrderbookState } from '../../../state/orderbook/hooks'
import { BaseCard } from '../../pureStyledComponents/BaseCard'
import OrderBookChart, { OrderBookError } from '../OrderbookChart'
import { processOrderbookData } from '../OrderbookWidget'

const Wrapper = styled(BaseCard)`
  max-width: 100%;
  min-width: 100%;
`

interface OrderBookProps {
  baseToken: Token
  label?: string
  quoteToken: Token
}

export const OrderBook: React.FC<OrderBookProps> = (props: OrderBookProps) => {
  const { baseToken, quoteToken } = props
  const { chainId } = useActiveWeb3React()

  const { asks, bids, error, userOrderPrice, userOrderVolume } = useOrderbookState()

  const processedOrderbook = processOrderbookData({
    data: { bids, asks },
    userOrder: { price: userOrderPrice, volume: userOrderVolume },
    baseToken,
    quoteToken,
  })

  return (
    <>
      <Wrapper>
        {error || !asks || asks.length === 0 ? (
          <OrderBookError error={error} />
        ) : (
          <OrderBookChart
            baseToken={baseToken}
            data={processedOrderbook}
            networkId={chainId}
            quoteToken={quoteToken}
          />
        )}
      </Wrapper>
    </>
  )
}
