import { useEffect, useMemo, useState } from "react";
import { useSwapState } from "../state/orderPlacement/hooks";
import { useActiveWeb3React } from "./index";
import { additionalServiceApi } from "./../api";
import { ClearingPriceAndVolumeData } from "../api/AdditionalServicesApi";

export function useClearingPriceInfo(): ClearingPriceAndVolumeData | null {
  const { account, chainId, library } = useActiveWeb3React();
  const [
    clearingInfo,
    setClearingPriceAndVolume,
  ] = useState<ClearingPriceAndVolumeData | null>(null);
  const [error, setError] = useState<Error | null>(null);
  const { auctionId } = useSwapState();

  useMemo(() => {
    setClearingPriceAndVolume(null);
    setError(null);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [auctionId, chainId]);
  useEffect(() => {
    let cancelled = false;

    const fetchApiData = async (): Promise<void> => {
      try {
        if (!chainId || !library || !account || !additionalServiceApi) {
          throw new Error(
            "missing dependencies in useClearingPriceInfo callback",
          );
        }
        const clearingOrderAndVolume = await additionalServiceApi.getClearingPriceOrderAndVolume(
          {
            networkId: chainId,
            auctionId,
          },
        );
        if (cancelled) return;
        setClearingPriceAndVolume(clearingOrderAndVolume);
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
  }, [account, chainId, library, auctionId, setClearingPriceAndVolume]);

  if (error) {
    console.error("error while fetching price info", error);
    return null;
  }

  return clearingInfo;
}
