import { useEffect, useRef, useState } from 'react'
import { Token } from 'uniswap-xdai-sdk'

import * as am4core from '@amcharts/amcharts4/core'
import am4themesSpiritedaway from '@amcharts/amcharts4/themes/spiritedaway'

import { PricePointDetails } from '../components/auction/OrderbookChart'

// Add global settings for chart
am4core.options.queue = true
am4core.options.onlyShowOnViewport = true
am4core.useTheme(am4themesSpiritedaway)

const useChart = ({
  baseToken,
  createChart,
  data,
  quoteToken,
}: {
  createChart: any
  data: Maybe<PricePointDetails[]>
  baseToken: Token
  quoteToken: Token
}) => {
  const [chart, setChart] = useState(null)
  const elemRef = useRef(null)

  useEffect(() => {
    const currentChart = createChart({ div: elemRef.current, data, baseToken, quoteToken })

    setChart(currentChart)

    return () => {
      if (currentChart) {
        currentChart.dispose()
      }
    }
  }, [data, baseToken, quoteToken, createChart])

  return { chart, elemRef }
}

export default useChart
