import { useEffect, useRef, useState } from 'react'

import * as am4charts from '@amcharts/amcharts4/charts'
import { Token } from '@josojo/honeyswap-sdk'

import { XYChartProps, drawInformation } from '../components/auction/Charts/XYChart'
import { PricePointDetails } from '../components/auction/OrderbookChart'
import { ChainId } from '../utils'

interface Props {
  createChart: (props: XYChartProps) => am4charts.XYChart
  data: Maybe<PricePointDetails[]>
  baseToken: Token
  quoteToken: Token
  chainId: ChainId
}

const useChart = (props: Props) => {
  const { baseToken, chainId, createChart, data, quoteToken } = props

  const [loading, setLoading] = useState(false)

  // Using refs allows us to combine React with some libraries,
  // It’s handy for keeping any mutable value around similar to how you’d use instance fields in classes.
  // Also useRef doesn’t notify you when its content changes.
  // Mutating the .current property doesn’t cause a re-render. So is good if you need to access or update another state  at specific times
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
      chainId,
    })

    chartRef.current.data = data
  }, [baseToken, quoteToken, data, chainId])

  return { chartRef, mountPoint, loading }
}

export default useChart
