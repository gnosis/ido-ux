import { Fraction, JSBI } from 'uniswap-xdai-sdk'

import { PricePoint } from '../../../api/AdditionalServicesApi'
import { CalculatorClearingPrice, findClearingPrice } from './'

// Calculate Clearing Price
export default describe('findClearingPrice', () => {
  describe('When the auction has no sell orders', () => {
    it('should return expected clearingPrice', () => {
      const sellOrders = []
      const userOrder = factoryPricePoint(1500, 1)
      const initialAuctionPrice = factoryInitialAuctionOrder()

      const clearingPrice = findClearingPrice(sellOrders, userOrder, initialAuctionPrice)

      expect(clearingPrice).toEqual(1)
    })
  })

  describe('Has multiple sell orders', () => {
    it('should return expected clearingPrice', () => {
      const sellOrders = factorySellOrders()
      const userOrder = factoryPricePoint(4500, 3)
      const initialAuctionPrice = factoryInitialAuctionOrder()

      const clearingPrice = findClearingPrice(sellOrders, userOrder, initialAuctionPrice)

      expect(clearingPrice).toEqual(3)
    })
  })
})

describe('CalculatorClearingPrice', () => {
  it('should get clearingPrice from offers and demand', () => {
    const bids = factorySellOrders()
    const userOffer = factoryPricePoint(3000, 2)
    const asks = factoryInitialAuctionOrder()
    const calculatorClearingPrice = new CalculatorClearingPrice(bids, userOffer, asks)

    const { price, priceReversed } = calculatorClearingPrice.calculate()

    expect(price).toEqual('2')
    expect(priceReversed).toEqual('0.5')
  })
  it('should get clearingPrice from Fraction', () => {
    const buyAmount = JSBI.BigInt(4500)
    const sellAmount = JSBI.BigInt(1500)
    const fractionClearingPrice = new Fraction(buyAmount, sellAmount)
    const { price, priceReversed } = CalculatorClearingPrice.convertFromFraction(
      fractionClearingPrice,
    )

    expect(price).toEqual('3')
    expect(priceReversed).toEqual('0.33333')
  })
})

function factoryPricePoint(volume: number, price: number): PricePoint {
  return { volume, price }
}

function factoryInitialAuctionOrder(volume?: number, price?: number) {
  const defaultVolume = 1500
  const defaultPrice = 0.5

  return factoryPricePoint(volume ? volume : defaultVolume, price ? price : defaultPrice)
}

type SellOrdersTest = number[][]

function factorySellOrders(sellOrders?: SellOrdersTest) {
  const defaultOrders = [
    [0.55, 900],
    [2, 3000],
  ]

  return sellOrders?.length
    ? sellOrders.map((e) => factoryPricePoint(e[0], e[1]))
    : defaultOrders.map((e) => factoryPricePoint(e[0], e[1]))
}
