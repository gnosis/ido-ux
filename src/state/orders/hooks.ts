import { useCallback } from 'react'

import { useDispatch, useSelector } from 'react-redux'

import { AppDispatch, AppState } from '..'
import { appendOrders, finalizeOrderPlacement, loadOrderFromAPI, removeOrders } from './actions'
import { OrderDisplay } from './reducer'

export function useOrderState(): AppState['orders'] {
  return useSelector<AppState, AppState['orders']>((state) => state.orders)
}

export function useOrderActionHandlers(): {
  onNewOrder: (orders: OrderDisplay[]) => void
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
  const onFinalizeOrder = useCallback(() => {
    dispatch(finalizeOrderPlacement())
  }, [dispatch])

  const onReloadFromAPI = useCallback(() => {
    dispatch(loadOrderFromAPI())
  }, [dispatch])

  const onDeleteOrder = useCallback(
    (orderId: string) => {
      dispatch(removeOrders({ orderId }))
    },
    [dispatch],
  )

  return { onNewOrder, onReloadFromAPI, onFinalizeOrder, onDeleteOrder }
}
