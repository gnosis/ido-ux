import { createReducer } from "@reduxjs/toolkit";
import { PricePoint } from "../../api/AdditionalServicesApi";
import {
  appendBid,
  removeBid,
  resetUserPrice,
  resetUserVolume,
  resetOrderbookData,
  pullOrderbookData,
} from "./actions";

export interface OrderbookState {
  asks: PricePoint[];
  bids: PricePoint[];
  error: Error | null;
  userOrderPrice: number;
  userOrderVolume: number;
  shouldLoad: boolean;
}

const initialState: OrderbookState = {
  bids: [],
  asks: [],
  error: null,
  userOrderPrice: 0,
  userOrderVolume: 0,
  shouldLoad: true,
};

export default createReducer<OrderbookState>(initialState, (builder) =>
  builder
    .addCase(appendBid, (state, { payload: { order } }) => {
      let bids = [order];
      for (const bid of state.bids) bids.push(bid);
      bids = [...new Set(bids)];
      return {
        ...state,
        userOrderPrice: 0,
        userOrderVolume: 0,
        bids: bids,
      };
    })
    .addCase(removeBid, (state, { payload: { order } }) => {
      const bids = [order];
      for (const bid of state.bids) bids.push(bid);
      bids.filter((o) => o != order);
      return {
        ...state,
        userOrderPrice: 0,
        userOrderVolume: 0,
        bids,
      };
    })
    .addCase(pullOrderbookData, (state: OrderbookState, {}) => {
      return {
        ...state,
        bids: [],
        asks: [],
        shouldLoad: true,
      };
    })
    .addCase(
      resetUserPrice,
      (state: OrderbookState, { payload: { price } }) => {
        return {
          ...state,
          userOrderPrice: price,
        };
      },
    )
    .addCase(resetUserVolume, (state, { payload: { volume } }) => {
      return {
        ...state,
        userOrderVolume: volume,
      };
    })
    .addCase(resetOrderbookData, (_, { payload: { orderbook, error } }) => {
      return {
        bids: orderbook.bids,
        asks: orderbook.asks,
        error,
        userOrderPrice: 0,
        userOrderVolume: 0,
        shouldLoad: false,
      };
    }),
);
