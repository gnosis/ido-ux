import { createReducer } from '@reduxjs/toolkit'

import { PricePoint } from '../../api/AdditionalServicesApi'
import {
  appendBid,
  pullOrderbookData,
  removeBid,
  resetOrderbookData,
  resetUserPrice,
  resetUserVolume,
  setCurrentPrice,
} from './actions'

export interface OrderbookState {
  asks: PricePoint[]
  bids: PricePoint[]
  error: Maybe<Error>
  userOrderPrice: number
  userOrderVolume: number
  currentPrice: number
  auctionId: number
  chainId: number
}

const initialState: OrderbookState = {
  bids: [],
  asks: [],
  error: null,
  userOrderPrice: 0,
  userOrderVolume: 0,
  currentPrice: 0,
  auctionId: 0,
  chainId: 0,
}

export default createReducer<OrderbookState>(initialState, (builder) =>
  builder
    .addCase(appendBid, (state, { payload: { order } }) => {
      let bids = [order]
      for (const bid of state.bids) bids.push(bid)
      bids = [...new Set(bids)]
      return {
        ...state,
        userOrderPrice: 0,
        userOrderVolume: 0,
        bids: bids,
      }
    })
    .addCase(removeBid, (state, { payload: { order } }) => {
      const bids = [order]
      for (const bid of state.bids) bids.push(bid)
      bids.filter((o) => o != order)
      return {
        ...state,
        userOrderPrice: 0,
        userOrderVolume: 0,
        bids,
      }
    })
    // eslint-disable-next-line no-empty-pattern
    .addCase(pullOrderbookData, (state: OrderbookState, {}) => {
      return {
        ...state,
        bids: [],
        asks: [],
        shouldLoad: true,
      }
    })
    .addCase(resetUserPrice, (state: OrderbookState, { payload: { price } }) => {
      return {
        ...state,
        userOrderPrice: price,
      }
    })
    .addCase(resetUserVolume, (state, { payload: { volume } }) => {
      return {
        ...state,
        userOrderVolume: volume,
      }
    })
    .addCase(resetOrderbookData, (_, { payload: { auctionId, chainId, error, orderbook } }) => {
      return {
        bids: orderbook.bids,
        asks: orderbook.asks,
        error,
        userOrderPrice: 0,
        userOrderVolume: 0,
        currentPrice: 0,
        shouldLoad: false,
        auctionId,
        chainId,
      }
    })
    .addCase(setCurrentPrice, (state, { payload: { price } }) => {
      return {
        ...state,
        currentPrice: price,
      }
    }),
)
