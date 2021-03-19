import { useCallback, useEffect, useMemo, useState } from 'react'
import { ChainId, Fraction, JSBI, Token, TokenAmount } from 'uniswap-xdai-sdk'

import { BigNumber } from '@ethersproject/bignumber'
import { Contract } from '@ethersproject/contracts'
import { parseUnits } from '@ethersproject/units'
import { useDispatch, useSelector } from 'react-redux'

import { additionalServiceApi } from '../../api'
import { EASY_AUCTION_NETWORKS } from '../../constants'
import easyAuctionABI from '../../constants/abis/easyAuction/easyAuction.json'
import { useActiveWeb3React } from '../../hooks'
import { Order, decodeOrder, encodeOrder } from '../../hooks/Order'
import { useTokenByAddressAndAutomaticallyAdd } from '../../hooks/Tokens'
import { useAuctionDetails } from '../../hooks/useAuctionDetails'
import { useGetClaimInfo } from '../../hooks/useClaimOrderCallback'
import { useContract } from '../../hooks/useContract'
import { useClearingPriceInfo } from '../../hooks/useCurrentClearingOrderAndVolumeCallback'
import { convertPriceIntoBuyAndSellAmount } from '../../utils/prices'
import { AppDispatch, AppState } from '../index'
import { useSingleCallResult } from '../multicall/hooks'
import { resetUserPrice, resetUserVolume } from '../orderbook/actions'
import { useOrderActionHandlers } from '../orders/hooks'
import { OrderDisplay, OrderStatus } from '../orders/reducer'
import { useTokenBalances } from '../wallet/hooks'
import {
  priceInput,
  sellAmountInput,
  setDefaultsFromURLSearch,
  setNoDefaultNetworkId,
} from './actions'

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
    return new Fraction(order.sellAmount.raw.toString(), order.buyAmount.raw.toString())
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

export function useSwapState(): AppState['swap'] {
  return useSelector<AppState, AppState['swap']>((state) => state.swap)
}

export function useSwapActionHandlers(): {
  onUserSellAmountInput: (sellAmount: string) => void
  onUserPriceInput: (price: string) => void
} {
  const dispatch = useDispatch<AppDispatch>()

  const onUserSellAmountInput = useCallback(
    (sellAmount: string) => {
      if (isNumeric(sellAmount)) dispatch(resetUserVolume({ volume: parseFloat(sellAmount) }))
      dispatch(sellAmountInput({ sellAmount }))
    },
    [dispatch],
  )
  const onUserPriceInput = useCallback(
    (price: string) => {
      if (isNumeric(price)) {
        dispatch(resetUserPrice({ price: parseFloat(price) }))
      }
      dispatch(priceInput({ price }))
    },
    [dispatch],
  )

  return { onUserPriceInput, onUserSellAmountInput }
}

function isNumeric(str: string) {
  return str != '' && str != '-'
}

// try to parse a user entered amount for a given token
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
    // eslint-disable-next-line no-console
    console.debug(`Failed to parse input amount: "${value}"`, error)
  }
  // necessary for all paths to return a value
  return
}

