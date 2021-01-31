import { BigNumber } from "@ethersproject/bignumber";
import { Contract } from "@ethersproject/contracts";
import { ChainId, Token } from "@uniswap/sdk";
import { useMemo } from "react";
import { convertPriceIntoBuyAndSellAmount } from "../utils/prices";
import { useTransactionAdder } from "../state/transactions/hooks";
import { useSwapState } from "../state/orderPlacement/hooks";
import { useActiveWeb3React } from "./index";
import { calculateGasMargin, getEasyAuctionContract } from "../utils";
import { additionalServiceApi } from "./../api";
import { useOrderActionHandlers } from "../state/orders/hooks";
import { encodeOrder } from "./Order";
import { OrderStatus } from "../state/orders/reducer";
import { getTokenDisplay } from "../utils";
import { useContract } from "./useContract";
import { EASY_AUCTION_NETWORKS } from "../constants";
import { Result, useSingleCallResult } from "../state/multicall/hooks";
import easyAuctionABI from "../constants/abis/easyAuction/easyAuction.json";

export const queueStartElement =
  "0x0000000000000000000000000000000000000000000000000000000000000001";
export const queueLastElement =
  "0xffffffffffffffffffffffffffffffffffffffff000000000000000000000001";

// returns a function that will place an order, if the parameters are all valid
// and the user has approved the transfer of tokens
export function usePlaceOrderCallback(
  auctioningToken: Token,
  biddingToken: Token,
): null | (() => Promise<string>) {
  const { account, chainId, library } = useActiveWeb3React();
  const addTransaction = useTransactionAdder();
  const { onNewOrder } = useOrderActionHandlers();
  const { auctionId, sellAmount, price } = useSwapState();
  const easyAuctionInstance: Contract | null = useContract(
    EASY_AUCTION_NETWORKS[chainId as ChainId],
    easyAuctionABI,
  );
  const userId: Result | undefined = useSingleCallResult(
    easyAuctionInstance,
    "getUserId",
    [account == null ? undefined : account],
  ).result;
  return useMemo(() => {
    return async function onPlaceOrder() {
      if (!chainId || !library || !account) {
        throw new Error("missing dependencies in onPlaceOrder callback");
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
      if (sellAmountScaled == undefined || buyAmountScaled == undefined) {
        return "price was not correct";
      }
      const easyAuctionContract: Contract = getEasyAuctionContract(
        chainId as ChainId,
        library,
        account,
      );
      const previousOrder = await additionalServiceApi.getPreviousOrder({
        networkId: chainId,
        auctionId,
        order: {
          buyAmount: buyAmountScaled,
          sellAmount: sellAmountScaled,
          userId: BigNumber.from(0), // Todo: This could be optimized
        },
      });
      let estimate,
        method: Function,
        args: Array<string | string[] | number>,
        value: BigNumber | null;
      {
        estimate = easyAuctionContract.estimateGas.placeSellOrders;
        method = easyAuctionContract.placeSellOrders;
        args = [
          auctionId,
          [buyAmountScaled.toString()],
          [sellAmountScaled.toString()],
          [previousOrder],
        ];
        value = null;
      }

      const biddingTokenDisplay = getTokenDisplay(biddingToken);
      const auctioningTokenDisplay = getTokenDisplay(auctioningToken);

      return estimate(...args, value ? { value } : {})
        .then((estimatedGasLimit) =>
          method(...args, {
            ...(value ? { value } : {}),
            gasLimit: calculateGasMargin(estimatedGasLimit),
          }),
        )
        .then((response) => {
          addTransaction(response, {
            summary:
              "Sell " +
              sellAmount +
              " " +
              biddingTokenDisplay +
              " for " +
              (parseFloat(sellAmount) / parseFloat(price)).toPrecision(4) +
              " " +
              auctioningTokenDisplay,
          });
          const order = {
            buyAmount: buyAmountScaled,
            sellAmount: sellAmountScaled,
            userId: BigNumber.from(userId), // Todo: If many people are placing orders, this might be incorrect
          };
          onNewOrder([
            {
              id: encodeOrder(order),
              sellAmount: parseFloat(sellAmount).toString(),
              price: price.toString(),
              status: OrderStatus.PENDING,
            },
          ]);

          return response.hash;
        })
        .catch((error) => {
          console.error(`Swap or gas estimate failed`, error);
          throw error;
        });
    };
  }, [
    account,
    userId,
    addTransaction,
    chainId,
    library,
    auctionId,
    biddingToken,
    price,
    auctioningToken,
    sellAmount,
    onNewOrder,
  ]);
}
