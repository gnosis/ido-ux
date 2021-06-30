import { ChainId, Token, TokenAmount } from 'uniswap-xdai-sdk'

import { BigNumber } from '@ethersproject/bignumber'

import { encodeOrder } from '../hooks/Order'
import { getClaimableData } from '../hooks/useClaimOrderCallback'

const weth = new Token(
  ChainId.RINKEBY,
  '0xc778417E063141139Fce010982780140Aa0cD5Ab',
  18,
  'USDC',
  '',
)

const usdc = new Token(ChainId.RINKEBY, '0x4DBCdF9B62e891a7cec5A2568C3F4FAF9E8Abe2b', 6, 'USDC', '')

const dai = new Token(ChainId.RINKEBY, '0x5592EC0cfb4dbc12D3aB100b257153436a1f0FEa', 18, 'DAI', '')

describe('getClaimableData', () => {
  it('checks that participant receives all their biddingTokens back if minFundingThreshold was not met', () => {
    const sellOrders = [
      {
        sellAmount: BigNumber.from('10000000'),
        buyAmount: BigNumber.from('1000000000000000000'),
        userId: BigNumber.from(2),
      },
    ]
    const ordersFromUser = sellOrders.map((o) => encodeOrder(o))
    const clearingPriceVolume = BigNumber.from('50000')
    const clearingPriceOrder = {
      sellAmount: BigNumber.from('10000000'),
      buyAmount: BigNumber.from('200000000000000000000'),
      userId: BigNumber.from(2),
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
      claimableBiddingToken: new TokenAmount(dai, '10000000'),
    })
  })

  it('checks that participant receives auctioning tokens back if minFundingThreshold is met', () => {
    const sellOrders = [
      {
        sellAmount: BigNumber.from('100000000000000000'),
        buyAmount: BigNumber.from('149925037481259370314'),
        userId: BigNumber.from(2),
      },
    ]
    const ordersFromUser = sellOrders.map((o) => encodeOrder(o))
    const clearingPriceVolume = BigNumber.from('10005000000000000')
    const clearingPriceOrder = {
      sellAmount: BigNumber.from('100000000000000000'),
      buyAmount: BigNumber.from('149925037481259370314'),
      userId: BigNumber.from(2),
    }

    const claimed = getClaimableData({
      auctioningToken: weth,
      biddingToken: dai,
      clearingPriceVolume,
      clearingPriceOrder,
      minFundingThresholdNotReached: true,
      ordersFromUser,
    })

    // 0 and 100
    expect(claimed).toStrictEqual({
      claimableAuctioningToken: new TokenAmount(weth, '0'),
      claimableBiddingToken: new TokenAmount(dai, '100'),
    })
  })
})
