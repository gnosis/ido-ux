import { useCallback, useEffect, useRef } from 'react'
import { Token } from 'uniswap-xdai-sdk'

import { useDispatch, useSelector } from 'react-redux'

import { AppDispatch, AppState } from '..'
import { additionalServiceApi } from '../../api'
import { Order } from '../../hooks/Order'
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

function calculateClearingPrice(
  clearingOrder: Order | null | undefined,
  auctioningToken: Token | undefined,
  biddingToken: Token | undefined,
) {
  const clearingPriceInfoAsSellOrder = orderToSellOrder(
    clearingOrder,
    biddingToken,
    auctioningToken,
  )
  const price = orderToPrice(clearingPriceInfoAsSellOrder)?.toSignificant(5)
  const priceReversed = orderToPrice(clearingPriceInfoAsSellOrder)?.invert().toSignificant(5)

  return [price, priceReversed]
}

export function useSetCurrentPrice(
  auctionIdentifier: AuctionIdentifier,
  derivedAuctionInfo: DerivedAuctionInfo,
) {
  const { shouldLoad: shouldLoadPrice } = useAuctionPriceState()
  const { onResetCurrentPrice, onSetCurrentPrice } = useAuctionPriceHandlers()
  const {
    current: { auctionId, chainId },
  } = useRef(auctionIdentifier)

  useEffect(() => {
    onResetCurrentPrice()
  }, [auctionId, chainId, onResetCurrentPrice])

  useEffect(() => {
    if (!derivedAuctionInfo || shouldLoadPrice !== PriceStatus.NEEDS_UPDATING) return

    let cancelled = false
    const fetchApiData = async () => {
      try {
        if (!chainId || !auctionId || !additionalServiceApi) {
          return
        }

        const clearingOrderAndVolume = await additionalServiceApi.getClearingPriceOrderAndVolume({
          networkId: chainId,
          auctionId,
        })

        if (!cancelled) {
          const [price, priceReversed] = calculateClearingPrice(
            clearingOrderAndVolume.clearingOrder,
            derivedAuctionInfo.auctioningToken,
            derivedAuctionInfo.biddingToken,
          )
          onSetCurrentPrice(price as string, priceReversed as string)
        }
      } catch (error) {
        onResetCurrentPrice()
        console.error('Error getting clearing price info', error)
      }
    }

    fetchApiData()
    return (): void => {
      cancelled = true
    }
  }, [
    derivedAuctionInfo,
    shouldLoadPrice,
    onSetCurrentPrice,
    chainId,
    auctionId,
    onResetCurrentPrice,
  ])
}
