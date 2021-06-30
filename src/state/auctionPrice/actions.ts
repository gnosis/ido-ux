import { createAction } from '@reduxjs/toolkit'

export const alterationCurrentPrice = createAction<{
  userOrderVolume: number
  userOrderPrice: number
}>('alterationCurrentPrice')
export const updateCurrentPrice = createAction<void>('updateCurrentPrice')
export const setCurrentPrice = createAction<{
  price: string
  priceReversed: string
}>('setCurrentPrice')
export const resetCurrentPrice = createAction<void>('resetCurrentPrice')
