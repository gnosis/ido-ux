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
}

const initialState: SwapState = {
  chainId: undefined,
  price: '-',
  sellAmount: '',
}

function parseAuctionIdParameter(urlParam: any): number {
  return typeof urlParam === 'string' && !isNaN(parseInt(urlParam)) ? parseInt(urlParam) : 1
}

export default createReducer<SwapState>(initialState, (builder) =>
  builder
    .addCase(setDefaultsFromURLSearch, (_, { payload: { queryString } }) => {
      const { chainId } = parseURL(queryString)
      return {
        ...initialState,
        chainId,
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

export interface AuctionIdentifier {
  auctionId: number
  chainId: number
}
export function parseURL(queryString: string): AuctionIdentifier {
  if (queryString && queryString.length > 1) {
    const parsedQs = parse(queryString, {
      parseArrays: false,
      ignoreQueryPrefix: true,
    })

    return {
      chainId: parseAuctionIdParameter(parsedQs.chainId),
      auctionId: parseAuctionIdParameter(parsedQs.auctionId),
    }
  }

  return {
    chainId: 1,
    auctionId: 1,
  }
}
