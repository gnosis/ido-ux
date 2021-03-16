import { createReducer } from '@reduxjs/toolkit'
import { parse } from 'qs'

import {
  priceInput,
  sellAmountInput,
  setDefaultsFromURLSearch,
  setNoDefaultNetworkId,
} from './actions'

export interface SwapState {
  readonly chainId: number | undefined
  readonly price: string
  readonly sellAmount: string
  readonly auctionId: number
}

const initialState: SwapState = {
  chainId: undefined,
  price: '-',
  auctionId: 1,
  sellAmount: '',
}

function parseAuctionIdParameter(urlParam: any): number {
  return typeof urlParam === 'string' && !isNaN(parseInt(urlParam)) ? parseInt(urlParam) : 1
}

export default createReducer<SwapState>(initialState, (builder) =>
  builder
    .addCase(setDefaultsFromURLSearch, (_, { payload: { queryString } }) => {
      if (queryString && queryString.length > 1) {
        const parsedQs = parse(queryString, {
          parseArrays: false,
          ignoreQueryPrefix: true,
        })

        return {
          ...initialState,
          chainId: parseAuctionIdParameter(parsedQs.chainId),
          auctionId: parseAuctionIdParameter(parsedQs.auctionId),
        }
      }

      return {
        ...initialState,
        auctionId: 1,
      }
    })
    .addCase(setNoDefaultNetworkId, () => {
      return {
        ...initialState,
      }
    })
    .addCase(sellAmountInput, (state, { payload: { sellAmount } }) => {
      return {
        ...state,
        sellAmount,
      }
    })
    .addCase(priceInput, (state, { payload: { price } }) => {
      return {
        ...state,
        price,
      }
    }),
)
