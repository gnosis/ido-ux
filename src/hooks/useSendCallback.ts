import { useMemo } from 'react'

import { BigNumber } from '@ethersproject/bignumber'
import { TransactionResponse } from '@ethersproject/providers'
import { JSBI, TokenAmount, WETH } from '@josojo/honeyswap-sdk'

import { useTransactionAdder } from '../state/transactions/hooks'
import { useTokenBalanceTreatingWETHasETHonXDAI } from '../state/wallet/hooks'
import { ChainId, calculateGasMargin, getSigner, isAddress } from '../utils'
import { getLogger } from '../utils/logger'
import { abbreviation } from '../utils/numeral'
import { useActiveWeb3React } from './index'
import { useTokenContract } from './useContract'
import useENSName from './useENSName'

const logger = getLogger('useSendCallback')

// returns a callback for sending a token amount, treating WETH as ETH
// returns null with invalid arguments
export function useSendCallback(
  amount?: TokenAmount,
  recipient?: string,
): null | (() => Promise<string>) {
  const { account, chainId, library } = useActiveWeb3React()
  const addTransaction = useTransactionAdder()
  const ensName = useENSName(recipient)
  const tokenContract = useTokenContract(amount?.token?.address)
  const balance = useTokenBalanceTreatingWETHasETHonXDAI(account ?? undefined, amount?.token)

  return useMemo(() => {
    if (!amount) return null
    if (!amount.greaterThan(JSBI.BigInt(0))) return null
    if (!isAddress(recipient)) return null
    if (!balance) return null
    if (balance.lessThan(amount)) return null

    const token = amount?.token

    return async function onSend(): Promise<string> {
      if (!chainId || !library || !account || !tokenContract) {
        throw new Error('missing dependencies in onSend callback')
      }
      if (token.equals(WETH[chainId as ChainId])) {
        return getSigner(library, account)
          .sendTransaction({
            to: recipient,
            value: BigNumber.from(amount.raw.toString()),
          })
          .then((response: TransactionResponse) => {
            addTransaction(response, {
              summary:
                'Send ' +
                abbreviation(amount.toSignificant(3)) +
                ' ' +
                token?.symbol +
                ' to ' +
                (ensName ?? recipient),
            })
            return response.hash
          })
          .catch((error: Error) => {
            logger.error('Failed to transfer ETH', error)
            throw error
          })
      } else {
        return tokenContract.estimateGas
          .transfer(recipient, amount.raw.toString())
          .then((estimatedGasLimit) =>
            tokenContract
              .transfer(recipient, amount.raw.toString(), {
                gasLimit: calculateGasMargin(estimatedGasLimit),
              })
              .then((response: TransactionResponse) => {
                addTransaction(response, {
                  summary:
                    'Send ' +
                    abbreviation(amount.toSignificant(3)) +
                    ' ' +
                    token.symbol +
                    ' to ' +
                    (ensName ?? recipient),
                })
                return response.hash
              }),
          )
          .catch((error) => {
            logger.error('Failed token transfer', error)
            throw error
          })
      }
    }
  }, [
    addTransaction,
    library,
    account,
    chainId,
    amount,
    ensName,
    recipient,
    tokenContract,
    balance,
  ])
}
