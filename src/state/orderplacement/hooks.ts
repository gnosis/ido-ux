import { Contract } from "@ethersproject/contracts";
import { parseUnits } from "@ethersproject/units";
import { useState } from "react";
import { ChainId, Fraction } from "@uniswap/sdk";
import { JSBI, Token, TokenAmount } from "@uniswap/sdk";
import { useCallback, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { convertPriceIntoBuyAndSellAmount } from "../../utils/prices";

import { EASY_AUCTION_NETWORKS } from "../../constants";
import { useContract } from "../../hooks/useContract";
import { useSingleCallResult } from "../multicall/hooks";
import easyAuctionABI from "../../constants/abis/easyAuction/easyAuction.json";

import { useActiveWeb3React } from "../../hooks";
import { useTokenByAddressAndAutomaticallyAdd } from "../../hooks/Tokens";
import { useTradeExactIn, useTradeExactOut } from "../../hooks/Trades";
import { AppDispatch, AppState } from "../index";
import { useTokenBalances } from "../wallet/hooks";
import { encodeOrder, Order } from "../../hooks/Order";
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

export function useDeriveSellAndBuyToken(
  auctionId: number,
): { sellToken: Token | undefined; buyToken: Token | undefined } {
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

  const buyTokenAddress: string | undefined = auctionInfo?.buyToken.toString();

  const sellToken = useTokenByAddressAndAutomaticallyAdd(sellTokenAddress);
  const buyToken = useTokenByAddressAndAutomaticallyAdd(buyTokenAddress);
  return {
    sellToken,
    buyToken,
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
  sellToken?: Token | null;
  buyToken?: Token | null;
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

  const { sellToken, buyToken } = useDeriveSellAndBuyToken(auctionId);

  const easyAuctionInstance: Contract | null = useContract(
    EASY_AUCTION_NETWORKS[chainId as ChainId],
    easyAuctionABI,
  );
  const auctionInfo = useSingleCallResult(easyAuctionInstance, "auctionData", [
    auctionId,
  ]).result;

  const initialAuctionOrder: SellOrder | null = decodeOrder(
    auctionInfo?.initialAuctionOrder,
    sellToken,
    buyToken,
  );
  const clearingPriceOrder: SellOrder | null = decodeOrder(
    auctionInfo?.clearingPriceOrder,
    buyToken,
    sellToken,
  );
  const auctionEndDate = auctionInfo?.auctionEndDate;
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
  if (sellToken == undefined || buyToken == undefined) {
    error = "Please wait a sec";
  }
  const {
    sellAmountScaled,
    buyAmountScaled,
  } = convertPriceIntoBuyAndSellAmount(sellToken, buyToken, price, sellAmount);
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
    buyAmountScaled &&
    sellAmountScaled
      ?.mul(initialAuctionOrder?.sellAmount.raw.toString())
      .lte(buyAmountScaled.mul(initialAuctionOrder?.buyAmount.raw.toString()))
  ) {
    error = "Price must be higher than " + initialPrice?.toSignificant(2);
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

  const buyTokenAddress: string | undefined = auctionInfo?.buyToken.toString();

  const sellToken = useTokenByAddressAndAutomaticallyAdd(sellTokenAddress);
  const buyToken = useTokenByAddressAndAutomaticallyAdd(buyTokenAddress);
  const clearingPriceOrder: SellOrder | null = decodeOrder(
    auctionInfo?.clearingPriceOrder,
    buyToken,
    sellToken,
  );

  let error: string | undefined;
  if (clearingPriceOrder?.buyAmount.raw.toString() == "0") {
    error = "Price not yet supplied to auction";
  }
  if (auctionEndDate >= new Date().getTime() / 1000) {
    error = "auction has not yet ended";
  }
  const sellOrderEventsForUser:
    | EventParsingOutput[]
    | undefined = useDataFromEventLogs(auctionId);
  if (sellOrderEventsForUser?.length == 0) {
    error = "No participation";
  }
  const claimed = useSingleCallResult(easyAuctionInstance, "containsOrder", [
    auctionId,
    encodeOrder(
      sellOrderEventsForUser == undefined ||
        sellOrderEventsForUser[0] == undefined
        ? {
            sellAmount: BigNumber.from(0),
            buyAmount: BigNumber.from(0),
            userId: BigNumber.from(0),
          }
        : sellOrderEventsForUser[0].details,
    ),
  ]).result;

  if (claimed) {
    error = "Proceedings already claimed";
  }

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

interface EventParsingOutput {
  description: string;
  details: Order;
}
export function useDataFromEventLogs(auctionId: number): EventParsingOutput[] {
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
          const order: Order = {
            userId: eventParsed?.args[1],
            sellAmount: eventParsed?.args[3],
            buyAmount: eventParsed?.args[2],
          };
          return {
            description: eventParsed?.topic,
            details: order,
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
