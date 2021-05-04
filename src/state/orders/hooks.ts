import { useCallback } from 'react'

import { useDispatch, useSelector } from 'react-redux'

import { AppDispatch, AppState } from '..'
import {
  appendOrders,
  cancelOrders,
  finalizeOrderPlacement,
  loadOrderFromAPI,
  removeOrders,
  resetOrders,
} from './actions'
import { OrderDisplay } from './reducer'

export function useOrderState(): AppState['orders'] {
  return useSelector<AppState, AppState['orders']>((state) => state.orders)
}

export function useOrderActionHandlers(): {
  onResetOrder: (orders: OrderDisplay[]) => void
  onNewOrder: (orders: OrderDisplay[]) => void
  onCancelOrder: (orderId: string) => void
  onDeleteOrder: (orderId: string) => void
  onFinalizeOrder: () => void
  onReloadFromAPI: () => void
} {
  const dispatch = useDispatch<AppDispatch>()

  const onNewOrder = useCallback(
    (orders: OrderDisplay[]) => {
      dispatch(appendOrders({ orders }))
    },
    [dispatch],
  )
  const onResetOrder = useCallback(
    (orders: OrderDisplay[]) => {
      dispatch(resetOrders({ orders }))
    },
    [dispatch],
  )
  const onFinalizeOrder = useCallback(() => {
    dispatch(finalizeOrderPlacement())
  }, [dispatch])

  const onReloadFromAPI = useCallback(() => {
    dispatch(loadOrderFromAPI())
  }, [dispatch])

  const onCancelOrder = useCallback(
    (orderId: string) => {
      dispatch(cancelOrders({ orderId }))
    },
    [dispatch],
  )
  const onDeleteOrder = useCallback(
    (orderId: string) => {
      dispatch(removeOrders({ orderId }))
    },
    [dispatch],
  )

  return {
    onResetOrder,
    onNewOrder,
    onReloadFromAPI,
    onFinalizeOrder,
    onCancelOrder,
    onDeleteOrder,
  }
}
