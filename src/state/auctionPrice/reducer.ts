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

export interface CalculatedAfterOrder {
  userOrderVolume: number
  userOrderPrice: number
}

export interface AuctionPriceState {
  currentPrice: Maybe<string>
  currentPriceReversed: Maybe<string>
  shouldLoad: PriceStatus
  changedUserOrder: Maybe<CalculatedAfterOrder>
}

const initialState: AuctionPriceState = {
  currentPrice: null,
  currentPriceReversed: null,
  shouldLoad: PriceStatus.NEEDS_UPDATING,
  changedUserOrder: null,
}

export default createReducer<AuctionPriceState>(initialState, (builder) =>
  builder
    .addCase(setCurrentPrice, (state, { payload: { price, priceReversed } }) => {
      return {
        ...state,
        currentPrice: price,
        currentPriceReversed: priceReversed,
        changedUserOrder: null,
        shouldLoad: PriceStatus.SETTLED,
      }
    })
    .addCase(
      alterationCurrentPrice,
      (state: AuctionPriceState, { payload: { userOrderPrice, userOrderVolume } }) => {
        return {
          ...state,
          changedUserOrder: { userOrderVolume, userOrderPrice },
          shouldLoad: PriceStatus.CHANGED,
        }
      },
    )
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
