import { createReducer } from '@reduxjs/toolkit'

import {
  appendOrders,
  cancelOrders,
  finalizeOrderCancellation,
  finalizeOrderPlacement,
  loadOrderFromAPI,
  removeOrders,
  resetOrders,
} from './actions'

export enum OrderStatus {
  PENDING,
  PLACED,
  PENDING_CANCELLATION,
}

export interface OrderDisplay {
  id: string
  sellAmount: string
  price: string
  status: OrderStatus
  chainId: number
}
export interface OrderState {
  orders: OrderDisplay[]
}

const initialState: OrderState = {
  orders: [],
}

export default createReducer<OrderState>(initialState, (builder) =>
  builder
    .addCase(appendOrders, (state: OrderState, { payload: { orders } }) => {
      for (const order of state.orders) orders.push(order)
      orders = [...new Set(orders)]
      return {
        ...state,
        orders,
      }
    })
    .addCase(resetOrders, (state: OrderState, { payload: { orders } }) => {
      orders = [...new Set(orders)]
      return {
        ...state,
        orders,
      }
    })
    .addCase(cancelOrders, (state: OrderState, { payload: { orderId } }) => {
      const newOrders = [...new Set(state.orders)].map((order) =>
        orderId === order.id ? { ...order, status: OrderStatus.PENDING_CANCELLATION } : order,
      )
      return {
        ...state,
        orders: newOrders,
      }
    })
    .addCase(removeOrders, (state: OrderState, { payload: { orderId } }) => {
      const newOrders = [...new Set(state.orders)].filter((order) => !(orderId === order.id))
      return {
        ...state,
        orders: newOrders,
      }
    })
    .addCase(finalizeOrderCancellation, (state: OrderState) => {
      const newOrders = [...new Set(state.orders)].filter(
        (order) => order.status !== OrderStatus.PENDING_CANCELLATION,
      )
      return {
        ...state,
        orders: newOrders,
      }
    })
    .addCase(finalizeOrderPlacement, (state: OrderState) => {
      const newOrders = [...new Set(state.orders)].map((order) =>
        order.status === OrderStatus.PENDING ? { ...order, status: OrderStatus.PLACED } : order,
      )
      return {
        ...state,
        orders: newOrders,
      }
    })
    .addCase(loadOrderFromAPI, (state: OrderState) => {
      return {
        ...state,
        orders: [],
      }
    }),
)
