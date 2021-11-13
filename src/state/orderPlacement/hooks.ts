import { useCallback, useEffect, useMemo, useRef, useState } from 'react'

import { BigNumber } from '@ethersproject/bignumber'
import { Contract } from '@ethersproject/contracts'
import { parseUnits } from '@ethersproject/units'
import { Fraction, JSBI, Token, TokenAmount } from '@josojo/honeyswap-sdk'
import { useDispatch, useSelector } from 'react-redux'

import { additionalServiceApi } from '../../api'
import easyAuctionABI from '../../constants/abis/easyAuction/easyAuction.json'
import { NUMBER_OF_DIGITS_FOR_INVERSION } from '../../constants/config'
import { useActiveWeb3React } from '../../hooks'
import { Order, decodeOrder } from '../../hooks/Order'
import { useTokenByAddressAndAutomaticallyAdd } from '../../hooks/Tokens'
import { AuctionInfoDetail, useAuctionDetails } from '../../hooks/useAuctionDetails'
import { ClaimState } from '../../hooks/useClaimOrderCallback'
import { useContract } from '../../hooks/useContract'
import { useClearingPriceInfo } from '../../hooks/useCurrentClearingOrderAndVolumeCallback'
import { ChainId, EASY_AUCTION_NETWORKS, getFullTokenDisplay, isTimeout } from '../../utils'
import { getLogger } from '../../utils/logger'
import { convertPriceIntoBuyAndSellAmount, getInverse } from '../../utils/prices'
import { calculateTimeLeft } from '../../utils/tools'
import { AppDispatch, AppState } from '../index'
import { useSingleCallResult } from '../multicall/hooks'
import { resetUserPrice, resetUserVolume } from '../orderbook/actions'
import { useOrderActionHandlers } from '../orders/hooks'
import { OrderDisplay, OrderStatus } from '../orders/reducer'
import { useTokenBalancesTreatWETHAsETH } from '../wallet/hooks'
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
              ? parseFloat(getInverse(price, NUMBER_OF_DIGITS_FOR_INVERSION))
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
interface AuctionInfoDefined
  extends Omit<DerivedAuctionInfo, 'minBiddingAmountPerOrder' | 'biddingToken'> {
  minBiddingAmountPerOrder: string
  biddingToken: Token
}

