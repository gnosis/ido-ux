import { createReducer } from '@reduxjs/toolkit'
import { parse } from 'qs'

import { CHAIN_ID } from '../../constants/config'
import { priceInput, sellAmountInput, setDefaultsFromURLSearch } from './actions'

export interface SwapState {
  readonly chainId: number
  readonly price: string
  readonly sellAmount: string
  readonly auctionId: number
}

const initialState: SwapState = {
  chainId: CHAIN_ID,
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