export function useGetOrderPlacementError(): {
  error?: string
} {
  const derivedAuctionInfo = useDerivedAuctionInfo()

  const { account } = useActiveWeb3React()

  const { price, sellAmount } = useSwapState()

  const relevantTokenBalances = useTokenBalances(account ?? undefined, [
    derivedAuctionInfo?.biddingToken,
  ])
  const biddingTokenBalance =
    relevantTokenBalances?.[derivedAuctionInfo?.biddingToken?.address ?? '']
  const parsedBiddingAmount = tryParseAmount(sellAmount, derivedAuctionInfo?.biddingToken)

  const { buyAmountScaled, sellAmountScaled } = convertPriceIntoBuyAndSellAmount(
    derivedAuctionInfo?.auctioningToken,
    derivedAuctionInfo?.biddingToken,
    price == '-' ? '1' : price,
    sellAmount,
  )
  let error: string | undefined

  if (!sellAmount) {
    error = error ?? 'Enter an amount'
  }

  if (
    derivedAuctionInfo?.minBiddingAmountPerOrder &&
    derivedAuctionInfo?.biddingToken &&
    sellAmount &&
    ((sellAmountScaled &&
      BigNumber.from(derivedAuctionInfo?.minBiddingAmountPerOrder).gte(sellAmountScaled)) ||
      parseFloat(sellAmount) == 0)
  ) {
    const errorMsg =
      'Amount must be bigger than ' +
      new Fraction(
        derivedAuctionInfo?.minBiddingAmountPerOrder,
        BigNumber.from(10).pow(derivedAuctionInfo?.biddingToken.decimals).toString(),
      ).toSignificant(2)
    error = error ?? errorMsg
  }

  if (!price) {
    error = error ?? 'Enter a price'
  }
  if (
    derivedAuctionInfo?.auctioningToken == undefined ||
    derivedAuctionInfo?.biddingToken == undefined
  ) {
    error = 'Please wait a sec'
  }
  if (
    derivedAuctionInfo?.initialAuctionOrder != null &&
    derivedAuctionInfo?.auctioningToken != undefined &&
    derivedAuctionInfo?.biddingToken != undefined &&
    buyAmountScaled &&
    sellAmountScaled
      ?.mul(derivedAuctionInfo?.initialAuctionOrder?.sellAmount.raw.toString())
      .lte(buyAmountScaled.mul(derivedAuctionInfo?.initialAuctionOrder?.buyAmount.raw.toString()))
  ) {
    error =
      error ?? 'Price must be higher than ' + derivedAuctionInfo?.initialPrice?.toSignificant(5)
  }

  const [balanceIn, amountIn] = [biddingTokenBalance, parsedBiddingAmount]
  if (balanceIn && amountIn && balanceIn.lessThan(amountIn)) {
    error = 'Insufficient ' + amountIn.token.symbol + ' balance'
  }

  return {
    error,
  }
}

export function useDeriveAuctioningAndBiddingToken(): {
  auctioningToken: Token | undefined
  biddingToken: Token | undefined
} {
  const { chainId } = useSwapState()
  const { auctionDetails } = useAuctionDetails()

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
  biddingTokenBalance: TokenAmount | undefined
  parsedBiddingAmount: TokenAmount | undefined
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
}

export function useDerivedAuctionInfo(): Maybe<DerivedAuctionInfo> {
  const { account } = useActiveWeb3React()

  const { sellAmount } = useSwapState()
  const { auctioningToken, biddingToken } = useDeriveAuctioningAndBiddingToken()
  const { auctionDetails, auctionInfoLoading } = useAuctionDetails()
  const { clearingPriceInfo, loadingClearingPrice } = useClearingPriceInfo()
  const relevantTokenBalances = useTokenBalances(account ?? undefined, [biddingToken])

  if (auctionInfoLoading || loadingClearingPrice) {
    return null
  }
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

  const biddingTokenBalance = relevantTokenBalances?.[biddingToken?.address ?? '']
  const parsedBiddingAmount = tryParseAmount(sellAmount, biddingToken)

  const clearingPrice: Fraction | undefined = orderToPrice(clearingPriceSellOrder)

  let initialPrice: Fraction | undefined
  if (initialAuctionOrder?.buyAmount == undefined) {
    initialPrice = undefined
  } else {
    initialPrice = new Fraction(
      initialAuctionOrder?.buyAmount?.raw.toString(),
      initialAuctionOrder?.sellAmount?.raw.toString(),
    )
  }
  return {
    biddingTokenBalance,
    parsedBiddingAmount,
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
  }
}

