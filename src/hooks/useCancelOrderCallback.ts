import { useMemo } from 'react'
import { Fraction, Token } from 'uniswap-xdai-sdk'

import { BigNumber } from '@ethersproject/bignumber'
import { Contract } from '@ethersproject/contracts'

import { chainNames } from '../constants'
import { AuctionIdentifier } from '../state/orderPlacement/reducer'
import { useTransactionAdder } from '../state/transactions/hooks'
import { ChainId, calculateGasMargin, getEasyAuctionContract } from '../utils'
import { getLogger } from '../utils/logger'
import { abbreviation } from '../utils/numeral'
import { decodeOrder } from './Order'
import { useActiveWeb3React } from './index'

const logger = getLogger('useCancelOrderCallback')

export function useCancelOrderCallback(
  auctionIdentifier: AuctionIdentifier,
  biddingToken: Token,
): null | ((orderId: string) => Promise<string>) {
  const { account, chainId, library } = useActiveWeb3React()
  const addTransaction = useTransactionAdder()
  const { auctionId, chainId: orderChainId } = auctionIdentifier

  return useMemo(() => {
    return async function onCancelOrder(orderId: string) {
      if (!chainId || !library || !account) {
        throw new Error('missing dependencies in onCancelOrder callback')
      }

      if (chainId !== orderChainId) {
        throw new Error(
          `In order to cancel this order, please connect to ${chainNames[Number(chainId)]} network`,
        )
      }

      const decodedOrder = decodeOrder(orderId)
      const easyAuctionContract: Contract = getEasyAuctionContract(
        chainId as ChainId,
        library,
        account,
      )
      let estimate, method: Function, args: Array<number | string[]>, value: Maybe<BigNumber>
      {
        estimate = easyAuctionContract.estimateGas.cancelSellOrders
        method = easyAuctionContract.cancelSellOrders
        args = [auctionId, [orderId]]
        value = null
      }

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
              'Cancel order selling ' +
              abbreviation(
                new Fraction(
                  decodedOrder.sellAmount.toString(),
                  BigNumber.from(10).pow(biddingToken.decimals).toString(),
                ).toSignificant(2),
              ) +
              ' ' +
              biddingToken.symbol,
          })
          return response.hash
        })
        .catch((error) => {
          logger.error(`Cancelation or gas estimate failed`, error)
          throw error
        })
    }
  }, [account, orderChainId, addTransaction, chainId, library, auctionId, biddingToken])
}
