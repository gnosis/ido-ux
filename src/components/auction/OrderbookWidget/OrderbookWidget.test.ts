import { Fraction, JSBI } from 'uniswap-xdai-sdk'

import { PricePoint } from '../../../api/AdditionalServicesApi'
import { CalculatorClearingPrice, findClearingPrice } from './'

// Calculate Clearing Price
export default describe('findClearingPrice', () => {
  describe('When the auction has no sell orders', () => {
    it('there is not an userOrder', () => {
      const sellOrders = []
      const userOrder = { price: undefined, volume: undefined }
      const initialAuctionPrice = factoryInitialAuctionOrder()

      const clearingPrice = findClearingPrice(sellOrders, userOrder, initialAuctionPrice)

      expect(clearingPrice).toEqual(initialAuctionPrice.price)
    })
    it('there is an userOrder which totalSellVolume is less than minimumBuyAmount', () => {
      const sellOrders = []
      const userOrder = factoryPricePoint(900, 1)
      const initialAuctionPrice = factoryInitialAuctionOrder()

      const clearingPrice = findClearingPrice(sellOrders, userOrder, initialAuctionPrice)

      expect(clearingPrice).toEqual(0.6)
    })
    it('there is an userOrder which totalSellVolume is gte than minimumBuyAmount', () => {
      const sellOrders = []
      const userOrder = factoryPricePoint(3000, 2)
      const initialAuctionPrice = factoryInitialAuctionOrder()

      const clearingPrice = findClearingPrice(sellOrders, userOrder, initialAuctionPrice)

      expect(clearingPrice).toEqual(2)
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
  describe('calculate clearingPrice locally from bids and asks', () => {
    it('should get clearingPrice from offers and demand', () => {
      const bids = factorySellOrders()
      const userOffer = factoryPricePoint(3000, 2)
      const asks = factoryInitialAuctionOrder()

      const { price, priceReversed } = CalculatorClearingPrice.fromOrderbook(bids, asks, userOffer)

      const expectedPrice = 2
      const expectedPriceReversed = 0.5
      expect(price).toEqual(expectedPrice)
      expect(priceReversed).toEqual(expectedPriceReversed)
    })
    it('bids prices with 18 decimals when totalSellAmount less than than minimum bidding BuyAmount', () => {
      const bids = factorySellOrders([
        [0.6000240009600384, 100],
        [0.5005397978211796, 51],
      ])
      const userOffer = factoryPricePoint(900, 1)
      const asks = factoryInitialAuctionOrder()

      const { price, priceReversed } = CalculatorClearingPrice.fromOrderbook(bids, asks, userOffer)

      const expectedPrice = 0.60002
      const expectedPriceReversed = 1.6666
      expect(price).toBeCloseTo(expectedPrice)
      expect(priceReversed).toBeCloseTo(expectedPriceReversed)
    })
  })

  describe('Fraction derived from API services', () => {
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
