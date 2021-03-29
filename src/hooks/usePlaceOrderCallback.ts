import { useMemo } from 'react'
import { Token } from 'uniswap-xdai-sdk'

import { BigNumber } from '@ethersproject/bignumber'
import { Contract } from '@ethersproject/contracts'

import { additionalServiceApi } from '../api'
import { EASY_AUCTION_NETWORKS } from '../constants'
import easyAuctionABI from '../constants/abis/easyAuction/easyAuction.json'
import { Result, useSingleCallResult } from '../state/multicall/hooks'
import { useSwapState } from '../state/orderPlacement/hooks'
import { AuctionIdentifier } from '../state/orderPlacement/reducer'
import { useOrderbookActionHandlers } from '../state/orderbook/hooks'
import { useOrderActionHandlers } from '../state/orders/hooks'
import { OrderStatus } from '../state/orders/reducer'
import { useTransactionAdder } from '../state/transactions/hooks'
import { ChainId, calculateGasMargin, getEasyAuctionContract, getTokenDisplay } from '../utils'
import { getLogger } from '../utils/logger'
import { abbreviation } from '../utils/numeral'
import { convertPriceIntoBuyAndSellAmount } from '../utils/prices'
import { encodeOrder } from './Order'
import { useActiveWeb3React } from './index'
import { useContract } from './useContract'

const logger = getLogger('usePlaceOrderCallback')

export const queueStartElement =
  '0x0000000000000000000000000000000000000000000000000000000000000001'
export const queueLastElement = '0xffffffffffffffffffffffffffffffffffffffff000000000000000000000001'

// returns a function that will place an order, if the parameters are all valid
// and the user has approved the transfer of tokens
export function usePlaceOrderCallback(
  auctionIdentifer: AuctionIdentifier,
  signature: string | null,
  auctioningToken: Token,
  biddingToken: Token,
): null | (() => Promise<string>) {
  const { account, chainId, library } = useActiveWeb3React()
  const addTransaction = useTransactionAdder()
  const { onNewOrder } = useOrderActionHandlers()
  const { auctionId } = auctionIdentifer
  const { price, sellAmount } = useSwapState()
  const { onNewBid } = useOrderbookActionHandlers()

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

      const easyAuctionContract: Contract = getEasyAuctionContract(
        chainId as ChainId,
        library,
        account,
      )

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

      let estimate,
        method: Function,
        args: Array<string | string[] | number>,
        value: Maybe<BigNumber>
      {
        estimate = easyAuctionContract.estimateGas.placeSellOrders
        method = easyAuctionContract.placeSellOrders
        args = [
          auctionId,
          [buyAmountScaled.toString()],
          [sellAmountScaled.toString()],
          [previousOrder],
          signature ? signature : '0x',
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
    account,
    addTransaction,
    auctionId,
    auctioningToken,
    biddingToken,
    chainId,
    library,
    onNewBid,
    onNewOrder,
    price,
    sellAmount,
    signature,
    userId,
  ])
}
