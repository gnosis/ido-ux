import { createReducer } from "@reduxjs/toolkit";
import { appendOrders, finalizeOrderPlacement, removeOrders } from "./actions";

export enum OrderStatus {
  PENDING,
  PLACED,
}

export interface OrderDisplay {
  id: string;
  sellAmount: string;
  price: string;
  status: OrderStatus;
}
export interface OrderState {
  orders: OrderDisplay[];
}

const initialState: OrderState = {
  orders: [],
};

export default createReducer<OrderState>(initialState, (builder) =>
  builder
    .addCase(appendOrders, (state: OrderState, { payload: { orders } }) => {
      for (const order of state.orders) orders.push(order);
      orders = [...new Set(orders)];
      return {
        ...state,
        orders,
      };
    })
    .addCase(removeOrders, (state: OrderState, { payload: { orderId } }) => {
      const newOrders = [...new Set(state.orders)].filter(
        (order) => !(orderId === order.id),
      );
      return {
        ...state,
        orders: newOrders,
      };
    })
    .addCase(finalizeOrderPlacement, (state: OrderState) => {
      const orders = [];
      for (const order of state.orders) {
        orders.push({
          id: order.id,
          sellAmount: order.sellAmount,
          price: order.price,
          status: OrderStatus.PLACED,
        });
      }
      return {
        ...state,
        orders,
      };
    }),
);
