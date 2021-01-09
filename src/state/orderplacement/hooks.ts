import { Contract } from "@ethersproject/contracts";
import { parseUnits } from "@ethersproject/units";
import { useState } from "react";
import { ChainId, Fraction } from "@uniswap/sdk";
import { JSBI, Token, TokenAmount } from "@uniswap/sdk";
import { useCallback, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { convertPriceIntoBuyAndSellAmount } from "../../utils/prices";
import { additionalServiceApi } from "../../api";

import { EASY_AUCTION_NETWORKS } from "../../constants";
import { useContract } from "../../hooks/useContract";
import { useSingleCallResult } from "../multicall/hooks";
import easyAuctionABI from "../../constants/abis/easyAuction/easyAuction.json";
import { useGetClaimInfo } from "../../hooks/useClaimOrderCallback";
import { useActiveWeb3React } from "../../hooks";
import { useTokenByAddressAndAutomaticallyAdd } from "../../hooks/Tokens";
import { useTradeExactIn, useTradeExactOut } from "../../hooks/Trades";
import { AppDispatch, AppState } from "../index";
import { useTokenBalances } from "../wallet/hooks";
import { encodeOrder } from "../../hooks/Order";
import {
  Field,
  setDefaultsFromURLSearch,
  SellAmountInput,
  priceInput,
} from "./actions";
import { BigNumber } from "@ethersproject/bignumber";

export interface SellOrder {
  sellAmount: TokenAmount;
  buyAmount: TokenAmount;
}

function decodeOrder(
  orderBytes: string,
  soldToken: Token | undefined,
  boughtToken: Token | undefined,
): SellOrder | null {
  if (soldToken == undefined || boughtToken == undefined) {
    return null;
  }
  const sellAmount = new Fraction(
    BigNumber.from("0x" + orderBytes.substring(43, 66)).toString(),
    "1",
  );
  const buyAmount = new Fraction(
    BigNumber.from("0x" + orderBytes.substring(19, 42)).toString(),
    "1",
  );
  return {
    sellAmount: new TokenAmount(soldToken, sellAmount.toSignificant(6)),
    buyAmount: new TokenAmount(boughtToken, buyAmount.toSignificant(6)),
  };
}

export function useSwapState(): AppState["swap"] {
  return useSelector<AppState, AppState["swap"]>((state) => state.swap);
}

export function useSwapActionHandlers(): {
  onUserSellAmountInput: (sellAmount: string) => void;
  onUserPriceInput: (price: string) => void;
} {
  const dispatch = useDispatch<AppDispatch>();

  const onUserSellAmountInput = useCallback(
    (sellAmount: string) => {
      dispatch(SellAmountInput({ sellAmount }));
    },
    [dispatch],
  );
  const onUserPriceInput = useCallback(
    (price: string) => {
      dispatch(priceInput({ price }));
    },
    [dispatch],
  );

  return { onUserPriceInput, onUserSellAmountInput };
}

// try to parse a user entered amount for a given token
export function tryParseAmount(
  value?: string,
  token?: Token,
): TokenAmount | undefined {
  if (!value || !token) {
    return;
  }
  try {
    const sellAmountParsed = parseUnits(value, token.decimals).toString();
    if (sellAmountParsed !== "0") {
      return new TokenAmount(token, JSBI.BigInt(sellAmountParsed));
    }
  } catch (error) {
    // should fail if the user specifies too many decimal places of precision (or maybe exceed max uint?)
    console.debug(`Failed to parse input amount: "${value}"`, error);
  }
  // necessary for all paths to return a value
  return;
}

export function useDeriveAuctioningAndBiddingToken(
  auctionId: number,
): { auctioningToken: Token | undefined; biddingToken: Token | undefined } {
  const { chainId } = useActiveWeb3React();

  const easyAuctionInstance: Contract | null = useContract(
    EASY_AUCTION_NETWORKS[chainId as ChainId],
    easyAuctionABI,
  );
  const auctionInfo = useSingleCallResult(easyAuctionInstance, "auctionData", [
    auctionId,
  ]).result;
  const auctioningTokenAddress:
    | string
    | undefined = auctionInfo?.auctioningToken.toString();

  const biddingTokenAddress:
    | string
    | undefined = auctionInfo?.biddingToken.toString();

  const auctioningToken = useTokenByAddressAndAutomaticallyAdd(
    auctioningTokenAddress,
  );
  const biddingToken = useTokenByAddressAndAutomaticallyAdd(
    biddingTokenAddress,
  );
  return {
    auctioningToken,
    biddingToken,
  };
}

// from the current swap inputs, compute the best trade and return it.
export function useDerivedSwapInfo(
  auctionId: number,
): {
  tokens: { [field in Field]?: Token };
  tokenBalances: { [field in Field]?: TokenAmount };
  parsedAmounts: { [field in Field]?: TokenAmount };
  error?: string;
  auctioningToken?: Token | null;
  biddingToken?: Token | null;
  clearingPriceOrder?: SellOrder | null;
  initialAuctionOrder?: SellOrder | null;
  auctionEndDate?: number | null;
} {
  const { chainId, account } = useActiveWeb3React();

  const {
    independentField,
    sellAmount,
    price,
    [Field.INPUT]: { address: tokenInAddress },
    [Field.OUTPUT]: { address: tokenOutAddress },
  } = useSwapState();

  const tokenIn = useTokenByAddressAndAutomaticallyAdd(tokenInAddress);
  const tokenOut = useTokenByAddressAndAutomaticallyAdd(tokenOutAddress);

  const { auctioningToken, biddingToken } = useDeriveAuctioningAndBiddingToken(
    auctionId,
  );

  const easyAuctionInstance: Contract | null = useContract(
    EASY_AUCTION_NETWORKS[chainId as ChainId],
    easyAuctionABI,
  );
  const auctionInfo = useSingleCallResult(easyAuctionInstance, "auctionData", [
    auctionId,
  ]).result;

  const initialAuctionOrder: SellOrder | null = decodeOrder(
    auctionInfo?.initialAuctionOrder,
    auctioningToken,
    biddingToken,
  );
  const clearingPriceOrder: SellOrder | null = decodeOrder(
    auctionInfo?.clearingPriceOrder,
    biddingToken,
    auctioningToken,
  );
  const auctionEndDate = auctionInfo?.auctionEndDate;
  const relevantTokenBalances = useTokenBalances(account ?? undefined, [
    biddingToken,
    tokenOut,
  ]);

  const isExactIn: boolean = independentField === Field.INPUT;
  const amount = tryParseAmount(sellAmount, isExactIn ? tokenIn : tokenOut);

  const bestTradeExactIn = useTradeExactIn(
    isExactIn ? amount : undefined,
    tokenOut,
  );
  const bestTradeExactOut = useTradeExactOut(
    tokenIn,
    !isExactIn ? amount : undefined,
  );

  const bestTrade = isExactIn ? bestTradeExactIn : bestTradeExactOut;

  const parsedAmounts = {
    [Field.INPUT]: isExactIn ? amount : bestTrade?.inputAmount,
    [Field.OUTPUT]: isExactIn ? bestTrade?.outputAmount : amount,
  };

  const tokenBalances = {
    [Field.INPUT]: relevantTokenBalances?.[tokenIn?.address ?? ""],
    [Field.OUTPUT]: relevantTokenBalances?.[tokenOut?.address ?? ""],
  };

  const tokens: { [field in Field]?: Token } = {
    [Field.INPUT]: tokenIn,
    [Field.OUTPUT]: tokenOut,
  };

  let error: string | undefined;
  if (!account) {
    error = "Connect Wallet";
  }

  if (!sellAmount) {
    error = error ?? "Enter an amount";
  }

  if (!price) {
    error = error ?? "Enter a price";
  }
  if (auctioningToken == undefined || biddingToken == undefined) {
    error = "Please wait a sec";
  }
  const {
    sellAmountScaled,
    buyAmountScaled,
  } = convertPriceIntoBuyAndSellAmount(
    auctioningToken,
    biddingToken,
    price,
    sellAmount,
  );
  let initialPrice: Fraction | undefined;
  if (initialAuctionOrder?.buyAmount == undefined) {
    initialPrice = undefined;
  } else {
    initialPrice = new Fraction(
      initialAuctionOrder?.buyAmount?.raw.toString(),
      initialAuctionOrder?.sellAmount?.raw.toString(),
    );
  }
  if (
    initialAuctionOrder != null &&
    auctioningToken != undefined &&
    biddingToken != undefined &&
    buyAmountScaled &&
    sellAmountScaled
      ?.mul(initialAuctionOrder?.sellAmount.raw.toString())
      .lte(buyAmountScaled.mul(initialAuctionOrder?.buyAmount.raw.toString()))
  ) {
    error =
      "Price must be higher than " +
      initialPrice
        ?.multiply(
          BigNumber.from(10)
            .pow(auctioningToken.decimals - biddingToken.decimals)
            .toString(),
        )
        .toSignificant(2);
  }

  const [balanceIn, amountIn] = [
    tokenBalances[Field.INPUT],
    parsedAmounts[Field.INPUT],
  ];
  if (balanceIn && amountIn && balanceIn.lessThan(amountIn)) {
    error = "Insufficient " + amountIn.token.symbol + " balance";
  }

  return {
    tokens,
    tokenBalances,
    parsedAmounts,
    error,
    auctioningToken,
    biddingToken,
    clearingPriceOrder,
    initialAuctionOrder,
    auctionEndDate,
  };
}

// from the current swap inputs, compute the best trade and return it.
export function useDerivedClaimInfo(
  auctionId: number,
): {
  error?: string;
  auctioningToken?: Token | null;
  biddingToken?: Token | null;
  claimauctioningToken?: TokenAmount | null;
  claimbiddingToken?: TokenAmount | null;
} {
  const { chainId } = useActiveWeb3React();

  const easyAuctionInstance: Contract | null = useContract(
    EASY_AUCTION_NETWORKS[chainId as ChainId],
    easyAuctionABI,
  );

  const auctionInfo = useSingleCallResult(easyAuctionInstance, "auctionData", [
    auctionId,
  ]).result;
  const auctioningTokenAddress:
    | string
    | undefined = auctionInfo?.auctioningToken.toString();

  const auctionEndDate = auctionInfo?.auctionEndDate;

  const biddingTokenAddress:
    | string
    | undefined = auctionInfo?.biddingToken.toString();

  const auctioningToken = useTokenByAddressAndAutomaticallyAdd(
    auctioningTokenAddress,
  );
  const biddingToken = useTokenByAddressAndAutomaticallyAdd(
    biddingTokenAddress,
  );
  const clearingPriceOrder: SellOrder | null = decodeOrder(
    auctionInfo?.clearingPriceOrder,
    biddingToken,
    auctioningToken,
  );

  let error: string | undefined;
  if (clearingPriceOrder?.buyAmount.raw.toString() == "0") {
    error = "Price not yet supplied to auction";
  }
  if (auctionEndDate >= new Date().getTime() / 1000) {
    error = "auction has not yet ended";
  }
  const claimableOrders = useGetClaimInfo()?.sellOrdersFormUser;
  const claimed = useSingleCallResult(easyAuctionInstance, "containsOrder", [
    auctionId,
    claimableOrders == undefined || claimableOrders[0] == undefined
      ? encodeOrder({
          sellAmount: BigNumber.from(0),
          buyAmount: BigNumber.from(0),
          userId: BigNumber.from(0),
        })
      : claimableOrders[0],
  ]).result;
  if (claimableOrders == undefined || claimableOrders?.length > 0) {
    if (claimed == undefined || !claimed[0]) {
      error = "Proceedings already claimed";
    }
  }

  if (claimableOrders?.length == 0) {
    error = "No participation";
  }

  return {
    error,
    auctioningToken,
    biddingToken,
  };
}

// updates the swap state to use the defaults for a given network whenever the query
// string updates
export function useDefaultsFromURLSearch(search?: string) {
  const { chainId } = useActiveWeb3React();
  const dispatch = useDispatch<AppDispatch>();
  useEffect(() => {
    if (!chainId) return;
    dispatch(setDefaultsFromURLSearch({ chainId, queryString: search }));
  }, [dispatch, search, chainId]);
}

export function useOrdersForClaiming(auctionId: number): string[] {
  const { account, chainId } = useActiveWeb3React();
  const [userOrders, setUserOrders] = useState<any>();

  useEffect(() => {
    async function fetchData() {
      if (chainId == undefined || account == undefined) {
        return;
      }
      const sellOrdersFormUser = await additionalServiceApi.getUserOrders({
        networkId: chainId,
        auctionId,
        user: account,
      });
      setUserOrders(sellOrdersFormUser);
    }
    if (!userOrders) {
      fetchData();
    }
  }, [chainId, account, auctionId, userOrders]);

  return userOrders;
}
