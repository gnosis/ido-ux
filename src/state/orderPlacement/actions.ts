import { createAction } from '@reduxjs/toolkit'

export const setDefaultsFromURLSearch = createAction<{
  queryString: string
}>('setDefaultsFromURL')
export const setNoDefaultNetworkId = createAction('setNoDefaultNetworkId')
export const sellAmountInput = createAction<{ sellAmount: string }>('sellAmountInput')
export const priceInput = createAction<{ price: string }>('priceInput')
export const invertPrice = createAction('invertPrice')
