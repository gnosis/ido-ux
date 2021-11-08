import { Fraction, Token } from '@josojo/honeyswap-sdk'

import { OrderBookData, PricePoint } from '../../../api/AdditionalServicesApi'
import {
  MAX_DECIMALS_PRICE_FORMAT,
  NUMBER_OF_DIGITS_FOR_INVERSION,
} from '../../../constants/config'
import { getLogger } from '../../../utils/logger'
import { getInverse, showChartsInverted } from '../../../utils/prices'
import { Offer, Props as OrderBookChartProps, PricePointDetails } from '../OrderbookChart'

const logger = getLogger('OrderbookWidget')

const SMALL_VOLUME_THRESHOLD = 0.001

export const logDebug = (...args: any[]): void => {
  logger.log(...args)
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
  showChartsInverted: boolean,
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
      price: (highestValue * 104) / 100,
      volume: 0,
    })

    pricePoints.sort((lhs, rhs) => -1 * (lhs.price - rhs.price))
    pricePoints.push({
      price: (lowestValue * 96) / 100,
      volume: 0,
    })
  } else {
    if (showChartsInverted) {
      const interpolationSteps = 100
      for (let i = 0; i < interpolationSteps; i++) {
        pricePoints.push({
          price:
            (highestValue * 104) / 100 - (i * (highestValue - lowestValue)) / interpolationSteps,
          volume: 0,
        })
      }
    } else {
      pricePoints.push({
        price: (highestValue * 104) / 100,
        volume: 0,
      })
    }
    pricePoints.push({
      price: (pricePoints[0].price * 96) / 100,
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
        priceFormatted: price.toFixed(MAX_DECIMALS_PRICE_FORMAT),
        totalVolumeFormatted: totalVolume.toFixed(MAX_DECIMALS_PRICE_FORMAT),
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
          priceFormatted: price.toFixed(MAX_DECIMALS_PRICE_FORMAT),
          totalVolumeFormatted: (acc.totalVolume + volume).toFixed(MAX_DECIMALS_PRICE_FORMAT),
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
  baseToken: Token
  quoteToken: Token
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
      if (coveredBuyAmount >= 0 && coveredBuyAmount <= order.volume) {
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
  if (!data) {
    return []
  }
  try {
    const clearingPrice = findClearingPrice(data.bids, userOrder, data.asks[0])
    const min_value = Math.min(clearingPrice * 2, data.asks[0]?.price ?? 0)
    let max_value = Math.max(clearingPrice * 2, Math.max(...data.asks.map((i) => i.price)) ?? 0)

    const bids = processData(
      data.bids,
      userOrder,
      max_value,
      min_value,
      Offer.Bid,
      showChartsInverted(baseToken),
    )
    bids.sort((lhs, rhs) => -(lhs.price - rhs.price))
    max_value = Math.min(clearingPrice * 2, bids[0].price ?? 0)
    const asks = processData(
      data.asks,
      null,
      max_value,
      min_value,
      Offer.Ask,
      showChartsInverted(baseToken),
    )
    // Filter for price-points close to clearing price
    const asksFiltered = asks.filter((pp) => Math.abs(pp.price - clearingPrice) / clearingPrice < 2)
    let bidsFiltered = bids.filter((pp) => Math.abs(pp.price - clearingPrice) / clearingPrice < 2)
    bidsFiltered.sort((lhs, rhs) => lhs.price - rhs.price)
    // append one last bid value at height of last element:
    if (bidsFiltered.length > 0) {
      const newLastElement = bidsFiltered.slice(-1)[0]
      const overall_max_value = Math.max(max_value, newLastElement.price)
      newLastElement.priceFormatted = overall_max_value.toString()
      newLastElement.priceNumber = overall_max_value
      newLastElement.price = overall_max_value
      newLastElement.volume = 0.001
      bidsFiltered = bidsFiltered.concat(newLastElement)
    }

    let pricePoints = bidsFiltered.concat(asksFiltered)

    if (clearingPrice) {
      const priceInfo = addClearingPriceInfo(clearingPrice, pricePoints)
      pricePoints = pricePoints.concat(priceInfo)
    }

    // Sort points by price, unless the price is equal. Then we sort by totalVolume
    pricePoints.sort((lhs, rhs) =>
      lhs.price != rhs.price
        ? lhs.price - rhs.price
        : lhs.type == 1
        ? lhs.totalVolume - rhs.totalVolume
        : -(lhs.totalVolume - rhs.totalVolume),
    )

    const debug = false
    if (debug) _printOrderBook(pricePoints, baseToken.symbol, quoteToken.symbol)
    return pricePoints
  } catch (error) {
    logger.error('Error processing data', error)
    return []
  }
}

export interface OrderBookProps extends Omit<OrderBookChartProps, 'data'> {
  auctionId?: number
}

export class CalculatorClearingPrice {
  static fromOrderbook(
    sellOrders: PricePoint[],
    initialAuctionOrder: PricePoint,
    userOrder?: PricePoint,
  ) {
    const price = findClearingPrice([...sellOrders], userOrder, initialAuctionOrder)
    const priceReversed = getInverse(String(price), NUMBER_OF_DIGITS_FOR_INVERSION)

    return { price: price ? price : 0, priceReversed: Number(priceReversed) }
  }

  /**
   * Allows to get the clearingPrice from Fraction with
   * SellOrder (sellAmountToken / buyAmountToken)
   *
   * That info is assembled from API.
   */
  static convertFromFraction(fractionClearingPrice: Fraction) {
    const price = fractionClearingPrice.toSignificant(5)
    const priceReversed = fractionClearingPrice.invert().toSignificant(5)

    return { price, priceReversed }
  }
}
