import { useCallback, useEffect, useMemo, useState } from 'react'
import { Fraction, JSBI, Token, TokenAmount } from 'uniswap-xdai-sdk'

import { BigNumber } from '@ethersproject/bignumber'
import { Contract } from '@ethersproject/contracts'
import { parseUnits } from '@ethersproject/units'
import { useDispatch, useSelector } from 'react-redux'

import { additionalServiceApi } from '../../api'
import { ClearingPriceAndVolumeData } from '../../api/AdditionalServicesApi'
import easyAuctionABI from '../../constants/abis/easyAuction/easyAuction.json'
import { NUMBER_OF_DIGITS_FOR_INVERSION } from '../../constants/config'
import { useActiveWeb3React } from '../../hooks'
import { Order, decodeOrder, encodeOrder } from '../../hooks/Order'
import { useTokenByAddressAndAutomaticallyAdd } from '../../hooks/Tokens'
import { AuctionInfoDetail, useAuctionDetails } from '../../hooks/useAuctionDetails'
import { useGetClaimInfo } from '../../hooks/useClaimOrderCallback'
import { useContract } from '../../hooks/useContract'
import { useClearingPriceInfo } from '../../hooks/useCurrentClearingOrderAndVolumeCallback'
import { ChainId, EASY_AUCTION_NETWORKS, getTokenDisplay, isTimeout } from '../../utils'
import { getLogger } from '../../utils/logger'
import { convertPriceIntoBuyAndSellAmount, getInverse } from '../../utils/prices'
import { calculateTimeLeft } from '../../utils/tools'
import { AppDispatch, AppState } from '../index'
import { useSingleCallResult } from '../multicall/hooks'
import { resetUserPrice, resetUserVolume } from '../orderbook/actions'
import { useOrderActionHandlers } from '../orders/hooks'
import { OrderDisplay, OrderStatus } from '../orders/reducer'
import { useTokenBalancesTreatWETHAsETHonXDAI } from '../wallet/hooks'
import {
  invertPrice,
  priceInput,
  sellAmountInput,
  setDefaultsFromURLSearch,
  setNoDefaultNetworkId,
} from './actions'
import { AuctionIdentifier } from './reducer'

const logger = getLogger('orderPlacement/hooks')

export interface SellOrder {
  sellAmount: TokenAmount
  buyAmount: TokenAmount
}

export enum AuctionState {
  NOT_YET_STARTED,
  ORDER_PLACING_AND_CANCELING,
  ORDER_PLACING,
  PRICE_SUBMISSION,
  CLAIMING,
}

export function orderToSellOrder(
  order: Order | null | undefined,
  biddingToken: Token | undefined,
  auctioningToken: Token | undefined,
): SellOrder | undefined {
  if (!!order && biddingToken && auctioningToken) {
    return {
      sellAmount: new TokenAmount(biddingToken, order.sellAmount.toString()),
      buyAmount: new TokenAmount(auctioningToken, order.buyAmount.toString()),
    }
  } else {
    return undefined
  }
}

export function orderToPrice(order: SellOrder | null | undefined): Fraction | undefined {
  if (
    !order ||
    order.buyAmount == undefined ||
    order.buyAmount.raw.toString() == '0' ||
    order.sellAmount == undefined
  ) {
    return undefined
  } else {
    return new Fraction(
      BigNumber.from(order.sellAmount.raw.toString())
        .mul(BigNumber.from('10').pow(order.buyAmount.token.decimals))
        .toString(),
      BigNumber.from(order.buyAmount.raw.toString())
        .mul(BigNumber.from('10').pow(order.sellAmount.token.decimals))
        .toString(),
    )
  }
}

function decodeSellOrder(
  orderBytes: string | undefined,
  soldToken: Token | undefined,
  boughtToken: Token | undefined,
): Maybe<SellOrder> {
  if (!orderBytes || !soldToken || !boughtToken) {
    return null
  }
  const sellAmount = new Fraction(
    BigNumber.from('0x' + orderBytes.substring(43, 66)).toString(),
    '1',
  )
  const buyAmount = new Fraction(
    BigNumber.from('0x' + orderBytes.substring(19, 42)).toString(),
    '1',
  )
  return {
    sellAmount: new TokenAmount(soldToken, sellAmount.toSignificant(6)),
    buyAmount: new TokenAmount(boughtToken, buyAmount.toSignificant(6)),
  }
}

