import React from "react";

import { OrderBookData, PricePoint } from "../api/AdditionalServicesApi";

import OrderBookChart, {
  OrderBookChartProps,
  OrderBookError,
  PricePointDetails,
  Offer,
} from "./OrderbookChart";
import { Token } from "@uniswap/sdk";
import { useOrderbookState } from "../state/orderbook/hooks";

const SMALL_VOLUME_THRESHOLD = 0.001;

// Todo: to be removed
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const logDebug = (...args: any[]): void => {
  if (true) {
    console.log(...args);
  }
};

/**
 * This method turns the raw data that the backend returns into data that can be displayed by the chart.
 * This involves aggregating the total volume and accounting for decimals
 */
const processData = (
  pricePoints: PricePoint[],
  userOrder: PricePoint,
  highestValue: number,
  lowestValue: number,
  type: Offer,
): PricePointDetails[] => {
  const isBid = type == Offer.Bid;

  // Filter tiny orders
  if (isBid) {
    pricePoints = pricePoints.filter(
      (pricePoint) => pricePoint.volume > SMALL_VOLUME_THRESHOLD,
    );
  } else {
    pricePoints = pricePoints.filter(
      (pricePoint) =>
        pricePoint.volume * pricePoint.price > SMALL_VOLUME_THRESHOLD,
    );
  }

  // Adding first and last element to round up the picture
  if (type == Offer.Bid) {
    if (
      userOrder &&
      highestValue * 1.5 > userOrder.price &&
      userOrder.price > lowestValue
    ) {
      highestValue =
        highestValue > userOrder.price ? highestValue : userOrder.price;
      pricePoints = pricePoints.concat(userOrder);
    }
    pricePoints.sort((lhs, rhs) => -1 * (lhs.price - rhs.price));

    pricePoints.push({
      price: (highestValue * 101) / 100,
      volume: 0,
    });

    pricePoints.sort((lhs, rhs) => -1 * (lhs.price - rhs.price));
  } else {
    pricePoints.push({
      price: (highestValue * 101) / 100,
      volume: 0,
    });
    pricePoints.push({
      price: (pricePoints[0].price * 99) / 100,
      volume: 0,
    });
    pricePoints.sort((lhs, rhs) => lhs.price - rhs.price);
  }

  // Convert the price points that can be represented in the graph (PricePointDetails)
  const { points } = pricePoints.reduce(
    (acc, pricePoint, index) => {
      const { price, volume } = pricePoint;
      const totalVolume = acc.totalVolume + volume;

      // Amcharts draws step lines so that the x value is centered (Default). To correctly display the order book, we want
      // the x value to be at the left side of the step for asks and at the right side of the step for bids.
      //
      //    Default            Bids          Asks
      //            |      |                        |
      //   ---------       ---------       ---------
      //  |                         |      |
      //       x                    x      x
      //
      // For asks, we can offset the "startLocation" by 0.5. However, Amcharts does not support a "startLocation" of -0.5.
      // For bids, we therefore offset the curve by -1 (expose the previous total volume) and use an offset of 0.5.
      // Otherwise our steps would be off by one.
      let askValueY, bidValueY;
      if (isBid) {
        const previousPricePoint = acc.points[index - 1];
        askValueY = null;
        bidValueY = previousPricePoint?.totalVolume || 0;
      } else {
        askValueY = totalVolume * price;
        bidValueY = null;
      }

      if (!isBid) {
        // Add the new point at the beginning of order
        //      ------------
        //      |
        //  ----|<-here
        const pricePointDetails: PricePointDetails = {
          type,
          volume,
          totalVolume: acc.totalVolume,
          price,

          // Data for representation
          priceNumber: price,
          totalVolumeNumber: acc.totalVolume,
          priceFormatted: price.toString(),
          totalVolumeFormatted: acc.totalVolume.toString(),
          askValueY: acc.totalVolume * price,
          bidValueY,
          newOrderValueY: null,
        };
        acc.points.push(pricePointDetails);
      }
      // Add the new point
      const pricePointDetails: PricePointDetails = {
        type,
        volume,
        totalVolume,
        price,

        // Data for representation
        priceNumber: price,
        totalVolumeNumber: totalVolume,
        priceFormatted: price.toString(),
        totalVolumeFormatted: totalVolume.toString(),
        askValueY,
        bidValueY,
        newOrderValueY: null,
      };
      acc.points.push(pricePointDetails);

      // Next two points are only added for displaying new Order
      if (userOrder && userOrder == pricePoint) {
        // Add the new point
        const pricePointDetails: PricePointDetails = {
          type,
          volume,
          totalVolume,
          price,

          // Data for representation
          priceNumber: price,
          totalVolumeNumber: totalVolume,
          priceFormatted: price.toString(),
          totalVolumeFormatted: totalVolume.toString(),
          askValueY: null,
          bidValueY: null,
          newOrderValueY: bidValueY + volume,
        };
        acc.points.push(pricePointDetails);
        const pricePointDetails_2: PricePointDetails = {
          type,
          volume,
          totalVolume,
          price,

          // Data for representation
          priceNumber: price,
          totalVolumeNumber: totalVolume,
          priceFormatted: price.toString(),
          totalVolumeFormatted: totalVolume.toString(),
          askValueY: null,
          bidValueY: null,
          newOrderValueY: bidValueY,
        };
        acc.points.push(pricePointDetails_2);
      }
      if (
        index > 0 &&
        userOrder &&
        userOrder.price &&
        userOrder.price == acc.points[index - 1].price &&
        acc.points[index - 1].newOrderValueY == null &&
        userOrder.volume &&
        userOrder.volume == acc.points[index - 1].volume
      ) {
        // Add the new point
        const pricePointDetails: PricePointDetails = {
          type,
          volume,
          totalVolume,
          price,

          // Data for representation
          priceNumber: price,
          totalVolumeNumber: totalVolume,
          priceFormatted: price.toString(),
          totalVolumeFormatted: totalVolume.toString(),
          askValueY: null,
          bidValueY: null,
          newOrderValueY: bidValueY,
        };
        acc.points.push(pricePointDetails);
      }

      return { totalVolume, points: acc.points };
    },
    {
      totalVolume: 0,
      points: [] as PricePointDetails[],
    },
  );

  return points;
};

