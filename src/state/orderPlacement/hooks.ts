import { useCallback, useEffect } from 'react'
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
import { useGetClaimInfo } from '../../hooks/useClaimOrderCallback'
import { useContract } from '../../hooks/useContract'
import { convertPriceIntoBuyAndSellAmount } from '../../utils/prices'
import { AppDispatch, AppState } from '../index'
import { useSingleCallResult } from '../multicall/hooks'
import { resetUserPrice, resetUserVolume } from '../orderbook/actions'
import { useOrderbookActionHandlers } from '../orderbook/hooks'
import { useOrderActionHandlers, useOrderState } from '../orders/hooks'
import { OrderDisplay, OrderStatus } from '../orders/reducer'
import { useTokenBalances } from '../wallet/hooks'
import { priceInput, sellAmountInput, setDefaultsFromURLSearch } from './actions'

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
  orderBytes: string,
  soldToken: Token | undefined,
  boughtToken: Token | undefined,
): SellOrder | null {
  if (soldToken == undefined || boughtToken == undefined || orderBytes == undefined) {
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

export function useDeriveAuctioningAndBiddingToken(
  auctionId: number,
): { auctioningToken: Token | undefined; biddingToken: Token | undefined } {
  const { chainId } = useActiveWeb3React()

  const easyAuctionInstance: Contract | null = useContract(
    EASY_AUCTION_NETWORKS[chainId as ChainId],
    easyAuctionABI,
  )
  const auctionInfo = useSingleCallResult(easyAuctionInstance, 'auctionData', [auctionId]).result
  const auctioningTokenAddress: string | undefined = auctionInfo?.auctioningToken.toString()

  const biddingTokenAddress: string | undefined = auctionInfo?.biddingToken.toString()

  const auctioningToken = useTokenByAddressAndAutomaticallyAdd(auctioningTokenAddress)
  const biddingToken = useTokenByAddressAndAutomaticallyAdd(biddingTokenAddress)
  return {
    auctioningToken,
    biddingToken,
  }
}

export function useGetOrderPlacementError(): {
  error?: string
} {
  const {
    auctioningToken,
    biddingToken,
    initialAuctionOrder,
    initialPrice,
    minBiddingAmountPerOrder,
  } = useDerivedAuctionInfo()

  const { account } = useActiveWeb3React()

  const { price, sellAmount } = useSwapState()

  const relevantTokenBalances = useTokenBalances(account ?? undefined, [biddingToken])
  const biddingTokenBalance = relevantTokenBalances?.[biddingToken?.address ?? '']
  const parsedBiddingAmount = tryParseAmount(sellAmount, biddingToken)

  const { buyAmountScaled, sellAmountScaled } = convertPriceIntoBuyAndSellAmount(
    auctioningToken,
    biddingToken,
    price == '-' ? '1' : price,
    sellAmount,
  )
  let error: string | undefined
  if (!account) {
    error = 'Connect Wallet'
  }

  if (!sellAmount) {
    error = error ?? 'Enter an amount'
  }
  if (
    minBiddingAmountPerOrder &&
    biddingToken &&
    sellAmount &&
    ((sellAmountScaled && BigNumber.from(minBiddingAmountPerOrder).gte(sellAmountScaled)) ||
      parseFloat(sellAmount) == 0)
  ) {
    const errorMsg =
      'Amount must be bigger than ' +
      new Fraction(
        minBiddingAmountPerOrder,
        BigNumber.from(10).pow(biddingToken.decimals).toString(),
      ).toSignificant(2)
    error = error ?? errorMsg
  }

  if (!price) {
    error = error ?? 'Enter a price'
  }
  if (auctioningToken == undefined || biddingToken == undefined) {
    error = 'Please wait a sec'
  }
  if (
    initialAuctionOrder != null &&
    auctioningToken != undefined &&
    biddingToken != undefined &&
    buyAmountScaled &&
    sellAmountScaled
      ?.mul(initialAuctionOrder?.sellAmount.raw.toString())
      .lte(buyAmountScaled.mul(initialAuctionOrder?.buyAmount.raw.toString()))
  ) {
    error = error ?? 'Price must be higher than ' + initialPrice?.toSignificant(5)
  }

  const [balanceIn, amountIn] = [biddingTokenBalance, parsedBiddingAmount]
  if (balanceIn && amountIn && balanceIn.lessThan(amountIn)) {
    error = 'Insufficient ' + amountIn.token.symbol + ' balance'
  }

  return {
    error,
  }
}

export function useDerivedAuctionInfo(): {
  biddingTokenBalance: TokenAmount | undefined
  parsedBiddingAmount: TokenAmount | undefined
  auctioningToken: Token | undefined
  biddingToken: Token | undefined
  clearingPriceSellOrder: SellOrder | null
  clearingPriceOrder: Order | null
  clearingPrice: Fraction | undefined
  initialAuctionOrder: SellOrder | null
  auctionEndDate: number | null
  clearingPriceVolume: BigNumber | null
  initialPrice: Fraction | undefined
  minBiddingAmountPerOrder: string | undefined
} {
  const { account } = useActiveWeb3React()

  const { auctionId, chainId, sellAmount } = useSwapState()

  const { auctioningToken, biddingToken } = useDeriveAuctioningAndBiddingToken(auctionId)

  const easyAuctionInstance: Contract | null = useContract(
    EASY_AUCTION_NETWORKS[chainId as ChainId],
    easyAuctionABI,
  )
  const auctionInfo = useSingleCallResult(easyAuctionInstance, 'auctionData', [auctionId], {
    blocksPerFetch: 1,
  }).result

  const initialAuctionOrder: SellOrder | null = decodeSellOrder(
    auctionInfo?.initialAuctionOrder,
    auctioningToken,
    biddingToken,
  )
  const clearingPriceSellOrder: SellOrder | null = decodeSellOrder(
    auctionInfo?.clearingPriceOrder,
    biddingToken,
    auctioningToken,
  )
  let clearingPriceOrder: Order | null = null
  if (auctionInfo?.clearingPriceOrder) {
    clearingPriceOrder = decodeOrder(auctionInfo?.clearingPriceOrder)
  }
  const clearingPriceVolume = auctionInfo?.volumeClearingPriceOrder
  const auctionEndDate = auctionInfo?.auctionEndDate
  const minBiddingAmountPerOrder = auctionInfo?.minimumBiddingAmountPerOrder
  const relevantTokenBalances = useTokenBalances(account ?? undefined, [biddingToken])
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
    auctionEndDate,
    clearingPriceVolume,
    initialPrice,
    minBiddingAmountPerOrder,
  }
}

export function useDerivedAuctionState(): {
  auctionState: AuctionState | undefined
} {
  const { auctionId, chainId } = useSwapState()

  const easyAuctionInstance: Contract | null = useContract(
    EASY_AUCTION_NETWORKS[chainId as ChainId],
    easyAuctionABI,
  )
  const auctionInfo = useSingleCallResult(easyAuctionInstance, 'auctionData', [auctionId], {
    blocksPerFetch: 1,
  }).result
  const auctioningTokenAddress: string | undefined = auctionInfo?.auctioningToken.toString()

  if (auctioningTokenAddress == '0x0000000000000000000000000000000000000000') {
    return { auctionState: AuctionState.NOT_YET_STARTED }
  }

  let clearingPriceOrder: Order | null = null
  if (auctionInfo?.clearingPriceOrder) {
    clearingPriceOrder = decodeOrder(auctionInfo?.clearingPriceOrder)
  }
  const auctionEndDate = auctionInfo?.auctionEndDate
  const orderCancellationEndDate = auctionInfo?.orderCancellationEndDate

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

  let auctionState = undefined
  if (auctionEndDate && auctionEndDate > new Date().getTime() / 1000) {
    auctionState = AuctionState.ORDER_PLACING
    if (orderCancellationEndDate >= new Date().getTime() / 1000) {
      auctionState = AuctionState.ORDER_PLACING_AND_CANCELING
    }
  } else {
    if (clearingPrice?.toSignificant(1) == '0') {
      auctionState = AuctionState.PRICE_SUBMISSION
    } else {
      if (clearingPrice) auctionState = AuctionState.CLAIMING
    }
  }
  return {
    auctionState,
  }
}

export function useDerivedClaimInfo(
  auctionId: number,
): {
  error?: string
  auctioningToken?: Token | null
  biddingToken?: Token | null
  claimauctioningToken?: TokenAmount | null
  claimbiddingToken?: TokenAmount | null
} {
  const { chainId } = useActiveWeb3React()

  const easyAuctionInstance: Contract | null = useContract(
    EASY_AUCTION_NETWORKS[chainId as ChainId],
    easyAuctionABI,
  )

  const auctionInfo = useSingleCallResult(easyAuctionInstance, 'auctionData', [auctionId]).result
  const auctioningTokenAddress: string | undefined = auctionInfo?.auctioningToken.toString()

  const auctionEndDate = auctionInfo?.auctionEndDate

  const biddingTokenAddress: string | undefined = auctionInfo?.biddingToken.toString()

  const auctioningToken = useTokenByAddressAndAutomaticallyAdd(auctioningTokenAddress)
  const biddingToken = useTokenByAddressAndAutomaticallyAdd(biddingTokenAddress)
  const clearingPriceSellOrder: SellOrder | null = decodeSellOrder(
    auctionInfo?.clearingPriceOrder,
    biddingToken,
    auctioningToken,
  )

  let error: string | undefined
  if (clearingPriceSellOrder?.buyAmount.raw.toString() == '0') {
    error = 'Price not yet supplied to auction'
  }
  if (auctionEndDate >= new Date().getTime() / 1000) {
    error = 'auction has not yet ended'
  }
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
  if (claimableOrders == undefined || claimableOrders?.length > 0) {
    if (!claimed || !claimed[0]) {
      error = 'Already claimed'
    }
  }

  if (claimableOrders?.length == 0) {
    error = 'No participation'
  }

  return {
    error,
    auctioningToken,
    biddingToken,
  }
}

// updates the swap state to use the defaults for a given network whenever the query
// string updates
export function useDefaultsFromURLSearch(search?: string) {
  const { chainId } = useActiveWeb3React()
  const { onPullOrderbookData } = useOrderbookActionHandlers()
  const { onReloadFromAPI } = useOrderActionHandlers()
  const dispatch = useDispatch<AppDispatch>()
  useEffect(() => {
    if (!chainId) return
    dispatch(setDefaultsFromURLSearch({ chainId, queryString: search }))
    onPullOrderbookData()
    onReloadFromAPI()
  }, [dispatch, search, chainId, onReloadFromAPI, onPullOrderbookData])
}

export function useCurrentUserOrders() {
  const { account, chainId } = useActiveWeb3React()
  const { auctionId } = useSwapState()
  const { auctioningToken, biddingToken } = useDeriveAuctioningAndBiddingToken(auctionId)
  const { onNewOrder } = useOrderActionHandlers()
  const { shouldLoad } = useOrderState()

  useEffect(() => {
    async function fetchData() {
      if (!chainId || !account || !biddingToken || !auctioningToken) {
        return
      }
      const sellOrdersFormUser = await additionalServiceApi.getCurrentUserOrders({
        networkId: chainId,
        auctionId,
        user: account,
      })
      const sellOrderDisplays: OrderDisplay[] = []
      if (biddingToken && auctioningToken && sellOrdersFormUser) {
        for (const orderString of sellOrdersFormUser) {
          const order = decodeOrder(orderString)
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
            status: OrderStatus.PLACED,
          })
        }
      }
      onNewOrder(sellOrderDisplays)
    }
    if (shouldLoad) {
      fetchData()
    }
  }, [chainId, account, auctionId, onNewOrder, auctioningToken, biddingToken, shouldLoad])
}
