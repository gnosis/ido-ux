import { useCallback, useEffect } from 'react'

import { useDispatch, useSelector } from 'react-redux'

import { AppDispatch, AppState } from '..'
import { additionalServiceApi } from '../../api'
import { OrderBookData, PricePoint } from '../../api/AdditionalServicesApi'
import { useSwapState } from '../orderPlacement/hooks'
import {
  appendBid,
  pullOrderbookData,
  removeBid,
  resetOrderbookData,
  resetUserPrice,
  resetUserVolume,
} from './actions'

export function useOrderbookState(): AppState['orderbook'] {
  return useSelector<AppState, AppState['orderbook']>((state) => state.orderbook)
}

export function useOrderbookActionHandlers(): {
  onNewBid: (order: PricePoint) => void
  onRemoveBid: (order: PricePoint) => void
  onPullOrderbookData: () => void
  onResetUserPrice: (price: number) => void
  onResetUserVolume: (volume: number) => void
  onResetOrderbookData: (orderbook: OrderBookData, error: Maybe<Error>) => void
} {
  const dispatch = useDispatch<AppDispatch>()

  const onNewBid = useCallback(
    (order: PricePoint) => {
      dispatch(appendBid({ order }))
    },
    [dispatch],
  )
  const onRemoveBid = useCallback(
    (order: PricePoint) => {
      dispatch(removeBid({ order }))
    },
    [dispatch],
  )
  const onPullOrderbookData = useCallback(() => {
    dispatch(pullOrderbookData())
  }, [dispatch])

  const onResetUserPrice = useCallback(
    (price: number) => {
      dispatch(resetUserPrice({ price }))
    },
    [dispatch],
  )
  const onResetUserVolume = useCallback(
    (volume: number) => {
      dispatch(resetUserVolume({ volume }))
    },
    [dispatch],
  )
  const onResetOrderbookData = useCallback(
    (orderbook: OrderBookData, error: Maybe<Error>) => {
      dispatch(resetOrderbookData({ orderbook, error }))
    },
    [dispatch],
  )

  return {
    onPullOrderbookData,
    onResetOrderbookData,
    onNewBid,
    onRemoveBid,
    onResetUserPrice,
    onResetUserVolume,
  }
}
export function useOrderbookDataCallback() {
  const { auctionId, chainId } = useSwapState()
  const { onResetOrderbookData } = useOrderbookActionHandlers()
  useEffect(() => {
    let cancelled = false
    async function fetchData() {
      try {
        if (!chainId || !auctionId) {
          return
        }
        const rawData = await additionalServiceApi.getOrderBookData({
          networkId: chainId,
          auctionId,
        })
        if (!cancelled) {
          onResetOrderbookData(rawData, null)
        }
      } catch (error) {
        if (cancelled) return
        console.error('Error populating orderbook with data', error)
        onResetOrderbookData({ bids: [], asks: [] }, null)
      }
    }
    fetchData()
    return (): void => {
      cancelled = true
    }
  }, [chainId, auctionId, onResetOrderbookData])
}
