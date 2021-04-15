import { Token } from 'uniswap-xdai-sdk'

import { BigNumber } from '@ethersproject/bignumber'

import { STABLE_TOKEN_ADDRESSES } from '../constants/config'
import { tryParseAmount } from '../state/orderPlacement/hooks'

export function shouldPricesBeInverted(auctioningTokenAddress: string): boolean {
  return STABLE_TOKEN_ADDRESSES.includes(auctioningTokenAddress)
}

export function getInverse(price: number, digits: number): number {
  const re = new RegExp('(\\d+\\.\\d{' + digits + '})(\\d)'),
    m = (1 / price).toString().match(re)
  return m ? parseFloat(m[1]) : (1 / price).valueOf()
}

export function convertPriceIntoBuyAndSellAmount(
  auctioningToken: Token | undefined,
  biddingToken: Token | undefined,
  price: string,
  sellAmount: string,
): {
  sellAmountScaled: BigNumber | undefined
  buyAmountScaled: BigNumber | undefined
} {
  if (auctioningToken == undefined || biddingToken == undefined) {
    return {
      sellAmountScaled: undefined,
      buyAmountScaled: undefined,
    }
  }
  const sellAmountScaled = tryParseAmount(sellAmount, biddingToken)
  if (sellAmountScaled == undefined) {
    return { sellAmountScaled: undefined, buyAmountScaled: undefined }
  }
  const inversePriceAdjustedBybiddingToken = tryParseAmount(price, biddingToken)
  if (inversePriceAdjustedBybiddingToken == undefined) {
    return { sellAmountScaled: undefined, buyAmountScaled: undefined }
  }
  const buyAmountScaled = BigNumber.from(sellAmountScaled.raw.toString())
    .mul(BigNumber.from(10).pow(auctioningToken.decimals))
    .div(inversePriceAdjustedBybiddingToken.raw.toString())
  return {
    sellAmountScaled: BigNumber.from(sellAmountScaled.raw.toString()),
    buyAmountScaled,
  }
}
