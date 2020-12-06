import { BigNumber } from "@ethersproject/bignumber";
import { Contract } from "@ethersproject/contracts";
import { ChainId } from "@uniswap/sdk";
import { useMemo } from "react";
import { useTransactionAdder } from "../state/transactions/hooks";
import {
  useSwapState,
  useDataFromEventLogs,
} from "../state/orderplacement/hooks";
import { calculateGasMargin, getEasyAuctionContract } from "../utils";
import { useActiveWeb3React } from "./index";
import { encodeOrder } from "./Order";

export const queueStartElement =
  "0x0000000000000000000000000000000000000000000000000000000000000001";
export const queueLastElement =
  "0xffffffffffffffffffffffffffffffffffffffff000000000000000000000001";

// returns a function that will place an order, if the parameters are all valid
// and the user has approved the transfer of tokens
export function useClaimOrderCallback(): null | (() => Promise<string>) {
  const { account, chainId, library } = useActiveWeb3React();
  const addTransaction = useTransactionAdder();

  const { auctionId } = useSwapState();
  const sellOrderEventsForUser = useDataFromEventLogs(auctionId);
  return useMemo(() => {
    return async function onClaimOrder() {
      if (!chainId || !library || !account) {
        throw new Error("missing dependencies in onPlaceOrder callback");
      }
      const easyAuctionContract: Contract = getEasyAuctionContract(
        chainId as ChainId,
        library,
        account,
      );
      let estimate,
        method: Function,
        args: Array<string | string[] | number>,
        value: BigNumber | null;
      {
        estimate = easyAuctionContract.estimateGas.claimFromParticipantOrder;
        method = easyAuctionContract.claimFromParticipantOrder;
        args = [
          auctionId,
          sellOrderEventsForUser.map((sellOrderObject: any) =>
            encodeOrder(sellOrderObject.details),
          ),
          new Array(sellOrderEventsForUser.length).fill(queueStartElement),
        ];
        value = null;
      }

      return estimate(...args, value ? { value } : {})
        .then((estimatedGasLimit) =>
          method(...args, {
            ...(value ? { value } : {}),
            gasLimit: calculateGasMargin(estimatedGasLimit),
          }),
        )
        .then((response) => {
          addTransaction(response, {
            summary: "Claiming tokens",
          });

          return response.hash;
        })
        .catch((error) => {
          console.error(`Claiming or gas estimate failed`, error);
          throw error;
        });
    };
  }, [
    account,
    addTransaction,
    sellOrderEventsForUser,
    chainId,
    library,
    auctionId,
  ]);
}