const decodeSellOrderFromAPI = (
  sellAmount: BigNumber | undefined,
  buyAmount: BigNumber | undefined,
  soldToken: Token | undefined,
  boughtToken: Token | undefined,
): Maybe<SellOrder> => {
  if (!sellAmount || !buyAmount || !soldToken || !boughtToken) {
    return null
  }
  return {
    sellAmount: new TokenAmount(soldToken, sellAmount.toString()),
    buyAmount: new TokenAmount(boughtToken, buyAmount.toString()),
  }
}

export function useOrderPlacementState(): AppState['orderPlacement'] {
  return useSelector<AppState, AppState['orderPlacement']>((state) => state.orderPlacement)
}

export function useSwapActionHandlers(): {
  onUserSellAmountInput: (sellAmount: string) => void
  onUserPriceInput: (price: string, isInvertedPrice: boolean) => void
  onInvertPrices: () => void
} {
  const dispatch = useDispatch<AppDispatch>()

  const onUserSellAmountInput = useCallback(
    (sellAmount: string) => {
      if (isNumeric(sellAmount)) dispatch(resetUserVolume({ volume: parseFloat(sellAmount) }))
      dispatch(sellAmountInput({ sellAmount }))
    },
    [dispatch],
  )
  const onInvertPrices = useCallback(() => {
    dispatch(invertPrice())
  }, [dispatch])

  const onUserPriceInput = useCallback(
    (price: string, isInvertedPrice: boolean) => {
      if (isNumeric(price)) {
        dispatch(
          resetUserPrice({
            price: isInvertedPrice
              ? parseFloat(getInverse(Number(price), NUMBER_OF_DIGITS_FOR_INVERSION).toString())
              : parseFloat(price),
          }),
        )
      }
      dispatch(priceInput({ price }))
    },
    [dispatch],
  )

  return { onUserPriceInput, onUserSellAmountInput, onInvertPrices }
}

function isNumeric(str: string) {
  return str != '' && str != '-'
}

export function tryParseAmount(value?: string, token?: Token): TokenAmount | undefined {
  if (!value || !token) {
    return
  }
  try {
    const sellAmountParsed = parseUnits(value, token.decimals).toString()
    if (sellAmountParsed !== '0') {
      return new TokenAmount(token, JSBI.BigInt(sellAmountParsed))
    }
  } catch (error) {
    // should fail if the user specifies too many decimal places of precision (or maybe exceed max uint?)
    logger.debug(`Failed to parse input amount: "${value}"`, error)
  }

  return
}

interface Errors {
  errorAmount: string | undefined
  errorPrice: string | undefined
}

