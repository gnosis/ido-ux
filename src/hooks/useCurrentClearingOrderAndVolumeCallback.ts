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
  const { auctionId } = useSwapState();

  useMemo(() => {
    setClearingPriceAndVolume(null);
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
        setClearingPriceAndVolume(null);
        console.error("Error getting clearing price info", error);

        if (cancelled) return;
      }
    };
    fetchApiData();

    return (): void => {
      cancelled = true;
    };
  }, [account, chainId, library, auctionId, setClearingPriceAndVolume]);

  return clearingInfo;
}
