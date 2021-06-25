import { createReducer } from '@reduxjs/toolkit'

import {
  alterationCurrentPrice,
  resetCurrentPrice,
  setCurrentPrice,
  updateCurrentPrice,
} from './actions'

export enum PriceStatus {
  NEEDS_UPDATING = 0,
  SETTLED = 1,
  CHANGED = 2,
}

export interface AuctionPriceState {
  currentPrice: Maybe<string>
  currentPriceReversed: Maybe<string>
  shouldLoad: PriceStatus
}

const initialState: AuctionPriceState = {
  currentPrice: null,
  currentPriceReversed: null,
  shouldLoad: PriceStatus.NEEDS_UPDATING,
}

export default createReducer<AuctionPriceState>(initialState, (builder) =>
  builder
    .addCase(setCurrentPrice, (state, { payload: { price, priceReversed } }) => {
      return {
        ...state,
        currentPrice: price,
        currentPriceReversed: priceReversed,
        shouldLoad: PriceStatus.SETTLED,
      }
    })
    .addCase(alterationCurrentPrice, (state: AuctionPriceState) => {
      return {
        ...state,
        shouldLoad: PriceStatus.CHANGED,
      }
    })
    .addCase(updateCurrentPrice, (state: AuctionPriceState) => {
      return {
        ...state,
        shouldLoad:
          state.shouldLoad === PriceStatus.CHANGED
            ? PriceStatus.NEEDS_UPDATING
            : PriceStatus.SETTLED,
      }
    })
    .addCase(resetCurrentPrice, () => {
      return {
        ...initialState,
      }
    }),
)