export const useGetOrderPlacementError = (
  derivedAuctionInfo: DerivedAuctionInfo,
  auctionState: AuctionState,
  auctionIdentifier: AuctionIdentifier,
  showPricesInverted: boolean,
): Errors => {
  const { account } = useActiveWeb3React()
  const { chainId } = auctionIdentifier
  const { price: priceFromState, sellAmount } = useOrderPlacementState()
  const price = showPricesInverted
    ? getInverse(Number(priceFromState), NUMBER_OF_DIGITS_FOR_INVERSION).toString()
    : priceFromState
  const relevantTokenBalances = useTokenBalancesTreatWETHAsETHonXDAI(account ?? undefined, [
    derivedAuctionInfo?.biddingToken,
  ])
  const biddingTokenBalance =
    relevantTokenBalances?.[derivedAuctionInfo?.biddingToken?.address ?? '']
  const parsedBiddingAmount = tryParseAmount(sellAmount, derivedAuctionInfo?.biddingToken)
  const { buyAmountScaled, sellAmountScaled } = convertPriceIntoBuyAndSellAmount(
    derivedAuctionInfo?.auctioningToken,
    derivedAuctionInfo?.biddingToken,
    price === '-' ? '1' : price,
    sellAmount,
  )
  const [balanceIn, amountIn] = [biddingTokenBalance, parsedBiddingAmount]

  const amountMustBeBigger =
    amountIn &&
    price &&
    derivedAuctionInfo?.minBiddingAmountPerOrder &&
    derivedAuctionInfo?.biddingToken &&
    sellAmount &&
    (!sellAmountScaled ||
      (sellAmountScaled &&
        BigNumber.from(derivedAuctionInfo?.minBiddingAmountPerOrder).gte(sellAmountScaled)) ||
      parseFloat(sellAmount) == 0) &&
    `Amount must be bigger than
      ${new Fraction(
        derivedAuctionInfo?.minBiddingAmountPerOrder,
        BigNumber.from(10).pow(derivedAuctionInfo?.biddingToken.decimals).toString(),
      ).toSignificant(2)}`

  const insufficientBalance =
    balanceIn &&
    amountIn &&
    balanceIn.lessThan(amountIn) &&
    `Insufficient ${getTokenDisplay(amountIn.token, chainId)}` + ' balance.'

  const outOfBoundsPricePlacingOrder =
    amountIn &&
    price &&
    derivedAuctionInfo?.clearingPriceSellOrder !== null &&
    derivedAuctionInfo?.clearingPrice !== null &&
    derivedAuctionInfo?.auctioningToken !== undefined &&
    derivedAuctionInfo?.biddingToken !== undefined &&
    auctionState === AuctionState.ORDER_PLACING &&
    buyAmountScaled &&
    sellAmountScaled
      ?.mul(derivedAuctionInfo?.clearingPriceSellOrder?.buyAmount.raw.toString())
      .lte(
        buyAmountScaled.mul(derivedAuctionInfo?.clearingPriceSellOrder?.sellAmount.raw.toString()),
      )
      ? showPricesInverted
        ? `Price must be lower than ${derivedAuctionInfo?.clearingPrice?.invert().toSignificant(5)}`
        : `Price must be higher than ${derivedAuctionInfo?.clearingPrice?.toSignificant(5)}`
      : undefined

  const outOfBoundsPrice =
    amountIn &&
    price &&
    derivedAuctionInfo?.initialAuctionOrder !== null &&
    derivedAuctionInfo?.auctioningToken !== undefined &&
    derivedAuctionInfo?.biddingToken !== undefined &&
    buyAmountScaled &&
    sellAmountScaled
      ?.mul(derivedAuctionInfo?.initialAuctionOrder?.sellAmount.raw.toString())
      .lte(buyAmountScaled.mul(derivedAuctionInfo?.initialAuctionOrder?.buyAmount.raw.toString()))
      ? showPricesInverted
        ? `Price must be lower than ${derivedAuctionInfo?.initialPrice?.invert().toSignificant(5)}`
        : `Price must be higher than ${derivedAuctionInfo?.initialPrice?.toSignificant(5)}`
      : undefined

  const errorAmount = amountMustBeBigger || insufficientBalance || undefined
  const errorPrice = outOfBoundsPricePlacingOrder || outOfBoundsPrice || undefined

  return {
    errorAmount,
    errorPrice,
  }
}

export function useDeriveAuctioningAndBiddingToken(
  auctionIdentifer: AuctionIdentifier,
): {
  auctioningToken: Token | undefined
  biddingToken: Token | undefined
} {
  const { chainId } = auctionIdentifer
  const { auctionDetails } = useAuctionDetails(auctionIdentifer)

  const auctioningToken = useMemo(
    () =>
      chainId == undefined || !auctionDetails
        ? undefined
        : new Token(
            chainId as ChainId,
            auctionDetails.addressAuctioningToken,
            parseInt(auctionDetails.decimalsAuctioningToken, 16),
            auctionDetails.symbolAuctioningToken,
          ),
    [chainId, auctionDetails],
  )

  const biddingToken = useMemo(
    () =>
      chainId == undefined || !auctionDetails
        ? undefined
        : new Token(
            chainId as ChainId,
            auctionDetails.addressBiddingToken,
            parseInt(auctionDetails.decimalsBiddingToken, 16),
            auctionDetails.symbolBiddingToken,
          ),
    [chainId, auctionDetails],
  )

  return {
    auctioningToken,
    biddingToken,
  }
}