export const useGetOrderPlacementError = (
  derivedAuctionInfo: AuctionInfoDefined,
  auctionState: AuctionState,
  auctionIdentifier: AuctionIdentifier,
  showPricesInverted: boolean,
): Errors => {
  const { account } = useActiveWeb3React()
  const { chainId } = auctionIdentifier
  const { price: priceFromState, sellAmount } = useOrderPlacementState()
  const price = showPricesInverted
    ? getInverse(priceFromState, NUMBER_OF_DIGITS_FOR_INVERSION)
    : priceFromState
  const relevantTokenBalances = useTokenBalancesTreatWETHAsETH(account ?? undefined, [
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
    price !== '0' &&
    price !== '.' &&
    price !== 'Infinity' &&
    sellAmount &&
    ((sellAmountScaled &&
      BigNumber.from(derivedAuctionInfo?.minBiddingAmountPerOrder).gte(sellAmountScaled)) ||
      parseFloat(sellAmount) == 0) &&
    `Amount must be bigger than
      ${new Fraction(
        derivedAuctionInfo?.minBiddingAmountPerOrder,
        BigNumber.from(10).pow(derivedAuctionInfo?.biddingToken.decimals).toString(),
      ).toSignificant(2)}`

  const invalidAmount = sellAmount && !amountIn && `Invalid Amount`
  const insufficientBalance =
    balanceIn &&
    amountIn &&
    balanceIn.lessThan(amountIn) &&
    `Insufficient ${getFullTokenDisplay(amountIn.token, chainId)}` + ' balance.'

  const messageHigherInitialPrice = `Price must be higher than ${derivedAuctionInfo?.initialPrice?.toSignificant(
    5,
  )}`
  const messageHigherClearingPrice = `Price must be higher than ${derivedAuctionInfo?.clearingPrice?.toSignificant(
    5,
  )}`
  const messageMinimunPrice = () =>
    showPricesInverted
      ? `Price must be higher than 0`
      : auctionState === AuctionState.ORDER_PLACING
      ? messageHigherClearingPrice
      : messageHigherInitialPrice

  const priceEqualsZero =
    amountIn && price && (price === '0' || price === 'Infinity' || price === '.' || price === '0.')
      ? messageMinimunPrice()
      : undefined
  const invalidSellAmount =
    sellAmount && amountIn && price && !sellAmountScaled && `Invalid bidding price`
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
        : messageHigherClearingPrice
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
        : messageHigherInitialPrice
      : undefined

  const errorAmount = amountMustBeBigger || insufficientBalance || invalidAmount || undefined
  const errorPrice =
    priceEqualsZero ||
    outOfBoundsPricePlacingOrder ||
    outOfBoundsPrice ||
    invalidSellAmount ||
    undefined

  return {
    errorAmount,
    errorPrice,
  }
}

export function useDeriveAuctioningAndBiddingToken(auctionIdentifer: AuctionIdentifier): {
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
  const auctionState = useDeriveAuctionState(auctionDetails)

  const isLoading = auctionInfoLoading || loadingClearingPrice
  const noAuctionData = !auctionDetails || !clearingPriceInfo

  const auctioningToken = useMemo(
    () =>
      !auctionDetails
        ? undefined
        : new Token(
            chainId as ChainId,
            auctionDetails.addressAuctioningToken,
            parseInt(auctionDetails.decimalsAuctioningToken, 16),
            auctionDetails.symbolAuctioningToken,
          ),
    [auctionDetails, chainId],
  )

  const biddingToken = useMemo(
    () =>
      !auctionDetails
        ? undefined
        : new Token(
            chainId as ChainId,
            auctionDetails.addressBiddingToken,
            parseInt(auctionDetails.decimalsBiddingToken, 16),
            auctionDetails.symbolBiddingToken,
          ),
    [auctionDetails, chainId],
  )

  const clearingPriceVolume = clearingPriceInfo?.volume

  const initialAuctionOrder: Maybe<SellOrder> = useMemo(
    () => decodeSellOrder(auctionDetails?.exactOrder, auctioningToken, biddingToken),
    [auctionDetails, auctioningToken, biddingToken],
  )

  const clearingPriceOrder: Order | undefined = clearingPriceInfo?.clearingOrder

  const clearingPriceSellOrder: Maybe<SellOrder> = useMemo(
    () =>
      decodeSellOrderFromAPI(
        clearingPriceOrder?.sellAmount,
        clearingPriceOrder?.buyAmount,
        biddingToken,
        auctioningToken,
      ),
    [clearingPriceOrder, biddingToken, auctioningToken],
  )

  const minBiddingAmountPerOrder = useMemo(
    () => BigNumber.from(auctionDetails?.minimumBiddingAmountPerOrder ?? 0).toString(),
    [auctionDetails],
  )

  const clearingPrice: Fraction | undefined = useMemo(
    () => orderToPrice(clearingPriceSellOrder),
    [clearingPriceSellOrder],
  )

  const initialPrice = useMemo(() => {
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
    return initialPrice
  }, [initialAuctionOrder])

  if (isLoading) {
    return null
  } else if (noAuctionData) {
    return undefined
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

export function useDeriveAuctionState(
  auctionDetails: AuctionInfoDetail | null | undefined,
): Maybe<AuctionState> {
  const [currentState, setCurrentState] = useState<Maybe<AuctionState>>(null)
  const { clearingPriceSellOrder } = useOnChainAuctionData({
    auctionId: auctionDetails?.auctionId ?? 0,
    chainId: Number(auctionDetails?.chainId ?? '1'),
  })

  const getCurrentState = useCallback(() => {
    const auctioningTokenAddress: string | undefined = auctionDetails?.addressAuctioningToken
    let auctionState: Maybe<AuctionState> = null
    if (!auctioningTokenAddress) {
      auctionState = AuctionState.NOT_YET_STARTED
    } else {
      const auctionEndDate = auctionDetails?.endTimeTimestamp
      const orderCancellationEndDate = auctionDetails?.orderCancellationEndDate

      if (auctionEndDate && auctionEndDate > new Date().getTime() / 1000) {
        auctionState = AuctionState.ORDER_PLACING
        if (orderCancellationEndDate && orderCancellationEndDate >= new Date().getTime() / 1000) {
          auctionState = AuctionState.ORDER_PLACING_AND_CANCELING
        }
      } else {
        if (clearingPriceSellOrder?.buyAmount?.toSignificant(1) == '0') {
          auctionState = AuctionState.PRICE_SUBMISSION
        } else {
          auctionState = AuctionState.CLAIMING
        }
      }
    }

    return auctionState
  }, [auctionDetails, clearingPriceSellOrder])

  useEffect(() => {
    setCurrentState(getCurrentState())
  }, [auctionDetails, getCurrentState])

  useEffect(() => {
    if (!auctionDetails) {
      return
    }

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
            setCurrentState(getCurrentState())
          }, timeLeft * 1000)
        })
        .filter(isTimeout)
      return timersId
    }
    const timerEventsId = updateStatusWhenTimeIsUp([timeLeftCancellationOrder, timeLeftEndAuction])

    return () => {
      timerEventsId.map((timerId) => clearTimeout(timerId))
    }
  }, [auctionDetails, getCurrentState])

  return currentState
}

