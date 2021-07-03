import { useMemo } from 'react'
import { Token } from 'uniswap-xdai-sdk'

import { BigNumber } from '@ethersproject/bignumber'
import { Contract, ContractFunction } from '@ethersproject/contracts'
import { Web3Provider } from '@ethersproject/providers'

import { additionalServiceApi } from '../api'
import depositAndPlaceOrderABI from '../constants/abis/easyAuction/depositAndPlaceOrder.json'
import easyAuctionABI from '../constants/abis/easyAuction/easyAuction.json'
import { NUMBER_OF_DIGITS_FOR_INVERSION } from '../constants/config'
import { Result, useSingleCallResult } from '../state/multicall/hooks'
import { useOrderPlacementState } from '../state/orderPlacement/hooks'
import { AuctionIdentifier } from '../state/orderPlacement/reducer'
import { useOrderbookActionHandlers } from '../state/orderbook/hooks'
import { useOrderActionHandlers } from '../state/orders/hooks'
import { OrderStatus } from '../state/orders/reducer'
import { useTransactionAdder } from '../state/transactions/hooks'
import {
  ChainId,
  DEPOSIT_AND_PLACE_ORDER,
  EASY_AUCTION_NETWORKS,
  calculateGasMargin,
  getContract,
  getEasyAuctionContract,
  getTokenDisplay,
  isTokenWETH,
  isTokenXDAI,
} from '../utils'
import { getLogger } from '../utils/logger'
import { abbreviation } from '../utils/numeral'
import { convertPriceIntoBuyAndSellAmount, getInverse } from '../utils/prices'
import { encodeOrder } from './Order'
import { useActiveWeb3React } from './index'
import { useContract } from './useContract'
import { useGasPrice } from './useGasPrice'

const logger = getLogger('usePlaceOrderCallback')

export const queueStartElement =
  '0x0000000000000000000000000000000000000000000000000000000000000001'
export const queueLastElement = '0xffffffffffffffffffffffffffffffffffffffff000000000000000000000001'