export interface DerivedAuctionInfo {
  auctioningToken: Token | undefined
  biddingToken: Token | undefined
  clearingPriceSellOrder: Maybe<SellOrder>
  clearingPriceOrder: Order | undefined
  clearingPrice: Fraction | undefined
  initialAuctionOrder: Maybe<SellOrder>
  auctionEndDate: number | undefined
  auctionStartDate: number | undefined
  clearingPriceVolume: BigNumber | undefined
  initialPrice: Fraction | undefined
  minBiddingAmountPerOrder: string | undefined
  orderCancellationEndDate: number | undefined
  auctionState: AuctionState | null | undefined
}

export function useDerivedAuctionInfo(
  auctionIdentifier: AuctionIdentifier,
): Maybe<DerivedAuctionInfo> | undefined {
  const { chainId } = auctionIdentifier
  const { auctionDetails, auctionInfoLoading } = useAuctionDetails(auctionIdentifier)
  const { clearingPriceInfo, loadingClearingPrice } = useClearingPriceInfo(auctionIdentifier)

  const isLoading = auctionInfoLoading || loadingClearingPrice
  const noAuctionData = !auctionDetails || !clearingPriceInfo
  const [auctionState, setAuctionState] = useState<Maybe<AuctionState>>()

  // update auction state when end date auction or cancellation time is up
  useEffect(() => {
    if (!auctionDetails || !clearingPriceInfo) {
      return
    }

    const getCurrentState = () => deriveAuctionState(auctionDetails, clearingPriceInfo).auctionState
    setAuctionState(getCurrentState())
    const timeLeftEndAuction = calculateTimeLeft(auctionDetails.endTimeTimestamp)
    const timeLeftCancellationOrder = calculateTimeLeft(
      auctionDetails.orderCancellationEndDate as number,
    )

    const updateStatusWhenTimeIsUp = (remainingAuctionTimes: Array<number>) => {
      const timersId = remainingAuctionTimes
        .map((timeLeft) => {
          if (timeLeft < 0) {
            return
          }
          return setTimeout(() => {
            setAuctionState(getCurrentState())
          }, timeLeft * 1000)
        })
        .filter(isTimeout)
      return timersId
    }
    const timerEventsId = updateStatusWhenTimeIsUp([timeLeftCancellationOrder, timeLeftEndAuction])

    return () => {
      timerEventsId.map((timerId) => clearTimeout(timerId))
    }
  }, [auctionDetails, clearingPriceInfo, noAuctionData])

  if (isLoading) {
    return null
  } else if (noAuctionData) {
    return undefined
  }

  const auctioningToken = !auctionDetails
    ? undefined
    : new Token(
        chainId as ChainId,
        auctionDetails.addressAuctioningToken,
        parseInt(auctionDetails.decimalsAuctioningToken, 16),
        auctionDetails.symbolAuctioningToken,
      )

  const biddingToken = !auctionDetails
    ? undefined
    : new Token(
        chainId as ChainId,
        auctionDetails.addressBiddingToken,
        parseInt(auctionDetails.decimalsBiddingToken, 16),
        auctionDetails.symbolBiddingToken,
      )

  const clearingPriceVolume = clearingPriceInfo?.volume

  const initialAuctionOrder: Maybe<SellOrder> = decodeSellOrder(
    auctionDetails?.exactOrder,
    auctioningToken,
    biddingToken,
  )

  const clearingPriceOrder: Order | undefined = clearingPriceInfo?.clearingOrder

  const clearingPriceSellOrder: Maybe<SellOrder> = decodeSellOrderFromAPI(
    clearingPriceOrder?.sellAmount,
    clearingPriceOrder?.buyAmount,
    biddingToken,
    auctioningToken,
  )

  const minBiddingAmountPerOrder = BigNumber.from(
    auctionDetails?.minimumBiddingAmountPerOrder ?? 0,
  ).toString()

  const clearingPrice: Fraction | undefined = orderToPrice(clearingPriceSellOrder)

  let initialPrice: Fraction | undefined
  if (initialAuctionOrder?.buyAmount == undefined) {
    initialPrice = undefined
  } else {
    initialPrice = new Fraction(
      BigNumber.from(initialAuctionOrder?.buyAmount?.raw.toString())
        .mul(BigNumber.from('10').pow(initialAuctionOrder?.sellAmount?.token.decimals))
        .toString(),
      BigNumber.from(initialAuctionOrder?.sellAmount?.raw.toString())
        .mul(BigNumber.from('10').pow(initialAuctionOrder?.buyAmount?.token.decimals))
        .toString(),
    )
  }
  return {
    auctioningToken,
    biddingToken,
    clearingPriceSellOrder,
    clearingPriceOrder,
    clearingPrice,
    initialAuctionOrder,
    auctionStartDate: auctionDetails?.startingTimestamp,
    auctionEndDate: auctionDetails?.endTimeTimestamp,
    clearingPriceVolume,
    initialPrice,
    minBiddingAmountPerOrder,
    orderCancellationEndDate: auctionDetails?.orderCancellationEndDate,
    auctionState,
  }
}

