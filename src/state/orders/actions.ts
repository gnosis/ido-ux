import { createAction } from "@reduxjs/toolkit";
import { OrderDisplay } from "./reducer";

export const appendOrders = createAction<{
  orders: OrderDisplay[];
}>("AppendOrders");

export const removeOrders = createAction<{
  orderId: string;
}>("RemoveOrders");

export const finalizeOrderPlacement = createAction<void>(
  "finalizeOrderPlacement",
);
