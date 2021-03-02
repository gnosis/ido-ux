import { useCallback, useEffect, useState } from 'react'

import { useDispatch, useSelector } from 'react-redux'

import { AppDispatch, AppState } from '..'
import { additionalServiceApi } from '../../api'
import { OrderBookData, PricePoint } from '../../api/AdditionalServicesApi'
import { useActiveWeb3React } from '../../hooks'
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
  const { chainId } = useActiveWeb3React()
  const { auctionId } = useSwapState()
  const [isFetchingDone, setFetchingDone] = useState<boolean>()
  const { shouldLoad } = useOrderbookState()
  const { onResetOrderbookData } = useOrderbookActionHandlers()
  useEffect(() => {
    async function fetchData() {
      try {
        if (chainId == undefined || !auctionId) {
          return
        }
        const rawData = await additionalServiceApi.getOrderBookData({
          networkId: chainId,
          auctionId,
        })
        onResetOrderbookData(rawData, null)
        setFetchingDone(true)
      } catch (error) {
        if (isFetchingDone) return
        console.error('Error populating orderbook with data', error)
        onResetOrderbookData({ bids: [], asks: [] }, null)
      }
    }
    if (shouldLoad && !isFetchingDone) {
      fetchData()
    }
  }, [chainId, auctionId, shouldLoad, onResetOrderbookData, setFetchingDone, isFetchingDone])
}
