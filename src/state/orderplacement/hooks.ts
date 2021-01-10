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
import { AppDispatch, AppState } from "../index";
import { useTokenBalances } from "../wallet/hooks";
import { encodeOrder, decodeOrder, Order } from "../../hooks/Order";
import {
  setDefaultsFromURLSearch,
  sellAmountInput,
  priceInput,
} from "./actions";
import { BigNumber } from "@ethersproject/bignumber";

export interface SellOrder {
  sellAmount: TokenAmount;
  buyAmount: TokenAmount;
}

export enum AuctionState {
  ORDER_PLACING_AND_CANCELING,
  ORDER_PLACING,
  PRICE_SUBMISSION,
  CLAIMING,
}

function decodeSellOrder(
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
      dispatch(sellAmountInput({ sellAmount }));
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
export function useDerivedAuctionInfo(): {
  biddingTokenBalance: TokenAmount | undefined;
  parsedBiddingAmount: TokenAmount | undefined;
  error?: string;
  auctioningToken?: Token | null;
  biddingToken?: Token | null;
  clearingPriceSellOrder?: SellOrder | null;
  clearingPriceOrder?: Order | null;
  clearingPrice: Fraction | undefined;
  initialAuctionOrder?: SellOrder | null;
  auctionEndDate?: number | null;
  auctionState: AuctionState | null;
  clearingPriceVolume: BigNumber | null;
} {
  const { chainId, account } = useActiveWeb3React();

  const { auctionId, sellAmount, price } = useSwapState();

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

  const initialAuctionOrder: SellOrder | null = decodeSellOrder(
    auctionInfo?.initialAuctionOrder,
    auctioningToken,
    biddingToken,
  );
  const clearingPriceSellOrder: SellOrder | null = decodeSellOrder(
    auctionInfo?.clearingPriceOrder,
    biddingToken,
    auctioningToken,
  );
  let clearingPriceOrder: Order | null = null;
  if (auctionInfo?.clearingPriceOrder) {
    clearingPriceOrder = decodeOrder(auctionInfo?.clearingPriceOrder);
  }
  const clearingPriceVolume = auctionInfo?.volumeClearingPriceOrder;
  const auctionEndDate = auctionInfo?.auctionEndDate;
  const orderCancellationEndDate = auctionInfo?.orderCancellationEndDate;
  const minBiddingAmountPerOrder = auctionInfo?.minimumBiddingAmountPerOrder;
  const relevantTokenBalances = useTokenBalances(account ?? undefined, [
    biddingToken,
  ]);
  const biddingTokenBalance =
    relevantTokenBalances?.[biddingToken?.address ?? ""];
  const parsedBiddingAmount = tryParseAmount(sellAmount, biddingToken);

  let clearingPrice: Fraction | undefined;
  if (
    !clearingPriceSellOrder ||
    clearingPriceSellOrder.buyAmount == undefined ||
    clearingPriceSellOrder.sellAmount == undefined
  ) {
    clearingPrice = undefined;
  } else {
    clearingPrice = new Fraction(
      clearingPriceSellOrder.sellAmount.raw.toString(),
      clearingPriceSellOrder.buyAmount.raw.toString(),
    );
  }

  let auctionState = AuctionState.CLAIMING;
  if (auctionEndDate > new Date().getTime() / 1000) {
    auctionState = AuctionState.ORDER_PLACING;
    if (orderCancellationEndDate >= new Date().getTime() / 1000) {
      auctionState = AuctionState.ORDER_PLACING_AND_CANCELING;
    }
  } else {
    if (clearingPrice?.toSignificant(1) == "0") {
      auctionState = AuctionState.PRICE_SUBMISSION;
    }
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
  let error: string | undefined;
  if (!account) {
    error = "Connect Wallet";
  }

  if (!sellAmount) {
    error = error ?? "Enter an amount";
  }
  if (
    minBiddingAmountPerOrder &&
    biddingToken &&
    sellAmount &&
    ((sellAmountScaled &&
      BigNumber.from(minBiddingAmountPerOrder).gte(sellAmountScaled)) ||
      parseFloat(sellAmount) == 0)
  ) {
    const errorMsg =
      "Amount must be bigger than " +
      new Fraction(
        minBiddingAmountPerOrder,
        BigNumber.from(10).pow(biddingToken.decimals).toString(),
      ).toSignificant(2);
    error = error ?? errorMsg;
  }

  if (!price) {
    error = error ?? "Enter a price";
  }
  if (auctioningToken == undefined || biddingToken == undefined) {
    error = "Please wait a sec";
  }
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
      error ??
      "Price must be higher than " +
        initialPrice
          ?.multiply(
            BigNumber.from(10)
              .pow(auctioningToken.decimals - biddingToken.decimals)
              .toString(),
          )
          .toSignificant(2);
  }

  const [balanceIn, amountIn] = [biddingTokenBalance, parsedBiddingAmount];
  if (balanceIn && amountIn && balanceIn.lessThan(amountIn)) {
    error = "Insufficient " + amountIn.token.symbol + " balance";
  }

  return {
    biddingTokenBalance,
    parsedBiddingAmount,
    error,
    auctioningToken,
    biddingToken,
    clearingPriceSellOrder,
    clearingPriceOrder,
    clearingPrice,
    initialAuctionOrder,
    auctionEndDate,
    auctionState,
    clearingPriceVolume,
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
  const clearingPriceSellOrder: SellOrder | null = decodeSellOrder(
    auctionInfo?.clearingPriceOrder,
    biddingToken,
    auctioningToken,
  );

  let error: string | undefined;
  if (clearingPriceSellOrder?.buyAmount.raw.toString() == "0") {
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
