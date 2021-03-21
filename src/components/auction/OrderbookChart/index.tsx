import React, { useEffect, useRef } from 'react'
import styled from 'styled-components'
import { Token } from 'uniswap-xdai-sdk'

import * as am4charts from '@amcharts/amcharts4/charts'
import * as am4core from '@amcharts/amcharts4/core'
import am4themesSpiritedaway from '@amcharts/amcharts4/themes/spiritedaway'

import { InlineLoading } from '../../common/InlineLoading'
import { SpinnerSize } from '../../common/Spinner'

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

am4core.useTheme(am4themesSpiritedaway)

const OrderBookChart: React.FC<OrderBookChartProps> = (props: OrderBookChartProps) => {
  const { baseToken, data, quoteToken } = props
  const chartRef = useRef(null)

  useEffect(() => {
    if (!baseToken || !quoteToken || !data) return

    if (chartRef.current) return

    const baseTokenLabel = baseToken.symbol
    const quoteTokenLabel = quoteToken.symbol
    const market = quoteTokenLabel + '-' + baseTokenLabel

    const priceTitle = ` Price (${baseTokenLabel})`
    const volumeTitle = ` Volume (${quoteTokenLabel})`

    chartRef.current = am4core.create('chartdiv', am4charts.XYChart)
    // Add data
    chartRef.current.data = data

    chartRef.current.paddingTop = 20
    chartRef.current.marginTop = 20
    chartRef.current.paddingBottom = 0
    chartRef.current.paddingLeft = 0
    chartRef.current.paddingRight = 0
    chartRef.current.marginBottom = 0

    // Colors
    const colors = {
      green: '#28a745',
      red: '#dc3545',
      white: '#FFFFFF',
      grey: '#565A69',
      orange: '#FF6347',
    }

    // Create axes
    const priceAxis = chartRef.current.xAxes.push(new am4charts.ValueAxis())
    const volumeAxis = chartRef.current.yAxes.push(new am4charts.ValueAxis())
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

    const min = Math.min.apply(
      0,
      data.map((order) => order.priceNumber),
    )
    // Reduce the min in a 5%
    priceAxis.min = min - min * 0.05

    const max = Math.max.apply(
      0,
      data.map((order) => order.priceNumber),
    )
    // Reduce the max in a 5%
    priceAxis.max = max + max * 0.05

    priceAxis.strictMinMax = true
    priceAxis.renderer.grid.template.disabled = true
    priceAxis.renderer.labels.template.disabled = true

    const createGrid = (value) => {
      const range = priceAxis.axisRanges.create()
      range.value = value
      range.label.text = '{value}'
    }

    const factor = (priceAxis.max - priceAxis.min) / 5

    const firstGrid = priceAxis.min + factor
    const secondGrid = priceAxis.min + factor * 2
    const thirdGrid = priceAxis.min + factor * 3
    const fourGrid = priceAxis.min + factor * 4
    const fiveGrid = priceAxis.min + factor * 5

    createGrid(firstGrid.toFixed(2))
    createGrid(secondGrid.toFixed(2))
    createGrid(thirdGrid.toFixed(2))
    createGrid(fourGrid.toFixed(2))
    createGrid(fiveGrid.toFixed(2))

    // Create serie, green line shows the price (x axis) and size (y axis) of the bids that have been placed, both expressed in the bid token
    const bidSeries = chartRef.current.series.push(new am4charts.StepLineSeries())
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
    const askSeries = chartRef.current.series.push(new am4charts.LineSeries())
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
    const inputSeries = chartRef.current.series.push(new am4charts.LineSeries())
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
    const priceSeries = chartRef.current.series.push(new am4charts.LineSeries())
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
    chartRef.current.cursor = new am4charts.XYCursor()
    chartRef.current.cursor.snapToSeries = [bidSeries, askSeries]
    chartRef.current.cursor.lineX.stroke = am4core.color(colors.white)
    chartRef.current.cursor.lineX.strokeWidth = 1
    chartRef.current.cursor.lineX.strokeOpacity = 0.6
    chartRef.current.cursor.lineX.strokeDasharray = '4'

    chartRef.current.cursor.lineY.stroke = am4core.color(colors.white)
    chartRef.current.cursor.lineY.strokeWidth = 1
    chartRef.current.cursor.lineY.strokeOpacity = 0.6
    chartRef.current.cursor.lineY.strokeDasharray = '4'

    // Button configuration
    chartRef.current.zoomOutButton.background.cornerRadius(5, 5, 5, 5)
    chartRef.current.zoomOutButton.background.fill = am4core.color(colors.grey)
    chartRef.current.zoomOutButton.icon.stroke = am4core.color(colors.white)
    chartRef.current.zoomOutButton.icon.strokeWidth = 2
    chartRef.current.zoomOutButton.tooltip.text = 'Zoom out'

    // Legend
    chartRef.current.legend = new am4charts.Legend()
    chartRef.current.legend.labels.template.fill = am4core.color(colors.white)
    chartRef.current.legend.itemContainers.template.tooltipText =
      '{dataContext.dummyData.description}'
  }, [data, baseToken, quoteToken])

  // Handle component unmounting, dispose chart
  useEffect(() => {
    return () => {
      chartRef.current && chartRef.current.dispose()
    }
  }, [])

  useEffect(() => {
    if (!chartRef.current || data === null) return
    chartRef.current.data = data.length === 0 ? [] : data
  }, [data, baseToken, quoteToken])

  return (
    <Wrapper id="chartdiv">
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

export default OrderBookChart
