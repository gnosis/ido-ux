import { configureStore, getDefaultMiddleware } from "@reduxjs/toolkit";
import { save, load } from "redux-localstorage-simple";

import application from "./application/reducer";
import user from "./user/reducer";
import transactions from "./transactions/reducer";
import swap from "./orderPlacement/reducer";
import orders from "./orders/reducer";
import orderbook from "./orderbook/reducer";

import multicall from "./multicall/reducer";

import { updateVersion } from "./user/actions";

const PERSISTED_KEYS: string[] = ["user", "transactions"];

const store = configureStore({
  reducer: {
    application,
    user,
    transactions,
    swap,
    orders,
    orderbook,
    multicall,
  },
  middleware: [...getDefaultMiddleware(), save({ states: PERSISTED_KEYS })],
  preloadedState: load({ states: PERSISTED_KEYS }),
});

store.dispatch(updateVersion());

export default store;

export type AppState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
