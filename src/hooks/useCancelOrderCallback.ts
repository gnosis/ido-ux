import { useMemo } from 'react'

import { BigNumber } from '@ethersproject/bignumber'
import { Contract } from '@ethersproject/contracts'
import { ChainId, Fraction, Token } from '@uniswap/sdk'

import { useSwapState } from '../state/orderPlacement/hooks'
import { useTransactionAdder } from '../state/transactions/hooks'
import { calculateGasMargin, getEasyAuctionContract } from '../utils'
import { decodeOrder } from './Order'
import { useActiveWeb3React } from './index'

export function useCancelOrderCallback(
  biddingToken: Token,
): null | ((orderId: string) => Promise<string>) {
  const { account, chainId, library } = useActiveWeb3React()
  const addTransaction = useTransactionAdder()
  const { auctionId } = useSwapState()

  return useMemo(() => {
    return async function onCancelOrder(orderId: string) {
      if (!chainId || !library || !account) {
        throw new Error('missing dependencies in onCancelOrder callback')
      }
      const decodedOrder = decodeOrder(orderId)
      const easyAuctionContract: Contract = getEasyAuctionContract(
        chainId as ChainId,
        library,
        account,
      )
      let estimate, method: Function, args: Array<number | string[]>, value: BigNumber | null
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
              new Fraction(
                decodedOrder.sellAmount.toString(),
                BigNumber.from(10).pow(biddingToken.decimals).toString(),
              ).toSignificant(2) +
              ' ' +
              biddingToken.symbol,
          })
          return response.hash
        })
        .catch((error) => {
          console.error(`Cancellation or gas estimate failed`, error)
          throw error
        })
    }
  }, [account, addTransaction, chainId, library, auctionId, biddingToken])
}
