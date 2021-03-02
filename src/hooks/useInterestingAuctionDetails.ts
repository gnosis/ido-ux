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

  useMemo(() => {
    setMostInterestingAuctions(null);
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
        setMostInterestingAuctions(null);
        console.error("Error getting clearing price info", error);

        if (cancelled) return;
      }
    };
    fetchApiData();

    return (): void => {
      cancelled = true;
    };
  }, [chainId, numberOfItems, setMostInterestingAuctions]);

  return auctionInfo;
}