export function useDerivedClaimInfo(
  auctionIdentifier: AuctionIdentifier,
  claimStatus: ClaimState,
): {
  auctioningToken?: Maybe<Token>
  biddingToken?: Maybe<Token>
  error?: string | undefined
  isLoading: boolean
} {
  const {
    auctioningToken,
    biddingToken,
    clearingPriceSellOrder,
    isLoading: isAuctionDataLoading,
  } = useOnChainAuctionData(auctionIdentifier)

  const error =
    clearingPriceSellOrder?.buyAmount?.raw?.toString() === '0'
      ? 'Waiting for on-chain price calculation.'
      : claimStatus === ClaimState.CLAIMED
      ? 'You already claimed your funds.'
      : claimStatus === ClaimState.NOT_APPLICABLE
      ? 'You had no participation on this auction.'
      : ''

  const isLoading = isAuctionDataLoading || claimStatus === ClaimState.UNKNOWN

  return {
    auctioningToken,
    biddingToken,
    error,
    isLoading,
  }
}

export function useOnChainAuctionData(auctionIdentifier: AuctionIdentifier): {
  auctioningToken?: Maybe<Token>
  biddingToken?: Maybe<Token>
  clearingPriceSellOrder: Maybe<SellOrder>
  isLoading: boolean
} {
  const { auctionId, chainId } = auctionIdentifier

  const easyAuctionInstance: Maybe<Contract> = useContract(
    EASY_AUCTION_NETWORKS[chainId as ChainId],
    easyAuctionABI,
  )

  const { loading: isLoadingAuctionInfo, result: auctionInfo } = useSingleCallResult(
    easyAuctionInstance,
    'auctionData',
    [auctionId],
  )
  const auctioningTokenAddress: string | undefined = auctionInfo?.auctioningToken.toString()

  const biddingTokenAddress: string | undefined = auctionInfo?.biddingToken.toString()

  const { isLoading: isAuctioningTokenLoading, token: auctioningToken } =
    useTokenByAddressAndAutomaticallyAdd(auctioningTokenAddress)
  const { isLoading: isBiddingTokenLoading, token: biddingToken } =
    useTokenByAddressAndAutomaticallyAdd(biddingTokenAddress)

  const clearingPriceSellOrder: Maybe<SellOrder> = decodeSellOrder(
    auctionInfo?.clearingPriceOrder,
    biddingToken,
    auctioningToken,
  )

  const isLoading = isLoadingAuctionInfo || isAuctioningTokenLoading || isBiddingTokenLoading

  return {
    auctioningToken,
    biddingToken,
    clearingPriceSellOrder,
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
  const {
    current: { auctioningToken, biddingToken },
  } = useRef(derivedAuctionInfo)

  useEffect(() => {
    let cancelled = false
    async function fetchData() {
      if (!chainId || !account || !biddingToken || !auctioningToken) {
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
            BigNumber.from(10).pow(biddingToken.decimals).toString(),
          ).toSignificant(6),
          price: new Fraction(
            order.sellAmount.mul(BigNumber.from(10).pow(auctioningToken.decimals)).toString(),
            order.buyAmount.mul(BigNumber.from(10).pow(biddingToken.decimals)).toString(),
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
  }, [chainId, account, auctionId, onResetOrder, auctioningToken, biddingToken])
}
