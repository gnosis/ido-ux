import { useEffect, useMemo, useState } from "react";
import { additionalServiceApi } from "./../api";
import { AuctionInfo } from "./useAllAuctionInfos";

export function useInterestingAuctionInfo(
  numberOfItems: number,
  chainId: number,
): AuctionInfo[] | null {
  const [auctionInfo, setMostInterestingAuctions] = useState<
    AuctionInfo[] | null
  >(null);
  const [error, setError] = useState<Error | null>(null);

  useMemo(() => {
    setMostInterestingAuctions(null);
    setError(null);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [chainId]);
  useEffect(() => {
    let cancelled = false;

    const fetchApiData = async (): Promise<void> => {
      try {
        if (!chainId || !additionalServiceApi) {
          throw new Error(
            "missing dependencies in useInterestingAuctionInfo callback",
          );
        }
        const auctionInfo = await additionalServiceApi.getMostInterestingAuctionDetails(
          {
            networkId: chainId,
            numberOfAuctions: numberOfItems,
          },
        );
        if (cancelled) return;
        setMostInterestingAuctions(auctionInfo);
      } catch (error) {
        if (cancelled) return;
        console.error("Error getting clearing price info", error);
        setError(error);
      }
    };
    fetchApiData();

    return (): void => {
      cancelled = true;
    };
  }, [chainId, numberOfItems, setMostInterestingAuctions]);

  if (error) {
    console.error("error while fetching price info", error);
    return null;
  }

  return auctionInfo;
}
