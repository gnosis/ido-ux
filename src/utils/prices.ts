import { BigNumber } from "@ethersproject/bignumber";
import { tryParseAmount } from "../state/orderplacement/hooks";

import { Token } from "@uniswap/sdk";

export function convertPriceIntoBuyAndSellAmount(
  auctioningToken: Token | undefined,
  biddingToken: Token | undefined,
  price: string,
  sellAmount: string,
): {
  sellAmountScaled: BigNumber | undefined;
  buyAmountScaled: BigNumber | undefined;
} {
  if (auctioningToken == undefined || biddingToken == undefined) {
    return {
      sellAmountScaled: undefined,
      buyAmountScaled: undefined,
    };
  }
  const sellAmountScaled = tryParseAmount(sellAmount, biddingToken);
  if (sellAmountScaled == undefined) {
    return { sellAmountScaled: undefined, buyAmountScaled: undefined };
  }
  const inversePriceAdjustedBybiddingToken = tryParseAmount(
    price,
    biddingToken,
  );
  if (inversePriceAdjustedBybiddingToken == undefined) {
    return { sellAmountScaled: undefined, buyAmountScaled: undefined };
  }
  const buyAmountScaled = BigNumber.from(sellAmountScaled.raw.toString())
    .mul(BigNumber.from(10).pow(auctioningToken.decimals))
    .div(inversePriceAdjustedBybiddingToken.raw.toString());
  return {
    sellAmountScaled: BigNumber.from(sellAmountScaled.raw.toString()),
    buyAmountScaled,
  };
}
