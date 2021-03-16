import { Token } from 'uniswap-xdai-sdk'

import { OrderBookData, PricePoint } from '../../../api/AdditionalServicesApi'
import { Offer, OrderBookChartProps, PricePointDetails } from '../OrderbookChart'

const SMALL_VOLUME_THRESHOLD = 0.001

export const logDebug = (...args: any[]): void => {
  // eslint-disable-next-line no-console
  console.log(...args)
}

const addClearingPriceInfo = (
  price: number,
  pricePointsDetails: PricePointDetails[],
): PricePointDetails[] => {
  const pricePointBottom: PricePointDetails = {
    type: null,
    volume: null,
    totalVolume: null,
    price,

    // Data for representation
    priceNumber: price,
    totalVolumeNumber: 0,
    priceFormatted: price.toString(),
    totalVolumeFormatted: '0',
    askValueY: null,
    bidValueY: null,
    newOrderValueY: null,
    clearingPriceValueY: 0,
  }
  const valueYofBids = pricePointsDetails.map((y) => Math.max(y.bidValueY, y.askValueY))
  const maxValueYofBid = Math.max(...valueYofBids)
  const pricePointTop: PricePointDetails = {
    type: null,
    volume: null,
    totalVolume: null,
    price,

    // Data for representation
    priceNumber: price,
    totalVolumeNumber: 0,
    priceFormatted: price.toString(),
    totalVolumeFormatted: '0',
    askValueY: null,
    bidValueY: null,
    newOrderValueY: null,
    clearingPriceValueY: maxValueYofBid,
  }
  return [pricePointBottom, pricePointTop]
}
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
  const isBid = type == Offer.Bid

  // Filter tiny orders
  if (isBid) {
    pricePoints = pricePoints.filter((pricePoint) => pricePoint.volume > SMALL_VOLUME_THRESHOLD)
  } else {
    pricePoints = pricePoints.filter(
      (pricePoint) => pricePoint.volume * pricePoint.price > SMALL_VOLUME_THRESHOLD,
    )
  }

  // Adding first and last element to round up the picture
  if (type == Offer.Bid) {
    if (userOrder && highestValue * 1.5 > userOrder.price && userOrder.price > lowestValue) {
      highestValue = highestValue > userOrder.price ? highestValue : userOrder.price
      pricePoints = pricePoints.concat(userOrder)
    }
    pricePoints.sort((lhs, rhs) => -1 * (lhs.price - rhs.price))

    pricePoints.push({
      price: (highestValue * 101) / 100,
      volume: 0,
    })

    pricePoints.sort((lhs, rhs) => -1 * (lhs.price - rhs.price))
  } else {
    pricePoints.push({
      price: (highestValue * 101) / 100,
      volume: 0,
    })
    pricePoints.push({
      price: (pricePoints[0].price * 99) / 100,
      volume: 0,
    })
    pricePoints.sort((lhs, rhs) => lhs.price - rhs.price)
  }

  // Convert the price points that can be represented in the graph (PricePointDetails)
  const { points } = pricePoints.reduce(
    (acc, pricePoint, index) => {
      const { price, volume } = pricePoint
      const totalVolume = acc.totalVolume

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
      let askValueY, bidValueY
      if (isBid) {
        askValueY = null
        bidValueY = totalVolume
      } else {
        askValueY = totalVolume * price
        bidValueY = null
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
        clearingPriceValueY: null,
      }
      acc.points.push(pricePointDetails)
      if (!isBid) {
        // Add the new point at the beginning of order
        //      ------------
        //      |
        //  ----|<-here
        const pricePointDetails: PricePointDetails = {
          type,
          volume,
          totalVolume: acc.totalVolume + volume,
          price,

          // Data for representation
          priceNumber: price,
          totalVolumeNumber: acc.totalVolume + volume,
          priceFormatted: price.toString(),
          totalVolumeFormatted: (acc.totalVolume + volume).toString(),
          askValueY: (acc.totalVolume + volume) * price,
          bidValueY,
          newOrderValueY: null,
          clearingPriceValueY: null,
        }
        acc.points.push(pricePointDetails)
      }

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
          clearingPriceValueY: null,
        }
        acc.points.push(pricePointDetails)
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
          clearingPriceValueY: null,
        }
        acc.points.push(pricePointDetails_2)
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
          clearingPriceValueY: null,
        }
        acc.points.push(pricePointDetails)
      }
      return { totalVolume: totalVolume + volume, points: acc.points }
    },
    {
      totalVolume: 0,
      points: [] as PricePointDetails[],
    },
  )

  return points
}

