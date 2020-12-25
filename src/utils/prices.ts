import { BigNumber } from "@ethersproject/bignumber";
import { tryParseAmount } from "../state/orderplacement/hooks";

import {
  Fraction,
  JSBI,
  Percent,
  Token,
  TokenAmount,
  Trade,
} from "@uniswap/sdk";
import {
  ALLOWED_PRICE_IMPACT_HIGH,
  ALLOWED_PRICE_IMPACT_LOW,
  ALLOWED_PRICE_IMPACT_MEDIUM,
} from "../constants";
import { Field } from "../state/orderplacement/actions";
import { basisPointsToPercent } from "./index";

const BASE_FEE = new Percent(JSBI.BigInt(30), JSBI.BigInt(10000));
const ONE_HUNDRED_PERCENT = new Percent(JSBI.BigInt(10000), JSBI.BigInt(10000));
const INPUT_FRACTION_AFTER_FEE = ONE_HUNDRED_PERCENT.subtract(BASE_FEE);

// computes price breakdown for the trade
export function computeTradePriceBreakdown(
  trade?: Trade,
): { priceImpactWithoutFee?: Percent; realizedLPFee?: TokenAmount } {
  // for each hop in our trade, take away the x*y=k price impact from 0.3% fees
  // e.g. for 3 tokens/2 hops: 1 - ((1 - .03) * (1-.03))
  const realizedLPFee = !trade
    ? undefined
    : ONE_HUNDRED_PERCENT.subtract(
        trade.route.pairs.reduce<Fraction>(
          (currentFee: Fraction): Fraction =>
            currentFee.multiply(INPUT_FRACTION_AFTER_FEE),
          INPUT_FRACTION_AFTER_FEE,
        ),
      );

  // remove lp fees from price impact
  const priceImpactWithoutFeeFraction =
    trade && realizedLPFee ? trade.slippage.subtract(realizedLPFee) : undefined;

  // the x*y=k impact
  const priceImpactWithoutFeePercent = priceImpactWithoutFeeFraction
    ? new Percent(
        priceImpactWithoutFeeFraction?.numerator,
        priceImpactWithoutFeeFraction?.denominator,
      )
    : undefined;

  // the amount of the input that accrues to LPs
  const realizedLPFeeAmount =
    realizedLPFee &&
    trade &&
    new TokenAmount(
      trade.inputAmount.token,
      realizedLPFee.multiply(trade.inputAmount.raw).quotient,
    );

  return {
    priceImpactWithoutFee: priceImpactWithoutFeePercent,
    realizedLPFee: realizedLPFeeAmount,
  };
}

// computes the minimum amount out and maximum amount in for a trade given a user specified allowed slippage in bips
export function computeSlippageAdjustedAmounts(
  trade: Trade,
  allowedSlippage: number,
): { [field in Field]?: TokenAmount } {
  const pct = basisPointsToPercent(allowedSlippage);
  return {
    [Field.INPUT]: trade?.maximumAmountIn(pct),
    [Field.OUTPUT]: trade?.minimumAmountOut(pct),
  };
}

export function warningSeverity(priceImpact: Percent): 0 | 1 | 2 | 3 {
  if (!priceImpact?.lessThan(ALLOWED_PRICE_IMPACT_HIGH)) return 3;
  if (!priceImpact?.lessThan(ALLOWED_PRICE_IMPACT_MEDIUM)) return 2;
  if (!priceImpact?.lessThan(ALLOWED_PRICE_IMPACT_LOW)) return 1;
  return 0;
}

export function formatExecutionPrice(
  trade?: Trade,
  inverted?: boolean,
): string {
  if (!trade) {
    return "";
  }
  return inverted
    ? `${trade.executionPrice.invert().toSignificant(6)} ${
        trade.inputAmount.token.symbol
      } / ${trade.outputAmount.token.symbol}`
    : `${trade.executionPrice.toSignificant(6)} ${
        trade.outputAmount.token.symbol
      } / ${trade.inputAmount.token.symbol}`;
}

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
