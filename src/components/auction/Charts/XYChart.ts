import { Token } from 'uniswap-xdai-sdk'

import * as am4charts from '@amcharts/amcharts4/charts'
import * as am4core from '@amcharts/amcharts4/core'
import am4themesSpiritedaway from '@amcharts/amcharts4/themes/spiritedaway'

import { PricePointDetails } from '../OrderbookChart'

export interface XYChartProps {
  chartElement: HTMLElement
}

export const XYChart = (props: XYChartProps): am4charts.XYChart => {
  const { chartElement } = props

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
  volumeAxis.title.fill = am4core.color(colors.white)
  volumeAxis.renderer.labels.template.fill = am4core.color(colors.white)

  priceAxis.renderer.grid.template.stroke = am4core.color(colors.white)
  priceAxis.renderer.grid.template.strokeWidth = 0.5
  priceAxis.renderer.grid.template.strokeOpacity = 0.5
  priceAxis.title.fill = am4core.color(colors.white)
  priceAxis.renderer.labels.template.fill = am4core.color(colors.white)

  // Recalculates very big and very small numbers by reducing their length according to rules and applying suffix/prefix.
  const numberFormatter = new am4core.NumberFormatter()
  numberFormatter.numberFormat = '#.00a'
  numberFormatter.bigNumberPrefixes = [
    { number: 1e4, suffix: 'K' }, // Use K only with value greater than 9999.00
    { number: 1e6, suffix: 'M' },
    { number: 1e9, suffix: 'B' },
    { number: 1e12, suffix: 'T' },
  ]

  volumeAxis.numberFormatter = numberFormatter
  priceAxis.numberFormatter = numberFormatter

  priceAxis.strictMinMax = true
  priceAxis.extraMin = 0.02
  priceAxis.extraMax = 0.02
  priceAxis.renderer.grid.template.disabled = true
  priceAxis.renderer.labels.template.disabled = true

  // Create serie, green line shows the price (x axis) and size (y axis) of the bids that have been placed, both expressed in the bid token
  const bidSeries = chart.series.push(new am4charts.StepLineSeries())
  bidSeries.dataFields.valueX = 'priceNumber'
  bidSeries.dataFields.valueY = 'bidValueY'
  bidSeries.strokeWidth = 1
  bidSeries.stroke = am4core.color(colors.green)
  bidSeries.fill = bidSeries.stroke
  bidSeries.startLocation = 0.5
  bidSeries.fillOpacity = 0.1
  bidSeries.dummyData = {
    description:
      'Shows the price (x axis) and size (y axis) of the bids that have been placed, both expressed in the bid token',
  }

  // Create serie, red line, shows the minimum sell price (x axis) the auctioneer is willing to accept
  const askSeries = chart.series.push(new am4charts.StepLineSeries())
  askSeries.dataFields.valueX = 'priceNumber'
  askSeries.dataFields.valueY = 'askValueY'
  askSeries.strokeWidth = 1
  askSeries.stroke = am4core.color(colors.red)
  askSeries.fill = askSeries.stroke
  askSeries.startLocation = 0.5
  askSeries.fillOpacity = 0.1
  askSeries.dummyData = {
    description: 'Shows the minimum sell price (x axis) the auctioneer is willing to accept',
  }

  // New order to be placed
  const inputSeries = chart.series.push(new am4charts.LineSeries())
  inputSeries.dataFields.valueX = 'priceNumber'
  inputSeries.dataFields.valueY = 'newOrderValueY'
  inputSeries.strokeWidth = 1
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

interface DrawInformation {
  chart: am4charts.XYChart
  baseToken: Token
  quoteToken: Token
  data: PricePointDetails[]
}

export const drawInformation = (props: DrawInformation) => {
  const { baseToken, chart, data, quoteToken } = props
  const baseTokenLabel = baseToken.symbol
  const quoteTokenLabel = quoteToken.symbol
  const market = quoteTokenLabel + '-' + baseTokenLabel

  const priceTitle = ` Price`
  const volumeTitle = ` Volume (${quoteTokenLabel})`

  const [xAxis] = chart.xAxes
  const [yAxis] = chart.yAxes

  xAxis.title.text = priceTitle
  yAxis.title.text = volumeTitle

  const series = chart.series

  series.values[0].tooltipText = `[bold]${market}[/]\nAsk Price: [bold]{priceFormatted}[/] ${quoteTokenLabel}\nVolume: [bold]{totalVolumeFormatted}[/] ${quoteTokenLabel}`
  series.values[1].tooltipText = `[bold]${market}[/]\nBid Price: [bold]{priceFormatted}[/] ${quoteTokenLabel}\nVolume: [bold]{totalVolumeFormatted}[/] ${quoteTokenLabel}`

  const min = Math.min.apply(
    0,
    data.map((order) => order.priceNumber),
  )

  const max = Math.max.apply(
    0,
    data.map((order) => order.priceNumber),
  )

  const createGrid = (value) => {
    const range = xAxis.axisRanges.create() as any
    range.value = value
    range.label.text = '{value}'
  }

  const factor = (max - min) / 5

  const firstGrid = min + factor
  const secondGrid = min + factor * 2
  const thirdGrid = min + factor * 3
  const fourGrid = min + factor * 4

  createGrid(firstGrid.toFixed(2))
  createGrid(secondGrid.toFixed(2))
  createGrid(thirdGrid.toFixed(2))
  createGrid(fourGrid.toFixed(2))
}
