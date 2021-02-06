import { useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, AppState } from "..";
import {
  appendBid,
  removeBid,
  resetUserPrice,
  resetUserVolume,
  resetOrderbookData,
  pullOrderbookData,
} from "./actions";
import { OrderBookData, PricePoint } from "../../api/AdditionalServicesApi";
import { useEffect, useState } from "react";
import { useActiveWeb3React } from "../../hooks";
import { additionalServiceApi } from "../../api";
import { useSwapState } from "../orderPlacement/hooks";

export function useOrderbookState(): AppState["orderbook"] {
  return useSelector<AppState, AppState["orderbook"]>(
    (state) => state.orderbook,
  );
}

export function useOrderbookActionHandlers(): {
  onNewBid: (order: PricePoint) => void;
  onRemoveBid: (order: PricePoint) => void;
  onPullOrderbookData: () => void;
  onResetUserPrice: (price: number) => void;
  onResetUserVolume: (volume: number) => void;
  onResetOrderbookData: (orderbook: OrderBookData, error: Error | null) => void;
} {
  const dispatch = useDispatch<AppDispatch>();

  const onNewBid = useCallback(
    (order: PricePoint) => {
      dispatch(appendBid({ order }));
    },
    [dispatch],
  );
  const onRemoveBid = useCallback(
    (order: PricePoint) => {
      dispatch(removeBid({ order }));
    },
    [dispatch],
  );
  const onPullOrderbookData = useCallback(() => {
    dispatch(pullOrderbookData());
  }, [dispatch]);

  const onResetUserPrice = useCallback(
    (price: number) => {
      dispatch(resetUserPrice({ price }));
    },
    [dispatch],
  );
  const onResetUserVolume = useCallback(
    (volume: number) => {
      dispatch(resetUserVolume({ volume }));
    },
    [dispatch],
  );
  const onResetOrderbookData = useCallback(
    (orderbook: OrderBookData, error: Error | null) => {
      dispatch(resetOrderbookData({ orderbook, error }));
    },
    [dispatch],
  );

  return {
    onPullOrderbookData,
    onResetOrderbookData,
    onNewBid,
    onRemoveBid,
    onResetUserPrice,
    onResetUserVolume,
  };
}
export function useOrderbookDataCallback() {
  const { chainId } = useActiveWeb3React();
  const { auctionId } = useSwapState();
  const [isFetchingDone, setFetchingDone] = useState<boolean>();
  const { shouldLoad } = useOrderbookState();
  const { onResetOrderbookData } = useOrderbookActionHandlers();
  useEffect(() => {
    async function fetchData() {
      try {
        if (chainId == undefined || !auctionId) {
          return;
        }
        const rawData = await additionalServiceApi.getOrderBookData({
          networkId: chainId,
          auctionId,
        });
        onResetOrderbookData(rawData, null);
        setFetchingDone(true);
      } catch (error) {
        if (isFetchingDone) return;
        console.error("Error populating orderbook with data", error);
        onResetOrderbookData({ bids: [], asks: [] }, error);
      }
    }
    if (shouldLoad && !isFetchingDone) {
      fetchData();
    }
  }, [
    chainId,
    auctionId,
    shouldLoad,
    onResetOrderbookData,
    setFetchingDone,
    isFetchingDone,
  ]);
}
