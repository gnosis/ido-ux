import { useEffect, useRef, useState } from 'react'
import { Token } from 'uniswap-xdai-sdk'

import * as am4charts from '@amcharts/amcharts4/charts'

import { XYChartProps, drawInformation } from '../components/auction/Charts/XYChart'
import { PricePointDetails } from '../components/auction/OrderbookChart'

interface Props {
  createChart: (props: XYChartProps) => am4charts.XYChart
  data: Maybe<PricePointDetails[]>
  baseToken: Token
  quoteToken: Token
}

const useChart = (props: Props) => {
  const { baseToken, createChart, data, quoteToken } = props

  const [loading, setLoading] = useState(false)

  const mountPoint = useRef<Maybe<HTMLDivElement>>(null)
  const chartRef = useRef<Maybe<am4charts.XYChart>>(null)

  useEffect(() => {
    if (!mountPoint.current) return
    setLoading(true)
    const chart = createChart({
      chartElement: mountPoint.current,
    })

    chartRef.current = chart

    setLoading(false)
    // dispose on mount only
    return (): void => chart.dispose()
  }, [createChart])

  useEffect(() => {
    if (!chartRef.current || data === null) return

    if (data.length === 0) {
      chartRef.current.data = []
      return
    }

    drawInformation({
      chart: chartRef.current,
      baseToken,
      quoteToken,
      data,
    })

    chartRef.current.data = data
  }, [baseToken, quoteToken, data])

  return { chartRef, mountPoint, loading }
}

export default useChart
