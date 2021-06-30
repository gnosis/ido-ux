import { ChainId, Token, TokenAmount } from 'uniswap-xdai-sdk'

import { BigNumber } from '@ethersproject/bignumber'

import { encodeOrder } from '../hooks/Order'
import { getClaimableData } from '../hooks/useClaimOrderCallback'

const auctioningToken = new Token(
  ChainId.RINKEBY,
  '0x4DBCdF9B62e891a7cec5A2568C3F4FAF9E8Abe2b',
  6,
  'USDC',
  '',
)
const biddingToken = new Token(
  ChainId.RINKEBY,
  '0x5592EC0cfb4dbc12D3aB100b257153436a1f0FEa',
  18,
  'KNC',
  '',
)

describe('getClaimableData', async () => {
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
      auctioningToken,
      biddingToken,
      clearingPriceVolume,
      clearingPriceOrder,
      minFundingThresholdNotReached: true,
      ordersFromUser,
    })

    expect(claimed).toStrictEqual({
      claimableAuctioningToken: new TokenAmount(auctioningToken, '0'),
      claimableBiddingToken: new TokenAmount(biddingToken, '10000000'),
    })
  })
})
