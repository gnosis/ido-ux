import React, { useEffect, useRef } from "react";
import styled from "styled-components";

import * as am4core from "@amcharts/amcharts4/core";
import * as am4charts from "@amcharts/amcharts4/charts";
import {
  OrderBookChartProps,
  DrawLabelsParams,
  createChart,
} from "./OrderbookChart";

const drawLabels = ({
  chart,
  baseToken,
  quoteToken,
}: DrawLabelsParams): void => {
  const baseTokenLabel = baseToken.symbol;
  const quoteTokenLabel = quoteToken.symbol;
  const market = baseTokenLabel + "-" + quoteTokenLabel;

  const [xAxis] = chart.xAxes;
  const [yAxis] = chart.yAxes;

  xAxis.title.text = ` Price (${baseTokenLabel})`;
  yAxis.title.text = ` Volume (${quoteTokenLabel})`;

  xAxis.tooltip.background.cornerRadius = 0;
  xAxis.tooltip.background.fill = am4core.color("green");
  yAxis.tooltip.background.cornerRadius = 0;
  yAxis.tooltip.background.fill = am4core.color("red");

  xAxis.title.fill = am4core.color("white");
  yAxis.title.fill = am4core.color("white");

  const [bidSeries, askSeries] = chart.series;

  bidSeries.tooltipText = `[bold]${market}[/]\nBid Price: [bold]{priceFormatted}[/] ${quoteTokenLabel}\nVolume: [bold]{totalVolumeFormatted}[/] ${baseTokenLabel}`;
  askSeries.tooltipText = `[bold]${market}[/]\nAsk Price: [bold]{priceFormatted}[/] ${quoteTokenLabel}\nVolume: [bold]{totalVolumeFormatted}[/] ${baseTokenLabel}`;
};

const Wrapper = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  align-content: center;
  min-height: 186px;
  padding: 16px;
  text-align: center;
  box-sizing: border-box;
  color: ${({ theme }) => theme.text2};
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

interface OrderBookErrorProps {
  error: Error;
}

export const OrderBookError: React.FC<OrderBookErrorProps> = ({
  error,
}: OrderBookErrorProps) => (
  <Wrapper>{error ? error.message : "loading"}</Wrapper>
);

export default OrderBookChartSmall;
