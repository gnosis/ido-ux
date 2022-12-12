import { BigNumber } from '@ethersproject/bignumber'
import { parseUnits } from '@ethersproject/units'
import { ChainId, Token, TokenAmount } from '@josojo/honeyswap-sdk'

import { encodeOrder } from './Order'
import { getClaimableData } from './useClaimOrderCallback'

const weth = new Token(ChainId.GÖRLI, '0xb4fbf271143f4fbf7b91a5ded31805e42b2208d6', 18, 'WETH', '')

const usdc = new Token(ChainId.GÖRLI, '0x5ffbac75efc9547fbc822166fed19b05cd5890bb', 6, 'USDC', '')

const dai = new Token(ChainId.GÖRLI, '0xe68104d83e647b7c1c15a91a8d8aad21a51b3b3e', 18, 'DAI', '')

describe('getClaimableData when minFundingThreshold was not met', () => {
  it('checks that participant receives all their biddingTokens back', () => {
    const sellOrders = [
      {
        userId: BigNumber.from(2),
        buyAmount: parseUnits('100'),
        sellAmount: parseUnits('100'),
      },
    ]
    const ordersFromUser = sellOrders.map((o) => encodeOrder(o))
    const clearingPriceVolume = BigNumber.from('50000')
    const clearingPriceOrder = {
      userId: BigNumber.from(2),
      buyAmount: parseUnits('100'),
      sellAmount: parseUnits('100'),
    }

    const claimed = getClaimableData({
      auctioningToken: usdc,
      biddingToken: dai,
      clearingPriceVolume,
      clearingPriceOrder,
      minFundingThresholdNotReached: true,
      ordersFromUser,
    })

    expect(claimed).toStrictEqual({
      claimableAuctioningToken: new TokenAmount(usdc, '0'),
      claimableBiddingToken: new TokenAmount(dai, parseUnits('100').toString()),
    })
  })
})

describe('getClaimableData when minFundingThreshold was met', () => {
  it('checks that participant receives auctioning tokens', () => {
    const sellOrders = [
      {
        userId: BigNumber.from(2),
        buyAmount: parseUnits('100'), // DAI
        sellAmount: parseUnits('0.1'), // WETH
      },
    ]
    const ordersFromUser = sellOrders.map((o) => encodeOrder(o))
    const clearingPriceVolume = parseUnits('0.1')
    const clearingPriceOrder = {
      userId: BigNumber.from(2),
      buyAmount: parseUnits('100'), // DAI
      sellAmount: parseUnits('0.1'), // WETH
    }

    const claimed = getClaimableData({
      auctioningToken: dai,
      biddingToken: weth,
      clearingPriceVolume,
      clearingPriceOrder,
      minFundingThresholdNotReached: false,
      ordersFromUser,
    })

    expect(claimed.claimableAuctioningToken?.toFixed()).toBe(
      new TokenAmount(dai, parseUnits('100').toString()).toFixed(),
    )
    expect(claimed.claimableBiddingToken?.toFixed()).toBe(new TokenAmount(weth, '0').toFixed())
  })

  it('checks that participant receives auctioning and bidding tokens', () => {
    const sellOrders = [
      {
        userId: BigNumber.from(2),
        buyAmount: parseUnits('100'), // DAI
        sellAmount: parseUnits('0.1'), // WETH
      },
    ]
    const ordersFromUser = sellOrders.map((o) => encodeOrder(o))
    const clearingPriceVolume = parseUnits('0.01')
    const clearingPriceOrder = {
      userId: BigNumber.from(2),
      buyAmount: parseUnits('100'), // DAI
      sellAmount: parseUnits('0.1'), // WETH
    }

    const claimed = getClaimableData({
      auctioningToken: dai,
      biddingToken: weth,
      clearingPriceVolume,
      clearingPriceOrder,
      minFundingThresholdNotReached: false,
      ordersFromUser,
    })

    expect(claimed.claimableAuctioningToken?.toFixed()).toBe(
      new TokenAmount(dai, parseUnits('10').toString()).toFixed(),
    )
    expect(claimed.claimableBiddingToken?.toFixed()).toBe(
      new TokenAmount(weth, parseUnits('0.09').toString()).toFixed(),
    )
  })

  it('checks that participant receives auctioning tokens if order is smaller than clearing price', () => {
    const sellOrders = [
      {
        userId: BigNumber.from(2),
        buyAmount: parseUnits('10'), // DAI
        sellAmount: parseUnits('0.1'), // WETH
      },
    ]
    const ordersFromUser = sellOrders.map((o) => encodeOrder(o))
    const clearingPriceVolume = parseUnits('1')
    const clearingPriceOrder = {
      userId: BigNumber.from(2),
      buyAmount: parseUnits('100'), // DAI
      sellAmount: parseUnits('1'), // WETH
    }

    const claimed = getClaimableData({
      auctioningToken: dai,
      biddingToken: weth,
      clearingPriceVolume,
      clearingPriceOrder,
      minFundingThresholdNotReached: false,
      ordersFromUser,
    })

    expect(claimed.claimableAuctioningToken?.toFixed()).toBe(
      new TokenAmount(dai, parseUnits('10').toString()).toFixed(),
    )
    expect(claimed.claimableBiddingToken?.toFixed()).toBe(
      new TokenAmount(weth, parseUnits('0').toString()).toFixed(),
    )
  })

  it('checks that participant receives bidding tokens back if order is bigger than clearing price', () => {
    const sellOrders = [
      {
        userId: BigNumber.from(2),
        buyAmount: parseUnits('100'), // DAI
        sellAmount: parseUnits('0.01'), // WETH
      },
    ]
    const ordersFromUser = sellOrders.map((o) => encodeOrder(o))
    const clearingPriceVolume = parseUnits('1')
    const clearingPriceOrder = {
      userId: BigNumber.from(2),
      buyAmount: parseUnits('10'), // DAI
      sellAmount: parseUnits('0.1'), // WETH
    }

    const claimed = getClaimableData({
      auctioningToken: dai,
      biddingToken: weth,
      clearingPriceVolume,
      clearingPriceOrder,
      minFundingThresholdNotReached: false,
      ordersFromUser,
    })

    expect(claimed.claimableAuctioningToken?.toFixed()).toBe(
      new TokenAmount(dai, parseUnits('0').toString()).toFixed(),
    )
    expect(claimed.claimableBiddingToken?.toFixed()).toBe(
      new TokenAmount(weth, parseUnits('0.01').toString()).toFixed(),
    )
  })
})