export function deriveAuctionState(
  auctionDetails: AuctionInfoDetail | null | undefined,
  clearingPriceInfo: ClearingPriceAndVolumeData | null | undefined,
): {
  auctionState: Maybe<AuctionState>
} {
  const auctioningTokenAddress: string | undefined = auctionDetails?.addressAuctioningToken

  let auctionState: Maybe<AuctionState> = null
  if (!auctioningTokenAddress) {
    auctionState = AuctionState.NOT_YET_STARTED
  } else {
    const clearingPriceOrder: Order | undefined = clearingPriceInfo?.clearingOrder

    const auctionEndDate = auctionDetails?.endTimeTimestamp
    const orderCancellationEndDate = auctionDetails?.orderCancellationEndDate

    let clearingPrice: Fraction | undefined
    if (
      !clearingPriceOrder ||
      clearingPriceOrder.buyAmount == undefined ||
      clearingPriceOrder.sellAmount == undefined
    ) {
      clearingPrice = undefined
    } else {
      clearingPrice = new Fraction(
        clearingPriceOrder.sellAmount.toString(),
        clearingPriceOrder.buyAmount.toString(),
      )
    }

    if (auctionEndDate && auctionEndDate > new Date().getTime() / 1000) {
      auctionState = AuctionState.ORDER_PLACING
      if (orderCancellationEndDate && orderCancellationEndDate >= new Date().getTime() / 1000) {
        auctionState = AuctionState.ORDER_PLACING_AND_CANCELING
      }
    } else {
      if (clearingPrice?.toSignificant(1) == '0') {
        auctionState = AuctionState.PRICE_SUBMISSION
      } else {
        if (clearingPrice) auctionState = AuctionState.CLAIMING
      }
    }
  }
  return { auctionState }
}

export function useDerivedClaimInfo(
  auctionIdentifier: AuctionIdentifier,
): {
  auctioningToken?: Token | undefined
  biddingToken?: Token | undefined
  error?: string | undefined
  isLoading: boolean
} {
  const { auctionId, chainId } = auctionIdentifier

  const easyAuctionInstance: Maybe<Contract> = useContract(
    EASY_AUCTION_NETWORKS[chainId as ChainId],
    easyAuctionABI,
  )

  const {
    loading: isLoadingAuctionInfo,
    result: auctionInfo,
  } = useSingleCallResult(easyAuctionInstance, 'auctionData', [auctionId])
  const auctioningTokenAddress: string | undefined = auctionInfo?.auctioningToken.toString()

  const biddingTokenAddress: string | undefined = auctionInfo?.biddingToken.toString()

  const {
    isLoading: isAuctioningTokenLoading,
    token: auctioningToken,
  } = useTokenByAddressAndAutomaticallyAdd(auctioningTokenAddress)
  const {
    isLoading: isBiddingTokenLoading,
    token: biddingToken,
  } = useTokenByAddressAndAutomaticallyAdd(biddingTokenAddress)

  const clearingPriceSellOrder: Maybe<SellOrder> = decodeSellOrder(
    auctionInfo?.clearingPriceOrder,
    biddingToken,
    auctioningToken,
  )

  const { claimInfo, loading: isLoadingClaimInfo } = useGetClaimInfo(auctionIdentifier)
  const claimableOrders = claimInfo?.sellOrdersFormUser
  const { loading: isLoadingClaimed, result: claimed } = useSingleCallResult(
    easyAuctionInstance,
    'containsOrder',
    [
      auctionId,
      claimableOrders == undefined || claimableOrders[0] == undefined
        ? encodeOrder({
            sellAmount: BigNumber.from(0),
            buyAmount: BigNumber.from(0),
            userId: BigNumber.from(0),
          })
        : claimableOrders[0],
    ],
  )

  const error =
    clearingPriceSellOrder && clearingPriceSellOrder.buyAmount.raw.toString() === '0'
      ? 'Price not yet supplied to auction.'
      : claimableOrders && claimableOrders.length > 0 && claimed && !claimed[0]
      ? 'You already claimed your funds.'
      : claimableOrders && claimableOrders.length === 0
      ? 'You had no participation on this auction.'
      : ''

  const isLoading =
    isLoadingAuctionInfo ||
    isAuctioningTokenLoading ||
    isBiddingTokenLoading ||
    isLoadingClaimInfo ||
    isLoadingClaimed

  return {
    auctioningToken,
    biddingToken,
    error,
    isLoading,
  }
}

