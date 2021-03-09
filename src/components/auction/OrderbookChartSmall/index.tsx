import React, { useEffect, useRef } from 'react'
import styled from 'styled-components'

import * as am4charts from '@amcharts/amcharts4/charts'

import { InlineLoading } from '../../common/InlineLoading'
import { SpinnerSize } from '../../common/Spinner'
import { OrderBookChartProps, createChart } from '../OrderbookChart'

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

const OrderBookChartSmall: React.FC<OrderBookChartProps> = (props: OrderBookChartProps) => {
  const { baseToken, data, quoteToken } = props
  const mountPoint = useRef<HTMLDivElement>(null)
  const chartRef = useRef<Maybe<am4charts.XYChart>>(null)

  useEffect(() => {
    if (!mountPoint.current) return
    const chart = createChart(mountPoint.current, baseToken, quoteToken)
    chartRef.current = chart

    // dispose on mount only
    return (): void => chart.dispose()
  }, [baseToken, quoteToken])

  useEffect(() => {
    if (!chartRef.current || data === null) return
    chartRef.current.data = data.length === 0 ? [] : data
  }, [data])

  return (
    <Wrapper ref={mountPoint}>
      <InlineLoading size={SpinnerSize.small} />
    </Wrapper>
  )
}

interface OrderBookErrorProps {
  error: Error
}

export const OrderBookError: React.FC<OrderBookErrorProps> = ({ error }: OrderBookErrorProps) => (
  <Wrapper>{error ? error.message : <InlineLoading size={SpinnerSize.small} />}</Wrapper>
)

export default OrderBookChartSmall