function _printOrderBook(
  pricePoints: PricePointDetails[],
  baseTokenSymbol = "",
  quoteTokenSymbol = "",
): void {
  logDebug("Order Book: " + baseTokenSymbol + "-" + quoteTokenSymbol);
  pricePoints.forEach((pricePoint) => {
    const isBid = pricePoint.type === Offer.Bid;
    logDebug(
      `\t${isBid ? "Bid" : "Ask"} ${
        pricePoint.totalVolumeFormatted
      } ${baseTokenSymbol} at ${pricePoint.priceFormatted} ${quoteTokenSymbol}`,
    );
  });
}

interface ProcessRawDataParams {
  data: OrderBookData;
  userOrder: PricePoint;
  baseToken: Pick<Token, "decimals" | "symbol">;
  quoteToken: Pick<Token, "decimals" | "symbol">;
}

export const processOrderbookData = ({
  data,
  userOrder,
  baseToken,
  quoteToken,
}: ProcessRawDataParams): PricePointDetails[] => {
  try {
    const bids = processData(
      data.bids,
      userOrder,
      data.asks[0].price,
      data.asks[0].price,
      Offer.Bid,
    );

    const asks = processData(
      data.asks,
      null,
      bids[0].price,
      data.asks[0].price,
      Offer.Ask,
    );
    const pricePoints = bids.concat(asks);

    // Sort points by price
    pricePoints.sort((lhs, rhs) => lhs.price - rhs.price);
    const debug = false;
    if (debug)
      _printOrderBook(pricePoints, baseToken.symbol, quoteToken.symbol);

    return pricePoints;
  } catch (error) {
    console.error("Error processing data", error);
    return [];
  }
};

export interface OrderBookProps extends Omit<OrderBookChartProps, "data"> {
  auctionId?: number;
}

const OrderBookWidget: React.FC<OrderBookProps> = (props: OrderBookProps) => {
  const { baseToken, quoteToken, networkId } = props;
  const {
    error,
    bids,
    asks,
    userOrderPrice,
    userOrderVolume,
  } = useOrderbookState();

  if (error || !asks || asks.length == 0)
    return <OrderBookError error={error} />;
  const processedOrderbook = processOrderbookData({
    data: { bids, asks },
    userOrder: { price: userOrderPrice, volume: userOrderVolume },
    baseToken,
    quoteToken,
  });
  return (
    <OrderBookChart
      baseToken={baseToken}
      quoteToken={quoteToken}
      networkId={networkId}
      data={processedOrderbook}
    />
  );
};

export default OrderBookWidget;
