import { BigNumber } from "@ethersproject/bignumber";
import { Contract } from "@ethersproject/contracts";
import { ChainId, TokenAmount } from "@uniswap/sdk";
import { useMemo, useState } from "react";
import { useTransactionAdder } from "../state/transactions/hooks";
import {
  useDerivedAuctionInfo,
  useSwapState,
} from "../state/orderplacement/hooks";
import { calculateGasMargin, getEasyAuctionContract } from "../utils";
import { useActiveWeb3React } from "./index";
import { decodeOrder } from "./Order";
import { additionalServiceApi } from "./../api";

export const queueStartElement =
  "0x0000000000000000000000000000000000000000000000000000000000000001";
export const queueLastElement =
  "0xffffffffffffffffffffffffffffffffffffffff000000000000000000000001";

export interface AuctionProceedings {
  claimableBiddingToken: TokenAmount | null;
  claimableAuctioningToken: TokenAmount | null;
}

export interface ClaimInformation {
  sellOrdersFormUser: string[];
}
export function useGetClaimInfo(): ClaimInformation | null {
  const { account, chainId, library } = useActiveWeb3React();
  const [claimInfo, setClaimInfo] = useState<ClaimInformation | null>(null);
  const [error, setError] = useState<Error | null>(null);
  const { auctionId } = useSwapState();

  useMemo(() => {
    setClaimInfo(null);
    setError(null);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [auctionId, chainId]);
  useMemo(() => {
    let cancelled = false;

    const fetchApiData = async (): Promise<void> => {
      try {
        if (!chainId || !library || !account || !additionalServiceApi) {
          throw new Error("missing dependencies in useGetClaimInfo callback");
        }
        const sellOrdersFormUser = await additionalServiceApi.getUserOrders({
          networkId: chainId,
          auctionId,
          user: account,
        });
        setClaimInfo({ sellOrdersFormUser });
      } catch (error) {
        if (cancelled) return;
        console.error("Error getting withdraw info", error);
        setError(error);
      }
    };
    fetchApiData();

    return (): void => {
      cancelled = true;
    };
  }, [account, chainId, library, auctionId, setClaimInfo]);

  if (error) {
    console.error("error while fetching claimInfo", error);
    return null;
  }

  return claimInfo;
}
export function useGetAuctionProceeds(): AuctionProceedings {
  const claimInfo = useGetClaimInfo();
  const {
    biddingToken,
    auctioningToken,
    clearingPriceOrder,
    clearingPriceSellOrder,
    clearingPriceVolume,
  } = useDerivedAuctionInfo();

  if (
    !claimInfo ||
    !biddingToken ||
    !auctioningToken ||
    !clearingPriceSellOrder ||
    !clearingPriceOrder ||
    !clearingPriceVolume
  ) {
    return {
      claimableBiddingToken: null,
      claimableAuctioningToken: null,
    };
  }
  let claimableAuctioningToken = new TokenAmount(auctioningToken, "0");
  let claimableBiddingToken = new TokenAmount(biddingToken, "0");
  for (const order of claimInfo.sellOrdersFormUser) {
    const decodedOrder = decodeOrder(order);
    if (decodedOrder == clearingPriceOrder) {
      claimableBiddingToken = claimableBiddingToken.add(
        new TokenAmount(
          biddingToken,
          decodedOrder.sellAmount.sub(clearingPriceVolume).toString(),
        ),
      );
      claimableAuctioningToken = claimableAuctioningToken.add(
        new TokenAmount(
          auctioningToken,
          clearingPriceVolume
            .mul(clearingPriceOrder.buyAmount)
            .div(clearingPriceOrder.sellAmount)
            .toString(),
        ),
      );
    } else if (
      clearingPriceOrder.buyAmount
        .mul(decodedOrder.sellAmount)
        .lt(decodedOrder.buyAmount.mul(clearingPriceOrder.sellAmount))
    ) {
      claimableBiddingToken = claimableBiddingToken.add(
        new TokenAmount(biddingToken, decodedOrder.sellAmount.toString()),
      );
    } else {
      if (clearingPriceOrder.sellAmount.gt(BigNumber.from("0"))) {
        claimableAuctioningToken = claimableAuctioningToken.add(
          new TokenAmount(
            auctioningToken,
            decodedOrder.sellAmount
              .mul(clearingPriceOrder.buyAmount)
              .div(clearingPriceOrder.sellAmount)
              .toString(),
          ),
        );
      }
    }
  }
  return {
    claimableBiddingToken,
    claimableAuctioningToken,
  };
}

export function useClaimOrderCallback(): null | (() => Promise<string>) {
  const { account, chainId, library } = useActiveWeb3React();
  const addTransaction = useTransactionAdder();

  const { auctionId } = useSwapState();
  const claimInfo = useGetClaimInfo();

  return useMemo(() => {
    return async function onClaimOrder() {
      if (!chainId || !library || !account || !claimInfo) {
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
        args = [auctionId, claimInfo?.sellOrdersFormUser];
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
  }, [account, addTransaction, chainId, library, auctionId, claimInfo]);
}
