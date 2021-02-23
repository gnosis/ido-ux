import { useEffect, useState } from "react";
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
  chainId: String;
}

export function useAllAuctionInfo(): AuctionInfo[] | null {
  const [auctionInfo, setAllAuctions] = useState<AuctionInfo[] | null>(null);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    let cancelled = false;

    const fetchApiData = async (): Promise<void> => {
      try {
        if (!additionalServiceApi) {
          throw new Error("missing dependencies in useAllAuctionInfo callback");
        }
        const auctionInfo = await additionalServiceApi.getAllAuctionDetails();
        if (cancelled) return;
        setAllAuctions(auctionInfo);
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
  }, [setAllAuctions]);

  if (error) {
    console.error("error while fetching auction info", error);
    return null;
  }

  return auctionInfo;
}
