import { useMemo } from 'react'
import { ChainId, Token } from 'uniswap-xdai-sdk'

import { BigNumber } from '@ethersproject/bignumber'
import { Contract } from '@ethersproject/contracts'

import { EASY_AUCTION_NETWORKS } from '../constants'
import easyAuctionABI from '../constants/abis/easyAuction/easyAuction.json'
import { Result, useSingleCallResult } from '../state/multicall/hooks'
import { useSwapState } from '../state/orderPlacement/hooks'
import { useOrderbookActionHandlers } from '../state/orderbook/hooks'
import { useOrderActionHandlers } from '../state/orders/hooks'
import { OrderStatus } from '../state/orders/reducer'
import { useTransactionAdder } from '../state/transactions/hooks'
import { calculateGasMargin, getEasyAuctionContract, getTokenDisplay } from '../utils'
import { convertPriceIntoBuyAndSellAmount } from '../utils/prices'
import { additionalServiceApi } from './../api'
import { encodeOrder } from './Order'
import { useActiveWeb3React } from './index'
import { useContract } from './useContract'

export const queueStartElement =
  '0x0000000000000000000000000000000000000000000000000000000000000001'
export const queueLastElement = '0xffffffffffffffffffffffffffffffffffffffff000000000000000000000001'

// returns a function that will place an order, if the parameters are all valid
// and the user has approved the transfer of tokens
export function usePlaceOrderCallback(
  auctioningToken: Token,
  biddingToken: Token,
): null | (() => Promise<string>) {
  const { account, chainId, library } = useActiveWeb3React()
  const addTransaction = useTransactionAdder()
  const { onNewOrder } = useOrderActionHandlers()
  const { auctionId, price, sellAmount } = useSwapState()
  const { onNewBid } = useOrderbookActionHandlers()

  const easyAuctionInstance: Contract | null = useContract(
    EASY_AUCTION_NETWORKS[chainId as ChainId],
    easyAuctionABI,
  )
  const userId: Result | undefined = useSingleCallResult(easyAuctionInstance, 'getUserId', [
    account == null ? undefined : account,
  ]).result
  return useMemo(() => {
    return async function onPlaceOrder() {
      if (!chainId || !library || !account) {
        throw new Error('missing dependencies in onPlaceOrder callback')
      }

      const { buyAmountScaled, sellAmountScaled } = convertPriceIntoBuyAndSellAmount(
        auctioningToken,
        biddingToken,
        price,
        sellAmount,
      )
      if (sellAmountScaled == undefined || buyAmountScaled == undefined) {
        return 'price was not correct'
      }
      const easyAuctionContract: Contract = getEasyAuctionContract(
        chainId as ChainId,
        library,
        account,
      )
      const previousOrder = await additionalServiceApi.getPreviousOrder({
        networkId: chainId,
        auctionId,
        order: {
          buyAmount: buyAmountScaled,
          sellAmount: sellAmountScaled,
          userId: BigNumber.from(0), // This could be optimized
        },
      })
      let estimate,
        method: Function,
        args: Array<string | string[] | number>,
        value: BigNumber | null
      {
        estimate = easyAuctionContract.estimateGas.placeSellOrders
        method = easyAuctionContract.placeSellOrders
        args = [
          auctionId,
          [buyAmountScaled.toString()],
          [sellAmountScaled.toString()],
          [previousOrder],
          '0x', // Depending on the allowList interface, different bytes values need to be sent
        ]
        value = null
      }

      const biddingTokenDisplay = getTokenDisplay(biddingToken)
      const auctioningTokenDisplay = getTokenDisplay(auctioningToken)

      return estimate(...args, value ? { value } : {})
        .then((estimatedGasLimit) =>
          method(...args, {
            ...(value ? { value } : {}),
            gasLimit: calculateGasMargin(estimatedGasLimit),
          }),
        )
        .then((response) => {
          addTransaction(response, {
            summary:
              'Sell ' +
              sellAmount +
              ' ' +
              biddingTokenDisplay +
              ' for ' +
              (parseFloat(sellAmount) / parseFloat(price)).toPrecision(4) +
              ' ' +
              auctioningTokenDisplay,
          })
          const order = {
            buyAmount: buyAmountScaled,
            sellAmount: sellAmountScaled,
            userId: BigNumber.from(userId), // If many people are placing orders, this might be incorrect
          }
          onNewOrder([
            {
              id: encodeOrder(order),
              sellAmount: parseFloat(sellAmount).toString(),
              price: price.toString(),
              status: OrderStatus.PENDING,
            },
          ])
          onNewBid({
            volume: parseFloat(sellAmount),
            price: parseFloat(price),
          })
          return response.hash
        })
        .catch((error) => {
          console.error(`Swap or gas estimate failed`, error)
          throw error
        })
    }
  }, [
    account,
    userId,
    addTransaction,
    chainId,
    library,
    auctionId,
    biddingToken,
    price,
    auctioningToken,
    sellAmount,
    onNewOrder,
    onNewBid,
  ])
}
