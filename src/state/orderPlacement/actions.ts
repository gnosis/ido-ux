import { createAction } from '@reduxjs/toolkit'

export const setDefaultsFromURLSearch = createAction<{
  chainId: number
  queryString?: string
}>('setDefaultsFromURL')
export const sellAmountInput = createAction<{ sellAmount: string }>('sellAmountInput')
export const priceInput = createAction<{ price: string }>('priceInput')
