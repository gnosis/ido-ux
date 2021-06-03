import { createReducer } from '@reduxjs/toolkit'

import { alterationCurrentPrice, setCurrentPrice, updateCurrentPrice } from './actions'

export interface AuctionPriceState {
  currentPrice: Maybe<string>
  currentPriceReversed: Maybe<string>
  shouldLoad: Maybe<boolean>
}

const initialState: AuctionPriceState = {
  currentPrice: null,
  currentPriceReversed: null,
  shouldLoad: true,
}

export default createReducer<AuctionPriceState>(initialState, (builder) =>
  builder
    .addCase(setCurrentPrice, (state, { payload: { price, priceReversed } }) => {
      return {
        ...state,
        currentPrice: price,
        currentPriceReversed: priceReversed,
        shouldLoad: false,
      }
    })
    .addCase(alterationCurrentPrice, (state: AuctionPriceState) => {
      return {
        ...state,
        shouldLoad: null,
      }
    })
    .addCase(updateCurrentPrice, (state: AuctionPriceState) => {
      const isPriceAltered = state.shouldLoad === null
      return {
        ...state,
        shouldLoad: isPriceAltered,
      }
    }),
)
