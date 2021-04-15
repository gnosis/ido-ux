import { Token } from 'uniswap-xdai-sdk'

import { BigNumber } from '@ethersproject/bignumber'

import { tryParseAmount } from '../state/orderPlacement/hooks'

export function getInverse(price: number, nrDigits: number): number {
  // if 1/price has more than `nrDigits`, we make a cut off and only take the first `nrDigits`
  const re = new RegExp('(\\d+\\.\\d{' + nrDigits + '})(\\d)'),
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
