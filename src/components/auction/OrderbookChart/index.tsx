import React from 'react'
import styled from 'styled-components'
import { Token } from 'uniswap-xdai-sdk'

import useChart from '../../../hooks/useChart'
import { InlineLoading } from '../../common/InlineLoading'
import { SpinnerSize } from '../../common/Spinner'
import { XYChart } from '../Charts/XYChart'

export enum Offer {
  Bid,
  Ask,
}

/**
 * Price point data represented in the graph. Contains BigNumbers for operate with less errors and more precission
 * but for representation uses number as expected by the library
 */
export interface PricePointDetails {
  // Basic data
  type: Offer
  volume: number // volume for the price point
  totalVolume: number // cumulative volume
  price: number

  // Data for representation
  priceNumber: number
  priceFormatted: string
  totalVolumeNumber: number
  totalVolumeFormatted: string
  askValueY: Maybe<number>
  bidValueY: Maybe<number>
  newOrderValueY: Maybe<number>
  clearingPriceValueY: Maybe<number>
}

export interface OrderBookChartProps {
  baseToken: Token
  quoteToken: Token
  data: Maybe<PricePointDetails[]>
}

const Wrapper = styled.div`
  align-content: center;
  align-items: center;
  box-sizing: border-box;
  color: ${({ theme }) => theme.text2};
  display: flex;
  height: 100%;
  justify-content: center;
  position: relative;
  width: 100%;

  .amcharts-Sprite-group {
    pointer-events: none;
  }

  .amcharts-Label {
    text-transform: uppercase;
    font-size: 10px;
    letter-spacing: 1px;
    color: ${({ theme }) => theme.text4};
    margin: 10px;
  }

  .amcharts-ZoomOutButton-group > .amcharts-RoundedRectangle-group {
    fill: var(--color-text-active);
    opacity: 0.6;
    transition: 0.3s ease-in-out;

    &:hover {
      opacity: 1;
    }
  }

  .amcharts-CategoryAxis .amcharts-Label-group > .amcharts-Label,
  .amcharts-ValueAxis-group .amcharts-Label-group > .amcharts-Label {
    fill: ${({ theme }) => theme.text3};
  }
`

const OrderBookChart: React.FC<OrderBookChartProps> = (props: OrderBookChartProps) => {
  const { baseToken, data, quoteToken } = props

  const { loading, mountPoint } = useChart({
    createChart: XYChart,
    data,
    baseToken,
    quoteToken,
  })

  return (
    <>
      {(!mountPoint || loading) && <InlineLoading size={SpinnerSize.small} />}
      {mountPoint && !loading && <Wrapper ref={mountPoint} />}
    </>
  )
}

interface OrderBookErrorProps {
  error: Error
}

export const OrderBookError: React.FC<OrderBookErrorProps> = ({ error }: OrderBookErrorProps) => (
  <Wrapper>{error ? error.message : <InlineLoading size={SpinnerSize.small} />}</Wrapper>
)

export default OrderBookChart
