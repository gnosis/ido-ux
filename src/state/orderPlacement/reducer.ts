import { createReducer } from '@reduxjs/toolkit'
import { parse } from 'qs'

import { NUMBER_OF_DIGITS_FOR_INVERSION } from '../../constants/config'
import { getInverse } from '../../utils/prices'
import {
  invertPrice,
  priceInput,
  sellAmountInput,
  setDefaultsFromURLSearch,
  setNoDefaultNetworkId,
} from './actions'

export interface OrderPlacementState {
  readonly chainId: number | undefined
  readonly price: string
  readonly sellAmount: string
  readonly showPriceInverted: boolean
}

const initialState: OrderPlacementState = {
  chainId: undefined,
  price: '-',
  sellAmount: '',
  showPriceInverted: false,
}

function parseAuctionIdParameter(urlParam: any): number {
  return typeof urlParam === 'string' && !isNaN(parseInt(urlParam)) ? parseInt(urlParam) : 1
}

export default createReducer<OrderPlacementState>(initialState, (builder) =>
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
    .addCase(invertPrice, (state) => {
      return {
        ...state,
        price: getInverse(state.price, NUMBER_OF_DIGITS_FOR_INVERSION),
        showPriceInverted: !state.showPriceInverted,
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
