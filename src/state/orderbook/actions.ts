import { createAction } from '@reduxjs/toolkit'

import { OrderBookData, PricePoint } from '../../api/AdditionalServicesApi'

export const appendBid = createAction<{
  order: PricePoint
}>('appendBid')

export const removeBid = createAction<{
  order: PricePoint
}>('removeBid')

export const resetOrderbookData = createAction<{
  orderbook: OrderBookData
  error: Maybe<Error>
}>('ResetOrders')

export const pullOrderbookData = createAction<void>('PullOrderbookData')

export const resetUserBid = createAction<{
  bid: PricePoint
}>('ResetUserBid')

export const resetUserPrice = createAction<{
  price: number
}>('ResetUserPrice')

export const resetUserVolume = createAction<{
  volume: number
}>('ResetUserVolume')