function _printOrderBook(
  pricePoints: PricePointDetails[],
  baseTokenSymbol = '',
  quoteTokenSymbol = '',
): void {
  logDebug('Order Book: ' + baseTokenSymbol + '-' + quoteTokenSymbol)
  pricePoints.forEach((pricePoint) => {
    const isBid = pricePoint.type === Offer.Bid
    logDebug(
      `\t${isBid ? 'Bid' : 'Ask'} ${pricePoint.totalVolumeFormatted} ${baseTokenSymbol} at ${
        pricePoint.priceFormatted
      } ${quoteTokenSymbol}`,
    )
  })
}

interface ProcessRawDataParams {
  data: OrderBookData
  userOrder: PricePoint
  baseToken: Pick<Token, 'decimals' | 'symbol'>
  quoteToken: Pick<Token, 'decimals' | 'symbol'>
}
export function findClearingPrice(
  sellOrders: PricePoint[],
  userOrder: PricePoint | undefined,
  initialAuctionOrder: PricePoint,
): number | undefined {
  if (userOrder) {
    if (userOrder?.price > initialAuctionOrder?.price && userOrder.volume > 0) {
      sellOrders = sellOrders.concat(userOrder)
    }
  }
  sellOrders = Object.values(sellOrders)

  sellOrders.sort((lhs, rhs) => -1 * (lhs.price - rhs.price))
  let totalSellVolume = 0

  for (const order of sellOrders) {
    totalSellVolume = totalSellVolume + order.volume
    if (totalSellVolume >= initialAuctionOrder.volume * order.price) {
      const coveredBuyAmount =
        initialAuctionOrder.volume * order.price - (totalSellVolume - order.volume)
      if (coveredBuyAmount < order.volume) {
        return order.price
      } else {
        return (totalSellVolume - order.volume) / initialAuctionOrder.volume
      }
    }
  }
  if (totalSellVolume >= initialAuctionOrder?.volume * initialAuctionOrder?.price) {
    return totalSellVolume / initialAuctionOrder.volume
  } else {
    return initialAuctionOrder?.price
  }
}

export const processOrderbookData = ({
  baseToken,
  data,
  quoteToken,
  userOrder,
}: ProcessRawDataParams): PricePointDetails[] => {
  try {
    const clearingPrice = findClearingPrice(data.bids, userOrder, data.asks[0])
    const value = data.asks[0]?.price ?? 0
    const bids = processData(data.bids, userOrder, value, value, Offer.Bid)

    const asks = processData(data.asks, null, bids[0].price, value, Offer.Ask)
    let pricePoints = bids.concat(asks)

    if (clearingPrice) {
      const priceInfo = addClearingPriceInfo(clearingPrice, pricePoints)
      pricePoints = pricePoints.concat(priceInfo)
    }

    // Sort points by price
    pricePoints.sort((lhs, rhs) => lhs.price - rhs.price)
    const debug = false
    if (debug) _printOrderBook(pricePoints, baseToken.symbol, quoteToken.symbol)
    return pricePoints
  } catch (error) {
    console.error('Error processing data', error)
    return []
  }
}

export interface OrderBookProps extends Omit<OrderBookChartProps, 'data'> {
  auctionId?: number
}
