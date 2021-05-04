import { createAction } from '@reduxjs/toolkit'

import { OrderDisplay } from './reducer'

export const appendOrders = createAction<{
  orders: OrderDisplay[]
}>('AppendOrders')

export const resetOrders = createAction<{
  orders: OrderDisplay[]
}>('ResetOrders')

export const cancelOrders = createAction<{
  orderId: string
}>('CancelOrders')

export const removeOrders = createAction<{
  orderId: string
}>('RemoveOrders')

export const finalizeOrderPlacement = createAction<void>('finalizeOrderPlacement')
export const finalizeOrderCancellation = createAction<void>('finalizeOrderCancellation')

export const loadOrderFromAPI = createAction<void>('LoadOrderFromAPI')