export function useDerivedAuctionState(): {
  auctionState: Maybe<AuctionState>
  loading: boolean
} {
  const [auctionState, setAuctionState] = useState<Maybe<AuctionState>>(null)
  const [loading, setLoading] = useState<boolean>(true)

  const { auctionDetails, auctionInfoLoading } = useAuctionDetails()
  const { clearingPriceInfo, loadingClearingPrice } = useClearingPriceInfo()

  useEffect(() => {
    const auctioningTokenAddress: string | undefined = auctionDetails?.addressAuctioningToken
    setLoading(true)
    if (!auctionInfoLoading && !loadingClearingPrice) {
      if (!auctioningTokenAddress) {
        setAuctionState(AuctionState.NOT_YET_STARTED)
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

        let auctionState: Maybe<AuctionState> = null
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
        setAuctionState(auctionState)
      }
      setLoading(false)
    }
  }, [auctionDetails, clearingPriceInfo, loadingClearingPrice, auctionInfoLoading])

  return {
    auctionState,
    loading,
  }
}

export function useDerivedClaimInfo(
  auctionId: number,
): {
  error?: string
  auctioningToken?: Maybe<Token>
  biddingToken?: Maybe<Token>
  claimauctioningToken?: Maybe<TokenAmount>
  claimbiddingToken?: Maybe<TokenAmount>
} {
  const { chainId } = useActiveWeb3React()

  const easyAuctionInstance: Maybe<Contract> = useContract(
    EASY_AUCTION_NETWORKS[chainId as ChainId],
    easyAuctionABI,
  )

  const auctionInfo = useSingleCallResult(easyAuctionInstance, 'auctionData', [auctionId]).result
  const auctioningTokenAddress: string | undefined = auctionInfo?.auctioningToken.toString()

  const auctionEndDate = auctionInfo?.auctionEndDate

  const biddingTokenAddress: string | undefined = auctionInfo?.biddingToken.toString()

  const auctioningToken = useTokenByAddressAndAutomaticallyAdd(auctioningTokenAddress)
  const biddingToken = useTokenByAddressAndAutomaticallyAdd(biddingTokenAddress)
  const clearingPriceSellOrder: Maybe<SellOrder> = decodeSellOrder(
    auctionInfo?.clearingPriceOrder,
    biddingToken,
    auctioningToken,
  )

  let error: string | undefined = ''

  const claimableOrders = useGetClaimInfo()?.sellOrdersFormUser
  const claimed = useSingleCallResult(easyAuctionInstance, 'containsOrder', [
    auctionId,
    claimableOrders == undefined || claimableOrders[0] == undefined
      ? encodeOrder({
          sellAmount: BigNumber.from(0),
          buyAmount: BigNumber.from(0),
          userId: BigNumber.from(0),
        })
      : claimableOrders[0],
  ]).result

  if (clearingPriceSellOrder?.buyAmount.raw.toString() === '0') {
    error = 'Price not yet supplied to auction.'
  } else if (auctionEndDate >= new Date().getTime() / 1000) {
    error = 'Auction has not yet ended.'
  } else if (claimableOrders === undefined || claimableOrders?.length > 0) {
    if (!claimed || !claimed[0]) {
      error = 'You already claimed your funds.'
    }
  } else if (claimableOrders?.length === 0) {
    error = 'You had no participation on this auction.'
  }

  return {
    error,
    auctioningToken,
    biddingToken,
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

export function useCurrentUserOrders() {
  const { account } = useActiveWeb3React()
  const { auctionId, chainId } = useSwapState()
  const derivedAuctionInfo = useDerivedAuctionInfo()
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
        sellOrdersFormUser = await additionalServiceApi.getCurrentUserOrders({
          networkId: chainId,
          auctionId,
          user: account,
        })
      } catch (error) {
        console.error('Error getting current orders: ', error)
      }

      const sellOrderDisplays: OrderDisplay[] = []
      for (const orderString of sellOrdersFormUser) {
        const order = decodeOrder(orderString)

        // in some of the orders the buyAmount field is zero
        if (order.buyAmount.isZero()) {
          console.error(`Order buyAmount shouldn't be zero`)
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
