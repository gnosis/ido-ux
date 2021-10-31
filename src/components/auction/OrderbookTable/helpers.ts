import round from 'lodash.round'

import { PricePoint } from '../../../api/AdditionalServicesApi'

// https://stackoverflow.com/a/55700334
export const countDecimals = function (num: number) {
  const text = num.toString()
  if (text.indexOf('e-') > -1) {
    const [base, trail] = text.split('e-')
    const elen = parseInt(trail, 10)
    const idx = base.indexOf('.')
    return idx == -1 ? 0 + elen : base.length - idx - 1 + elen
  }
  const index = text.indexOf('.')
  return index == -1 ? 0 : text.length - index - 1
}

export interface OrderBookTableData {
  amount: number
  sum: number
  mySize: number
}

export const buildTableData = (bids: PricePoint[], myBids: PricePoint[], granularity: number) => {
  const rangeVolume = new Map<number, OrderBookTableData>()
  const myBidsPriceRange = new Map<number, number>()
  let cumulativeSum = 0

  const sortedBids = [...bids].sort((a, b) => b.price - a.price)
  for (const myBid of myBids) {
    const priceRange = getPriceRangeKey(myBid.price, granularity)
    myBidsPriceRange.set(myBid.price, priceRange)
  }

  for (const bid of sortedBids) {
    const key = getPriceRangeKey(bid.price, granularity)
    const currentValue = rangeVolume.get(key) || { amount: 0, sum: cumulativeSum, mySize: 0 }
    currentValue.amount = currentValue.amount + bid.volume
    currentValue.sum = currentValue.sum + bid.volume
    cumulativeSum += bid.volume

    let mySize = 0
    for (const myBid of myBids) {
      const priceRange = myBidsPriceRange.get(myBid.price)
      if (priceRange === key) {
        mySize += (myBid.volume / currentValue.amount) * 100
      }
    }
    currentValue.mySize = Math.min(round(mySize, 2), 100)

    rangeVolume.set(key, currentValue)
  }

  return Array.from(rangeVolume, ([price, value]) => ({ price, ...value }))
}

const getPriceRangeKey = (price: number, granularity: number): number => {
  return granularity > 1
    ? Math.floor(price / granularity) * granularity
    : round(price, countDecimals(granularity))
}
