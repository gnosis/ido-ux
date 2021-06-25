import { useCallback, useEffect, useRef } from 'react'

import { useDispatch, useSelector } from 'react-redux'

import { AppDispatch, AppState } from '..'
import { useClearingPriceInfoConditioned } from '../../hooks/useCurrentClearingOrderAndVolumeCallback'
import { DerivedAuctionInfo, orderToPrice, orderToSellOrder } from '../orderPlacement/hooks'
import { AuctionIdentifier } from '../orderPlacement/reducer'
import {
  alterationCurrentPrice,
  resetCurrentPrice,
  setCurrentPrice,
  updateCurrentPrice,
} from './actions'
import { PriceStatus } from './reducer'

export function useAuctionPriceState(): AppState['auctionPrice'] {
  return useSelector<AppState, AppState['auctionPrice']>((state) => state.auctionPrice)
}

export function useAuctionPriceHandlers(): {
  onSetCurrentPrice: (price: string, priceReversed: string) => void
  onPriceAlteration: () => void
  onUpdateIfPriceChanged: () => void
  onResetCurrentPrice: () => void
} {
  const dispatch = useDispatch<AppDispatch>()

  const onSetCurrentPrice = useCallback(
    (price: string, priceReversed: string) => {
      dispatch(setCurrentPrice({ price, priceReversed }))
    },
    [dispatch],
  )
  const onPriceAlteration = useCallback(() => {
    dispatch(alterationCurrentPrice())
  }, [dispatch])
  const onUpdateIfPriceChanged = useCallback(() => {
    dispatch(updateCurrentPrice())
  }, [dispatch])
  const onResetCurrentPrice = useCallback(() => {
    dispatch(resetCurrentPrice())
  }, [dispatch])

  return {
    onSetCurrentPrice,
    onPriceAlteration,
    onUpdateIfPriceChanged,
    onResetCurrentPrice,
  }
}

export function useSetCurrentPrice(
  auctionIdentifier: AuctionIdentifier,
  derivedAuctionInfo: DerivedAuctionInfo,
) {
  const { shouldLoad: shouldLoadPrice } = useAuctionPriceState()
  const { onResetCurrentPrice, onSetCurrentPrice } = useAuctionPriceHandlers()
  const { current: auctionIdentifierRef } = useRef(auctionIdentifier)
  const { clearingPriceInfo } = useClearingPriceInfoConditioned(
    auctionIdentifierRef,
    shouldLoadPrice,
  )

  useEffect(() => {
    onResetCurrentPrice()
  }, [auctionIdentifierRef, onResetCurrentPrice])

  useEffect(() => {
    if (!clearingPriceInfo || !derivedAuctionInfo || shouldLoadPrice !== PriceStatus.NEEDS_UPDATING)
      return

    const clearingPriceInfoAsSellOrder = orderToSellOrder(
      clearingPriceInfo.clearingOrder,
      derivedAuctionInfo.biddingToken,
      derivedAuctionInfo.auctioningToken,
    )
    const price = orderToPrice(clearingPriceInfoAsSellOrder)?.toSignificant(5)
    const priceReversed = orderToPrice(clearingPriceInfoAsSellOrder)?.invert().toSignificant(5)
    onSetCurrentPrice(price as string, priceReversed as string)
  }, [
    clearingPriceInfo,
    derivedAuctionInfo,
    auctionIdentifierRef,
    shouldLoadPrice,
    onSetCurrentPrice,
  ])
}
