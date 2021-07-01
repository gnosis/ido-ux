import { useCallback, useEffect } from 'react'
import { Fraction } from 'uniswap-xdai-sdk'

import { useDispatch, useSelector } from 'react-redux'

import { AppDispatch, AppState } from '..'
import { PricePoint } from '../../api/AdditionalServicesApi'
import { CalculatorClearingPrice } from '../../components/auction/OrderbookWidget'
import { DerivedAuctionInfo } from '../orderPlacement/hooks'
import { AuctionIdentifier } from '../orderPlacement/reducer'
import { useOrderbookState } from '../orderbook/hooks'
import {
  alterationCurrentPrice,
  resetCurrentPrice,
  setCurrentPrice,
  updateCurrentPrice,
} from './actions'
import { CalculatedAfterOrder, PriceStatus } from './reducer'

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
  const { userOrderPrice, userOrderVolume } = useOrderbookState()

  const onSetCurrentPrice = useCallback(
    (price: string, priceReversed: string) => {
      dispatch(setCurrentPrice({ price, priceReversed }))
    },
    [dispatch],
  )
  const onPriceAlteration = useCallback(() => {
    dispatch(alterationCurrentPrice({ userOrderPrice, userOrderVolume }))
  }, [dispatch, userOrderPrice, userOrderVolume])
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

interface AuctionInfoDefined extends Omit<DerivedAuctionInfo, 'clearingPrice'> {
  clearingPrice: Fraction
}

export function useSetCurrentPrice(
  auctionIdentifier: AuctionIdentifier,
  derivedAuctionInfo: AuctionInfoDefined,
) {
  const { changedUserOrder, shouldLoad: shouldLoadPrice } = useAuctionPriceState()
  const { onResetCurrentPrice, onSetCurrentPrice } = useAuctionPriceHandlers()
  const { auctionId, chainId } = auctionIdentifier
  const { asks, bids } = useOrderbookState()
  const isInitialAuctionOrderLoaded = changedUserOrder && !asks[0]

  // This can happen when the orders are not yet know to the backend
  const getOrderIfNotPresentInBids = (
    bids: PricePoint[],
    placedUserOrder: CalculatedAfterOrder,
  ) => {
    let userOrder = { price: 0, volume: 0 }
    const lastOrder = bids[0]
    if (
      placedUserOrder.userOrderVolume &&
      placedUserOrder.userOrderPrice &&
      lastOrder?.volume !== placedUserOrder.userOrderVolume &&
      lastOrder?.price !== placedUserOrder.userOrderPrice
    ) {
      userOrder = {
        price: placedUserOrder.userOrderPrice,
        volume: placedUserOrder.userOrderVolume,
      }
    }

    return userOrder
  }

  useEffect(() => {
    onResetCurrentPrice()
  }, [auctionId, chainId, onResetCurrentPrice])

  useEffect(() => {
    if (
      !derivedAuctionInfo ||
      shouldLoadPrice !== PriceStatus.NEEDS_UPDATING ||
      isInitialAuctionOrderLoaded
    )
      return

    const { price, priceReversed } = changedUserOrder
      ? new CalculatorClearingPrice(
          bids,
          getOrderIfNotPresentInBids(bids, changedUserOrder),
          asks[0],
        ).calculate()
      : CalculatorClearingPrice.convertFromFraction(derivedAuctionInfo.clearingPrice)

    onSetCurrentPrice(price, priceReversed)
  }, [
    derivedAuctionInfo,
    shouldLoadPrice,
    onSetCurrentPrice,
    chainId,
    auctionId,
    onResetCurrentPrice,
    asks,
    bids,
    changedUserOrder,
    isInitialAuctionOrderLoaded,
  ])
}
