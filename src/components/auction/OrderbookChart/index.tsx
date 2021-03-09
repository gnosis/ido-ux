import React, { useEffect, useRef } from 'react'
import styled from 'styled-components'
import { Token } from 'uniswap-xdai-sdk'

import * as am4charts from '@amcharts/amcharts4/charts'
import * as am4core from '@amcharts/amcharts4/core'
import am4themesSpiritedaway from '@amcharts/amcharts4/themes/spiritedaway'

export interface OrderBookChartProps {
  baseToken: Token
  quoteToken: Token
  networkId: number
  data: Maybe<PricePointDetails[]>
}

const Wrapper = styled.div`
  display: flex;
  justify-content: center;
  min-height: calc(60vh - 30rem);
  text-align: center;
  width: 100%;
  height: 100%;
  min-width: 100%;
  padding: 16px;
  box-sizing: border-box;

  .amcharts-Sprite-group {
    font-size: 1rem;
  }

  .amcharts-Label {
    text-transform: uppercase;
    font-size: 1.2rem;
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

  .amcharts-AxisLabel,
  .amcharts-CategoryAxis .amcharts-Label-group > .amcharts-Label,
  .amcharts-ValueAxis-group .amcharts-Label-group > .amcharts-Label {
    fill: ${({ theme }) => theme.text3};
  }
`

interface OrderBookErrorProps {
  error: Error
}

export const OrderBookError: React.FC<OrderBookErrorProps> = ({ error }: OrderBookErrorProps) => (
  <Wrapper>{error ? error.message : 'loading'}</Wrapper>
)

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

