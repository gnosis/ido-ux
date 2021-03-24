import * as am4charts from '@amcharts/amcharts4/charts'
import * as am4core from '@amcharts/amcharts4/core'

const XYChart = (args) => {
  const { baseToken, data, div, quoteToken } = args

  const baseTokenLabel = baseToken.symbol
  const quoteTokenLabel = quoteToken.symbol
  const market = quoteTokenLabel + '-' + baseTokenLabel

  const priceTitle = ` Price (${baseTokenLabel})`
  const volumeTitle = ` Volume (${quoteTokenLabel})`

  const chart = am4core.create(div, am4charts.XYChart)
  // Add data
  chart.data = data

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

export default XYChart
