import React, { useEffect, useRef } from "react";
import styled from "styled-components";

import * as am4core from "@amcharts/amcharts4/core";
import * as am4charts from "@amcharts/amcharts4/charts";
import am4themesSpiritedaway from "@amcharts/amcharts4/themes/spiritedaway";

import { Token } from "@uniswap/sdk";

export interface OrderBookChartProps {
  /**
   * Base Token for Y-axis
   */
  baseToken: Token;
  /**
   * Quote Token for X-axis
   */
  quoteToken: Token;
  /**
   * current network id
   */
  networkId: number;
  /**
   * price/volume data with asks and bids
   */
  data: PricePointDetails[] | null;
}

const Wrapper = styled.div`
  display: flex;
  justify-content: center;
  /* min-height: 40rem; */
  /* height: calc(100vh - 30rem); */
  text-align: center;
  width: 100%;
  height: 100%;
  min-width: 100%;
  text-color: ${({ theme }) => theme.white};

  .amcharts-Sprite-group {
    font-size: 1rem;
    color: ${({ theme }) => theme.white};
  }

  .amcharts-Label {
    text-transform: uppercase;
    font-size: 1rem;
    color: ${({ theme }) => theme.white};
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
    fill: var(--color-text-primary);
  }
`;

interface OrderBookErrorProps {
  error: Error;
}

export const OrderBookError: React.FC<OrderBookErrorProps> = ({
  error,
}: OrderBookErrorProps) => (
  <Wrapper>{error ? error.message : "loading"}</Wrapper>
);

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
  type: Offer;
  volume: number; // volume for the price point
  totalVolume: number; // cumulative volume
  price: number;

  // Data for representation
  priceNumber: number;
  priceFormatted: string;
  totalVolumeNumber: number;
  totalVolumeFormatted: string;
  askValueY: number | null;
  bidValueY: number | null;
}

const createChart = (chartElement: HTMLElement): am4charts.XYChart => {
  am4core.useTheme(am4themesSpiritedaway);
  am4core.options.autoSetClassName = true;
  const chart = am4core.create(chartElement, am4charts.XYChart);
  chart.paddingTop = 0;
  chart.marginTop = 0;
  chart.paddingBottom = 0;
  chart.paddingLeft = 0;
  chart.paddingRight = 0;
  chart.marginBottom = 0;

  // Colors
  const colors = {
    green: "#3d7542",
    red: "#dc1235",
    white: "#FFFFFF",
  };

  // Create axes
  const priceAxis = chart.xAxes.push(new am4charts.ValueAxis());
  const volumeAxis = chart.yAxes.push(new am4charts.ValueAxis());
  priceAxis.renderer.labels.template.disabled = true;
  volumeAxis.renderer.labels.template.disabled = true;
  priceAxis.renderer.grid.template.disabled = true;

  volumeAxis.renderer.grid.template.disabled = true;
  priceAxis.renderer.minGridDistance = 10;
  volumeAxis.renderer.minGridDistance = 10;
  // Create series
  const bidSeries = chart.series.push(new am4charts.StepLineSeries());
  bidSeries.dataFields.valueX = "priceNumber";
  bidSeries.dataFields.valueY = "bidValueY";
  bidSeries.strokeWidth = 2;
  bidSeries.stroke = am4core.color(colors.green);
  bidSeries.fill = bidSeries.stroke;
  bidSeries.fillOpacity = 0.1;

  const askSeries = chart.series.push(new am4charts.LineSeries());
  askSeries.dataFields.valueX = "priceNumber";
  askSeries.dataFields.valueY = "askValueY";
  askSeries.strokeWidth = 2;
  askSeries.stroke = am4core.color(colors.red);
  askSeries.fill = askSeries.stroke;
  askSeries.fillOpacity = 0.1;

  // Add cursor
  chart.cursor = new am4charts.XYCursor();
  return chart;
};

interface DrawLabelsParams {
  chart: am4charts.XYChart;
  baseToken: Token;
  quoteToken: Token;
  networkId: number;
}

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
  xAxis.title.fill = am4core.color("white");
  yAxis.title.fill = am4core.color("white");

  const [bidSeries, askSeries] = chart.series;

  bidSeries.tooltipText = `[bold]${market}[/]\nBid Price: [bold]{priceFormatted}[/] ${quoteTokenLabel}\nVolume: [bold]{totalVolumeFormatted}[/] ${baseTokenLabel}`;
  askSeries.tooltipText = `[bold]${market}[/]\nAsk Price: [bold]{priceFormatted}[/] ${quoteTokenLabel}\nVolume: [bold]{totalVolumeFormatted}[/] ${baseTokenLabel}`;
};

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

  return <Wrapper ref={mountPoint}>Show order book for auction</Wrapper>;
};

export default OrderBookChartSmall;