// updates the swap state to use the defaults for a given network whenever the query
// string updates
export function useDefaultsFromURLSearch(search: string) {
  const { chainId } = useActiveWeb3React()
  const dispatch = useDispatch<AppDispatch>()
  useEffect(() => {
    if (!chainId) return
    dispatch(setDefaultsFromURLSearch({ queryString: search }))
  }, [dispatch, search, chainId])
}

// updates the swap state to use the defaults for a given network whenever the query
// string updates
export function useSetNoDefaultNetworkId() {
  const dispatch = useDispatch<AppDispatch>()
  useEffect(() => {
    dispatch(setNoDefaultNetworkId())
  }, [dispatch])
}

export function useAllUserOrders(
  auctionIdentifier: AuctionIdentifier,
  derivedAuctionInfo: DerivedAuctionInfo,
) {
  const { account } = useActiveWeb3React()
  const { auctionId, chainId } = auctionIdentifier
  const { onResetOrder } = useOrderActionHandlers()

  useEffect(() => {
    let cancelled = false
    async function fetchData() {
      if (
        !chainId ||
        !account ||
        !derivedAuctionInfo?.biddingToken ||
        !derivedAuctionInfo?.auctioningToken
      ) {
        return
      }

      let sellOrdersFormUser: string[] = []

      try {
        sellOrdersFormUser = await additionalServiceApi.getAllUserOrders({
          networkId: chainId,
          auctionId,
          user: account,
        })
      } catch (error) {
        logger.error('Error getting current orders: ', error)
      }

      const sellOrderDisplays: OrderDisplay[] = []
      for (const orderString of sellOrdersFormUser) {
        const order = decodeOrder(orderString)

        // in some of the orders the buyAmount field is zero
        if (order.buyAmount.isZero()) {
          logger.error(`Order buyAmount shouldn't be zero`)
          continue
        }

        sellOrderDisplays.push({
          id: orderString,
          sellAmount: new Fraction(
            order.sellAmount.toString(),
            BigNumber.from(10).pow(derivedAuctionInfo?.biddingToken.decimals).toString(),
          ).toSignificant(6),
          price: new Fraction(
            order.sellAmount
              .mul(BigNumber.from(10).pow(derivedAuctionInfo.auctioningToken.decimals))
              .toString(),
            order.buyAmount
              .mul(BigNumber.from(10).pow(derivedAuctionInfo.biddingToken.decimals))
              .toString(),
          ).toSignificant(6),
          chainId,
          status: OrderStatus.PLACED,
        })
      }
      if (!cancelled) onResetOrder(sellOrderDisplays)
    }
    fetchData()
    return (): void => {
      cancelled = true
    }
  }, [
    chainId,
    account,
    auctionId,
    onResetOrder,
    derivedAuctionInfo?.auctioningToken,
    derivedAuctionInfo?.biddingToken,
  ])
}
