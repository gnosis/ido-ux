import React, { useEffect, useRef } from 'react'
import styled from 'styled-components'

import * as am4charts from '@amcharts/amcharts4/charts'
import * as am4core from '@amcharts/amcharts4/core'

import { DrawLabelsParams, OrderBookChartProps, createChart } from '../../OrderbookChart'
import { InlineLoading } from '../../common/InlineLoading'
import { SpinnerSize } from '../../common/Spinner'

const drawLabels = ({ baseToken, chart, quoteToken }: DrawLabelsParams): void => {
  const baseTokenLabel = baseToken?.symbol
  const quoteTokenLabel = quoteToken?.symbol
  const market = baseTokenLabel + '-' + quoteTokenLabel

  const [xAxis] = chart.xAxes
  const [yAxis] = chart.yAxes

  xAxis.title.text = ` Price (${baseTokenLabel})`
  yAxis.title.text = ` Volume (${quoteTokenLabel})`

  xAxis.tooltip.background.cornerRadius = 0
  xAxis.tooltip.background.fill = am4core.color('green')
  yAxis.tooltip.background.cornerRadius = 0
  yAxis.tooltip.background.fill = am4core.color('red')

  xAxis.title.fill = am4core.color('white')
  yAxis.title.fill = am4core.color('white')

  const [bidSeries, askSeries] = chart.series

  bidSeries.tooltipText = `[bold]${market}[/]\nBid Price: [bold]{priceFormatted}[/] ${quoteTokenLabel}\nVolume: [bold]{totalVolumeFormatted}[/] ${baseTokenLabel}`
  askSeries.tooltipText = `[bold]${market}[/]\nAsk Price: [bold]{priceFormatted}[/] ${quoteTokenLabel}\nVolume: [bold]{totalVolumeFormatted}[/] ${baseTokenLabel}`
}

const Wrapper = styled.div`
  align-content: center;
  align-items: center;
  box-sizing: border-box;
  color: ${({ theme }) => theme.text2};
  display: flex;
  height: 100%;
  justify-content: center;
  padding: 26px;
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
  const { baseToken, data, networkId, quoteToken } = props
  const mountPoint = useRef<HTMLDivElement>(null)
  const chartRef = useRef<Maybe<am4charts.XYChart>>(null)

  useEffect(() => {
    if (!mountPoint.current) return
    const chart = createChart(mountPoint.current)
    chartRef.current = chart

    // dispose on mount only
    return (): void => chart.dispose()
  }, [])

  useEffect(() => {
    if (!chartRef.current) return

    if (data && data.length !== 0) {
      chartRef.current.data = data
    }

    // go on with the update when data is ready
    drawLabels({
      chart: chartRef.current,
      baseToken,
      quoteToken,
      networkId,
    })
  }, [baseToken, networkId, quoteToken, data])

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
