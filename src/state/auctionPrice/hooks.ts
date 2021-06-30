import { useCallback, useEffect } from 'react'
import { Fraction } from 'uniswap-xdai-sdk'

import { useDispatch, useSelector } from 'react-redux'

import { AppDispatch, AppState } from '..'
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
  const { asks, bids, userOrderPrice, userOrderVolume } = useOrderbookState()

  const onSetCurrentPrice = useCallback(
    (price: string, priceReversed: string) => {
      dispatch(setCurrentPrice({ price, priceReversed }))
    },
    [dispatch],
  )
  const onPriceAlteration = useCallback(() => {
    const { price, priceReversed } = new CalculatorClearingPrice(
      bids,
      {
        price: userOrderPrice,
        volume: userOrderVolume,
      },
      asks[0],
    ).calculate()
    dispatch(alterationCurrentPrice({ price, priceReversed }))
  }, [asks, bids, dispatch, userOrderPrice, userOrderVolume])
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
  const { calculatedAfterOrder, shouldLoad: shouldLoadPrice } = useAuctionPriceState()
  const { onResetCurrentPrice, onSetCurrentPrice } = useAuctionPriceHandlers()
  const { auctionId, chainId } = auctionIdentifier

  useEffect(() => {
    onResetCurrentPrice()
  }, [auctionId, chainId, onResetCurrentPrice])

  useEffect(() => {
    if (!derivedAuctionInfo || shouldLoadPrice !== PriceStatus.NEEDS_UPDATING) return

    const { price, priceReversed } = calculatedAfterOrder
      ? calculatedAfterOrder
      : CalculatorClearingPrice.convertFromFraction(derivedAuctionInfo.clearingPrice)

    onSetCurrentPrice(price, priceReversed)
  }, [
    derivedAuctionInfo,
    shouldLoadPrice,
    onSetCurrentPrice,
    chainId,
    auctionId,
    onResetCurrentPrice,
    calculatedAfterOrder,
  ])
}
