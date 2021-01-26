import React, { useEffect, useRef } from "react";
import styled from "styled-components";

import * as am4charts from "@amcharts/amcharts4/charts";
import { OrderBookChartProps, drawLabels, createChart } from "./OrderbookChart";

const Wrapper = styled.div`
  display: flex;
  justify-content: center;
  text-align: center;
  width: 100%;
  height: 100%;
  min-width: 100%;
  color: ${({ theme }) => theme.text4};
  position: relative;

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
`;

const OrderBookChartSmall: React.FC<OrderBookChartProps> = (
  props: OrderBookChartProps,
) => {
  const { baseToken, quoteToken, networkId, data } = props;
  const mountPoint = useRef<HTMLDivElement>(null);
  const chartRef = useRef<am4charts.XYChart | null>(null);

  useEffect(() => {
    if (!mountPoint.current) return;
    const chart = createChart(mountPoint.current);
    chartRef.current = chart;

    // dispose on mount only
    return (): void => chart.dispose();
  }, []);

  useEffect(() => {
    if (!chartRef.current || data === null) return;

    if (data.length === 0) {
      chartRef.current.data = [];
      return;
    }

    // go on with the update when data is ready
    drawLabels({
      chart: chartRef.current,
      baseToken,
      quoteToken,
      networkId,
    });

    chartRef.current.data = data;
  }, [baseToken, networkId, quoteToken, data]);

  return <Wrapper ref={mountPoint}>Show order book for this auction</Wrapper>;
};

export default OrderBookChartSmall;