export const createChart = (
  chartElement: HTMLElement,
  baseToken: Token,
  quoteToken: Token,
): am4charts.XYChart => {
  const baseTokenLabel = baseToken.symbol
  const quoteTokenLabel = quoteToken.symbol
  const market = quoteTokenLabel + '-' + baseTokenLabel

  const priceTitle = ` Price (${baseTokenLabel})`
  const volumeTitle = ` Volume (${quoteTokenLabel})`

  am4core.useTheme(am4themesSpiritedaway)
  const chart = am4core.create(chartElement, am4charts.XYChart)
  chart.paddingTop = 20
  chart.marginTop = 20
  chart.paddingBottom = 0
  chart.paddingLeft = 0
  chart.paddingRight = 0
  chart.marginBottom = 0

  // Colors
  const colors = {
    green: '#28a745',
    red: '#dc3545',
    white: '#FFFFFF',
    grey: '#565A69',
    orange: '#FF6347',
  }

  // Create axes
  const priceAxis = chart.xAxes.push(new am4charts.ValueAxis())
  const volumeAxis = chart.yAxes.push(new am4charts.ValueAxis())
  volumeAxis.renderer.grid.template.stroke = am4core.color(colors.white)
  volumeAxis.renderer.grid.template.strokeWidth = 0.5
  volumeAxis.renderer.grid.template.strokeOpacity = 0.5
  volumeAxis.title.text = volumeTitle
  volumeAxis.title.fill = am4core.color(colors.white)
  volumeAxis.renderer.labels.template.fill = am4core.color(colors.white)

  priceAxis.renderer.grid.template.stroke = am4core.color(colors.white)
  priceAxis.renderer.grid.template.strokeWidth = 0.5
  priceAxis.renderer.grid.template.strokeOpacity = 0.5
  priceAxis.title.text = priceTitle
  priceAxis.title.fill = am4core.color(colors.white)
  priceAxis.renderer.labels.template.fill = am4core.color(colors.white)

  // Create serie, green line shows the price (x axis) and size (y axis) of the bids that have been placed, both expressed in the bid token
  const bidSeries = chart.series.push(new am4charts.StepLineSeries())
  bidSeries.dataFields.valueX = 'priceNumber'
  bidSeries.dataFields.valueY = 'bidValueY'
  bidSeries.strokeWidth = 2
  bidSeries.stroke = am4core.color(colors.green)
  bidSeries.fill = bidSeries.stroke
  bidSeries.fillOpacity = 0.2
  bidSeries.dummyData = {
    description:
      'Shows the price (x axis) and size (y axis) of the bids that have been placed, both expressed in the bid token',
  }
  bidSeries.tooltipText = `[bold]${market}[/]\nBid Price: [bold]{priceFormatted}[/] ${quoteTokenLabel}\nVolume: [bold]{totalVolumeFormatted}[/] ${baseTokenLabel}`

  // Create serie, red line, shows the minimum sell price (x axis) the auctioneer is willing to accept
  const askSeries = chart.series.push(new am4charts.LineSeries())
  askSeries.dataFields.valueX = 'priceNumber'
  askSeries.dataFields.valueY = 'askValueY'
  askSeries.strokeWidth = 2
  askSeries.stroke = am4core.color(colors.red)
  askSeries.fill = askSeries.stroke
  askSeries.fillOpacity = 0.1
  askSeries.dummyData = {
    description: 'Shows the minimum sell price (x axis) the auctioneer is willing to accept',
  }
  askSeries.tooltipText = `[bold]${market}[/]\nAsk Price: [bold]{priceFormatted}[/] ${quoteTokenLabel}\nVolume: [bold]{totalVolumeFormatted}[/] ${baseTokenLabel}`

  // New order to be placed
  const inputSeries = chart.series.push(new am4charts.LineSeries())
  inputSeries.dataFields.valueX = 'priceNumber'
  inputSeries.dataFields.valueY = 'newOrderValueY'
  inputSeries.strokeWidth = 4
  inputSeries.stroke = am4core.color(colors.orange)
  inputSeries.fill = inputSeries.stroke
  inputSeries.fillOpacity = 0.1
  inputSeries.dummyData = {
    description: 'New orders to be placed',
  }

  // Dotted white line -> shows the Current price, which is the closing price of the auction if
  // no more bids are submitted or canceled and the auction ends
  const priceSeries = chart.series.push(new am4charts.LineSeries())
  priceSeries.dataFields.valueX = 'priceNumber'
  priceSeries.dataFields.valueY = 'clearingPriceValueY'
  priceSeries.strokeWidth = 2
  priceSeries.strokeDasharray = '3,3'
  priceSeries.stroke = am4core.color(colors.white)
  priceSeries.fill = inputSeries.stroke
  priceSeries.fillOpacity = 0.1
  priceSeries.dummyData = {
    description:
      'Shows the Current price, which is the closing price of the auction if no more bids are submitted or canceled and the auction ends',
  }

  // Add cursor
  chart.cursor = new am4charts.XYCursor()
  chart.cursor.snapToSeries = [bidSeries, askSeries]
  chart.cursor.lineX.stroke = am4core.color(colors.white)
  chart.cursor.lineX.strokeWidth = 1
  chart.cursor.lineX.strokeOpacity = 0.6
  chart.cursor.lineX.strokeDasharray = '4'

  chart.cursor.lineY.stroke = am4core.color(colors.white)
  chart.cursor.lineY.strokeWidth = 1
  chart.cursor.lineY.strokeOpacity = 0.6
  chart.cursor.lineY.strokeDasharray = '4'

  // Button configuration
  chart.zoomOutButton.background.cornerRadius(5, 5, 5, 5)
  chart.zoomOutButton.background.fill = am4core.color(colors.grey)
  chart.zoomOutButton.icon.stroke = am4core.color(colors.white)
  chart.zoomOutButton.icon.strokeWidth = 2
  chart.zoomOutButton.tooltip.text = 'Zoom out'

  // Legend
  chart.legend = new am4charts.Legend()
  chart.legend.labels.template.fill = am4core.color(colors.white)
  chart.legend.itemContainers.template.tooltipText = '{dataContext.dummyData.description}'

  return chart
}

const OrderBookChart: React.FC<OrderBookChartProps> = (props: OrderBookChartProps) => {
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

    if (data.length === 0) {
      chartRef.current.data = []
      return
    }

    chartRef.current.data = data
  }, [data, baseToken, quoteToken])

  return <Wrapper ref={mountPoint}>Show order book for auction</Wrapper>
}

export default OrderBookChart
