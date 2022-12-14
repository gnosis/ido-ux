import { parseUnits } from '@ethersproject/units'
import { ChainId, Token } from '@josojo/honeyswap-sdk'

import { isMinFundingReached } from './useClaimOrderCallback'

const weth = new Token(ChainId.GÖRLI, '0xb4fbf271143f4fbf7b91a5ded31805e42b2208d6', 18, 'WETH', '')

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
