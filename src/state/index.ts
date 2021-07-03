import { configureStore, getDefaultMiddleware } from '@reduxjs/toolkit'
import { load, save } from 'redux-localstorage-simple'

import application from './application/reducer'
import multicall from './multicall/reducer'
import orderPlacement from './orderPlacement/reducer'
import orderbook from './orderbook/reducer'
import orders from './orders/reducer'
import tokenList from './tokenList/reducer'
import transactions from './transactions/reducer'
import { updateVersion } from './user/actions'
import user from './user/reducer'

const PERSISTED_KEYS: string[] = ['user', 'transactions']

const store = configureStore({
  reducer: {
    application,
    user,
    transactions,
    orderPlacement,
    orders,
    orderbook,
    multicall,
    tokenList,
  },
  middleware: [...getDefaultMiddleware(), save({ states: PERSISTED_KEYS })],
  preloadedState: load({ states: PERSISTED_KEYS }),
})

store.dispatch(updateVersion())

export default store

export type AppState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
