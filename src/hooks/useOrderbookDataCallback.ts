import { useEffect, useMemo, useState } from "react";
import { useActiveWeb3React } from ".";
import { additionalServiceApi } from "../api";
import {
  useDeriveAuctioningAndBiddingToken,
  useSwapState,
} from "../state/orderPlacement/hooks";
import { PricePointDetails } from "../components/OrderbookChart";
import { processRawApiData } from "../components/OrderbookWidget";

export function useOrderbookDataCallback(): {
  error?: Error;
  orderbookData?: PricePointDetails[] | null;
} {
  const { chainId } = useActiveWeb3React();
  const { auctionId } = useSwapState();
  const { biddingToken, auctioningToken } = useDeriveAuctioningAndBiddingToken(
    auctionId,
  );
  const [apiData, setApiData] = useState<PricePointDetails[] | null>(null);
  const [error, setError] = useState<Error | null>(null);

  // sync resetting ApiData to avoid old data on new labels flash
  // and layout changes
  useMemo(() => {
    setApiData(null);
    setError(null);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [auctioningToken, biddingToken, chainId]);

  useEffect(() => {
    // handle stale fetches resolving out of order
    let cancelled = false;

    const fetchApiData = async (): Promise<void> => {
      if (!chainId || !auctioningToken || !biddingToken) return;
      try {
        const rawData = await additionalServiceApi.getOrderBookData({
          networkId: chainId,
          auctionId,
        });

        if (cancelled) return;

        const processedData = processRawApiData({
          data: rawData,
          baseToken: auctioningToken,
          quoteToken: biddingToken,
        });

        setApiData(processedData);
      } catch (error) {
        if (cancelled) return;
        console.error("Error populating orderbook with data", error);
        setError(error);
      }
    };

    fetchApiData();

    return (): void => {
      cancelled = true;
    };
  }, [biddingToken, auctioningToken, chainId, auctionId, setApiData, setError]);

  if (error) return { error, orderbookData: undefined };

  return {
    error: undefined,
    orderbookData: apiData,
  };
}
