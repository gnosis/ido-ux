import { Contract } from "@ethersproject/contracts";
import { parseUnits } from "@ethersproject/units";
import { useState } from "react";
import { ChainId } from "@uniswap/sdk";
import { JSBI, Token, TokenAmount, Trade } from "@uniswap/sdk";
import { useCallback, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";

import { EASY_AUCTION_NETWORKS } from "../../constants";
import { useContract } from "../../hooks/useContract";
import { useSingleCallResult } from "../multicall/hooks";
import easyAuctionABI from "../../constants/abis/easyAuction/easyAuction.json";

import { useActiveWeb3React } from "../../hooks";
import { useTokenByAddressAndAutomaticallyAdd } from "../../hooks/Tokens";
import { useTradeExactIn, useTradeExactOut } from "../../hooks/Trades";
import { AppDispatch, AppState } from "../index";
import { useTokenBalances } from "../wallet/hooks";
import {
  Field,
  setDefaultsFromURLSearch,
  SellAmountInput,
  priceInput,
} from "./actions";

export interface SellOrder {
  sellAmount: number;
  buyAmount: number;
}

function decodeOrder(orderBytes: string): SellOrder | null {
  return {
    buyAmount:
      parseInt(orderBytes?.substring(64 / 4 + 2, 64 / 4 + 96 / 4 + 2), 16) /
      10 ** 18,
    sellAmount:
      parseInt(
        orderBytes?.substring(64 / 4 + 96 / 4 - 2, 64 / 4 + 96 / 2 + 2),
        16,
      ) /
      10 ** 18,
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

// from the current swap inputs, compute the best trade and return it.
export function useDerivedSwapInfo(
  auctionId: number,
): {
  tokens: { [field in Field]?: Token };
  tokenBalances: { [field in Field]?: TokenAmount };
  parsedAmounts: { [field in Field]?: TokenAmount };
  error?: string;
  sellToken?: Token | null;
  buyToken?: Token | null;
  clearingPriceOrder?: SellOrder | null;
  initialAuctionOrder?: SellOrder | null;
  auctionEndDate?: number | null;
} {
  const { chainId, account } = useActiveWeb3React();

  const easyAuctionInstance: Contract | null = useContract(
    EASY_AUCTION_NETWORKS[chainId as ChainId],
    easyAuctionABI,
  );

  const auctionInfo = useSingleCallResult(easyAuctionInstance, "auctionData", [
    auctionId,
  ]).result;
  const sellTokenAddress:
    | string
    | undefined = auctionInfo?.sellToken.toString();
  const initialAuctionOrder: SellOrder | null = decodeOrder(
    auctionInfo?.initialAuctionOrder,
  );
  const clearingPriceOrder: SellOrder | null = decodeOrder(
    auctionInfo?.clearingPriceOrder,
  );
  const auctionEndDate = auctionInfo?.auctionEndDate;

  const buyTokenAddress: string | undefined = auctionInfo?.buyToken.toString();

  const sellToken = useTokenByAddressAndAutomaticallyAdd(sellTokenAddress);
  const buyToken = useTokenByAddressAndAutomaticallyAdd(buyTokenAddress);
  const {
    independentField,
    sellAmount,
    price,
    [Field.INPUT]: { address: tokenInAddress },
    [Field.OUTPUT]: { address: tokenOutAddress },
  } = useSwapState();

  const tokenIn = useTokenByAddressAndAutomaticallyAdd(tokenInAddress);
  const tokenOut = useTokenByAddressAndAutomaticallyAdd(tokenOutAddress);

  const relevantTokenBalances = useTokenBalances(account ?? undefined, [
    buyToken,
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
    sellToken,
    buyToken,
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
  sellToken?: Token | null;
  buyToken?: Token | null;
  claimSellToken?: TokenAmount | null;
  claimBuyToken?: TokenAmount | null;
} {
  const { chainId } = useActiveWeb3React();

  const easyAuctionInstance: Contract | null = useContract(
    EASY_AUCTION_NETWORKS[chainId as ChainId],
    easyAuctionABI,
  );

  const auctionInfo = useSingleCallResult(easyAuctionInstance, "auctionData", [
    auctionId,
  ]).result;
  const sellTokenAddress:
    | string
    | undefined = auctionInfo?.sellToken.toString();

  const auctionEndDate = auctionInfo?.auctionEndDate;
  const clearingPriceOrder: SellOrder | null = decodeOrder(
    auctionInfo?.clearingPriceOrder,
  );
  let error: string | undefined;
  if (clearingPriceOrder?.buyAmount == 0) {
    error = "Price not yet supplied to auction";
  }
  if (auctionEndDate >= new Date().getTime() / 1000) {
    error = "auction has not yet ended";
  }

  const buyTokenAddress: string | undefined = auctionInfo?.buyToken.toString();

  const sellToken = useTokenByAddressAndAutomaticallyAdd(sellTokenAddress);
  const buyToken = useTokenByAddressAndAutomaticallyAdd(buyTokenAddress);

  return {
    error,
    sellToken,
    buyToken,
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
export function useDataFromEventLogs(auctionId: number) {
  const { library } = useActiveWeb3React();
  const [formattedEvents, setFormattedEvents] = useState<any>();
  const { chainId } = useActiveWeb3React();
  let { account } = useActiveWeb3React();
  const easyAuctionInstance: Contract | null = useContract(
    EASY_AUCTION_NETWORKS[chainId as ChainId],
    easyAuctionABI,
  );
  if (account == null) {
    account = undefined;
  }
  // create filter for these specific events
  const userId = useSingleCallResult(easyAuctionInstance, "getUserId", [
    account,
  ]).result;

  useEffect(() => {
    async function fetchData() {
      const filter = {
        ...easyAuctionInstance?.filters?.["NewSellOrder"](
          auctionId,
          userId,
          null,
          null,
        ),
        fromBlock: 0,
        toBlock: "latest",
      };
      const pastEvents = await library?.getLogs(filter);
      // reverse events to get them from newest to odlest
      const formattedEventData = pastEvents
        ?.map((event) => {
          const eventParsed = easyAuctionInstance?.interface.parseLog(event);
          return {
            description: eventParsed?.topic,
            details: {
              sellAmount: eventParsed?.args[3],
              buyAmount: eventParsed?.args[2],
            },
          };
        })
        .reverse();
      setFormattedEvents(formattedEventData);
    }
    if (!formattedEvents) {
      fetchData();
    }
  }, [userId, auctionId, easyAuctionInstance, library, formattedEvents]);

  return formattedEvents;
}
