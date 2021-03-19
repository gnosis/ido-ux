import { createAction } from '@reduxjs/toolkit'

import { OrderDisplay } from './reducer'

export const appendOrders = createAction<{
  orders: OrderDisplay[]
}>('AppendOrders')

export const resetOrders = createAction<{
  orders: OrderDisplay[]
}>('ResetOrders')

export const removeOrders = createAction<{
  orderId: string
}>('RemoveOrders')

export const finalizeOrderPlacement = createAction<void>('finalizeOrderPlacement')

export const loadOrderFromAPI = createAction<void>('LoadOrderFromAPI')