type EstimateAndParams = {
  estimate: ContractFunction<BigNumber>
  method: Function
  args: [number, [string], [string], string] | [number, [string], [string], [string], string]
  value: Maybe<BigNumber>
}
// returns a function that will place an order, if the parameters are all valid
// and the user has approved the transfer of tokens
export function usePlaceOrderCallback(
  auctionIdentifer: AuctionIdentifier,
  signature: string | null,
  isPriceInverted: boolean,
  auctioningToken: Token,
  biddingToken: Token,
): null | (() => Promise<string>) {
  const { account, chainId, library } = useActiveWeb3React()
  const { auctionId } = auctionIdentifer

  const addTransaction = useTransactionAdder()
  const { onNewOrder } = useOrderActionHandlers()
  const { price: priceFromSwapState, sellAmount } = useOrderPlacementState()
  const { onNewBid } = useOrderbookActionHandlers()
  const gasPrice = useGasPrice(chainId)

  const price = (isPriceInverted
    ? getInverse(priceFromSwapState, NUMBER_OF_DIGITS_FOR_INVERSION)
    : priceFromSwapState
  ).toString()

  const easyAuctionInstance: Maybe<Contract> = useContract(
    EASY_AUCTION_NETWORKS[chainId as ChainId],
    easyAuctionABI,
  )
  const userId: Result | undefined = useSingleCallResult(easyAuctionInstance, 'getUserId', [
    account == null ? undefined : account,
  ]).result

  return useMemo(() => {
    let previousOrder: string

    return async function onPlaceOrder() {
      if (!chainId || !library || !account || !userId || !signature) {
        throw new Error('missing dependencies in onPlaceOrder callback')
      }

      const { buyAmountScaled, sellAmountScaled } = convertPriceIntoBuyAndSellAmount(
        auctioningToken,
        biddingToken,
        price,
        sellAmount,
      )

      if (sellAmountScaled == undefined || buyAmountScaled == undefined) {
        return 'Price was not correct.'
      }

      try {
        previousOrder = await additionalServiceApi.getPreviousOrder({
          networkId: chainId,
          auctionId,
          order: {
            buyAmount: buyAmountScaled,
            sellAmount: sellAmountScaled,
            userId: BigNumber.from(0), // Todo: This could be optimized
          },
        })
      } catch (error) {
        logger.error(`Error trying to get previous order for auctionId ${auctionId}`)
      }

      const auctioningTokenDisplay = getTokenDisplay(auctioningToken, chainId)
      const biddingTokenDisplay = getTokenDisplay(biddingToken, chainId)

      const { args, estimate, method, value } = getEstimateParams(
        biddingToken,
        chainId,
        library,
        account,
        buyAmountScaled,
        sellAmountScaled,
        previousOrder,
        auctionId,
        signature,
      )

      return estimate(...args, value ? { value } : {})
        .then((estimatedGasLimit) =>
          method(...args, {
            ...(value ? { value } : {}),
            gasPrice,
            gasLimit: calculateGasMargin(estimatedGasLimit),
          }),
        )
        .then((response) => {
          addTransaction(response, {
            summary:
              'Sell ' +
              abbreviation(sellAmount) +
              ' ' +
              biddingTokenDisplay +
              ' for ' +
              abbreviation((parseFloat(sellAmount) / parseFloat(price)).toPrecision(4)) +
              ' ' +
              auctioningTokenDisplay,
          })
          const order = {
            buyAmount: buyAmountScaled,
            sellAmount: sellAmountScaled,
            userId: BigNumber.from(parseInt(userId.toString())), // If many people are placing orders, this might be incorrect
          }
          onNewOrder([
            {
              id: encodeOrder(order),
              sellAmount: parseFloat(sellAmount).toString(),
              price: price.toString(),
              status: OrderStatus.PENDING,
              chainId,
            },
          ])
          onNewBid({
            volume: parseFloat(sellAmount),
            price: parseFloat(price),
          })
          return response.hash
        })
        .catch((error) => {
          logger.error(`Swap or gas estimate failed`, error)
          throw error
        })
    }
  }, [
    chainId,
    library,
    account,
    userId,
    signature,
    auctioningToken,
    biddingToken,
    price,
    sellAmount,
    auctionId,
    gasPrice,
    addTransaction,
    onNewOrder,
    onNewBid,
  ])
}

const getEstimateParams = (
  biddingToken: Token,
  chainId: ChainId,
  library: Web3Provider,
  account: string,
  buyAmountScaled: BigNumber,
  sellAmountScaled: BigNumber,
  previousOrder: string,
  auctionId: number,
  signature: string,
): EstimateAndParams => {
  const easyAuctionContract: Contract = getEasyAuctionContract(chainId, library, account)
  if (isTokenXDAI(biddingToken.address, chainId) || isTokenWETH(biddingToken.address, chainId)) {
    const depositAndPlaceOrderContract = getContract(
      DEPOSIT_AND_PLACE_ORDER[chainId],
      depositAndPlaceOrderABI,
      library,
      account,
    )

    return {
      estimate: depositAndPlaceOrderContract.estimateGas.depositAndPlaceOrder,
      method: depositAndPlaceOrderContract.depositAndPlaceOrder,
      args: [
        auctionId,
        [buyAmountScaled.toString()],
        [previousOrder],
        signature ? signature : '0x',
      ],
      value: sellAmountScaled,
    }
  }
  return {
    estimate: easyAuctionContract.estimateGas.placeSellOrders,
    method: easyAuctionContract.placeSellOrders,
    args: [
      auctionId,
      [buyAmountScaled.toString()],
      [sellAmountScaled.toString()],
      [previousOrder],
      signature ? signature : '0x',
    ],
    value: null,
  }
}
