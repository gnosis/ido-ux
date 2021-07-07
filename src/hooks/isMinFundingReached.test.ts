import { ChainId, Token } from 'uniswap-xdai-sdk'

import { parseUnits } from '@ethersproject/units'

import { isMinFundingReached } from './useClaimOrderCallback'

const weth = new Token(
  ChainId.RINKEBY,
  '0xc778417E063141139Fce010982780140Aa0cD5Ab',
  18,
  'WETH',
  '',
)

describe('isMinFundingReached', () => {
  it('should return true when current bidding is higher than min threshold', () => {
    const currentBidding = parseUnits('10').toString()
    const minFundingThreshold = parseUnits('0.1').toString()

    expect(isMinFundingReached(weth, currentBidding, minFundingThreshold)).toBeTruthy()
  })

  it('should return false when current bidding is lower than min threshold', () => {
    const currentBidding = parseUnits('1').toString()
    const minFundingThreshold = parseUnits('10').toString()

    expect(isMinFundingReached(weth, currentBidding, minFundingThreshold)).toBeFalsy()
  })

  it('should return true when current bidding is equal to min threshold', () => {
    const currentBidding = parseUnits('10').toString()
    const minFundingThreshold = parseUnits('10').toString()

    expect(isMinFundingReached(weth, currentBidding, minFundingThreshold)).toBeTruthy()
  })
})
