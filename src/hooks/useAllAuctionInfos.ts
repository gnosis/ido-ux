import { useEffect, useMemo, useState } from "react";
import { additionalServiceApi } from "../api";
import { PricePoint } from "../api/AdditionalServicesApi";

export interface AuctionInfo {
  auctionId: number;
  order: PricePoint;
  symbolAuctioningToken: string;
  symbolBiddingToken: string;
  addressAuctioningToken: string;
  addressBiddingToken: string;
  decimalsAuctioningToken: number;
  decimalsBiddingToken: number;
  endTimeTimestamp: number;
}

export function useAllAuctionInfo(
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
        const auctionInfo = await additionalServiceApi.getAllAuctionDetails({
          networkId: chainId,
          numberOfAuctions: numberOfItems,
        });
        if (cancelled) return;
        setMostInterestingAuctions(auctionInfo);
      } catch (error) {
        setMostInterestingAuctions([]);
        setError(error);
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
