import { useCallback, useMemo } from 'react'

import { TransactionResponse } from '@ethersproject/providers'
import { useDispatch, useSelector } from 'react-redux'

import { useActiveWeb3React } from '../../hooks'
import { getLogger } from '../../utils/logger'
import { AppDispatch, AppState } from '../index'
import { addTransaction } from './actions'
import { TransactionDetails, TransactionState } from './reducer'

const logger = getLogger('TX Debug Hooks')

// helper that can take a ethers library transaction response and add it to the list of transactions
export function useTransactionAdder(): (
  response: TransactionResponse,
  customData?: { summary?: string; approval?: { tokenAddress: string; spender: string } },
) => void {
  const { account, chainId } = useActiveWeb3React()
  const dispatch = useDispatch<AppDispatch>()

  return useCallback(
    (
      response: TransactionResponse,
      {
        approval,
        summary,
      }: { summary?: string; approval?: { tokenAddress: string; spender: string } } = {},
    ) => {
      if (!account) return
      if (!chainId) return

      const { hash } = response
      if (!hash) {
        throw Error('No transaction hash found.')
      }
      dispatch(
        addTransaction({
          hash,
          from: account,
          chainId,
          approval,
          summary,
        }),
      )
    },
    [dispatch, chainId, account],
  )
}

// returns all the transactions for the current chain
export function useAllTransactions(): { [txHash: string]: TransactionDetails } {
  const { account, chainId } = useActiveWeb3React()

  const transactions = useSelector<AppState, TransactionState>((state) => state.transactions)

  const transactionsFilteredByConnectedAccount = useMemo(() => {
    const transactionsByChainId = transactions[chainId ?? -1] ?? {}
    if (!account) {
      return transactionsByChainId
    }

    return Object.keys(transactionsByChainId)
      .filter(
        (key) =>
          // Here we filter by the right account, is a little complicated because the key is a hash
          account && transactionsByChainId[key]?.from.toLowerCase() === account.toLowerCase(),
      )
      .reduce((obj, key) => {
        // Now we can return the correct object transactions based on the filtered keys
        return {
          ...obj,
          [key]: transactionsByChainId[key],
        }
      }, {})
  }, [account, chainId, transactions])

  return transactionsFilteredByConnectedAccount
}

/**
 * Returns whether a transaction happened in the last day (86400 seconds * 1000 milliseconds / second)
 * @param tx to check for recency
 */
export function isTransactionRecent(tx: TransactionDetails): boolean {
  return new Date().getTime() - tx.addedTime < 86_400_000
}

// returns whether a token has a pending approval transaction
export function useHasPendingApproval(tokenAddress?: string, spender?: string): boolean {
  const allTransactions = useAllTransactions()

  const hasPendingApproval = useMemo(() => {
    return (
      typeof tokenAddress === 'string' &&
      typeof spender === 'string' &&
      Object.keys(allTransactions).some((hash) => {
        const tx = allTransactions[hash]
        if (!tx) return false
        if (tx.receipt) {
          return false
        } else {
          if (!tx.approval) return false
          return (
            tokenAddress === tx.approval?.tokenAddress &&
            spender === tx.approval.spender &&
            isTransactionRecent(tx)
          )
        }
      })
    )
  }, [allTransactions, spender, tokenAddress])

  if (hasPendingApproval) {
    logger.log('Debug TXs', allTransactions)
    logger.log(
      'Debug TXs Filtered',
      Object.keys(allTransactions)
        .map((hash) => allTransactions[hash])
        .filter(
          (tx) =>
            !!tx &&
            !tx.receipt &&
            tx.approval &&
            tx.approval.tokenAddress === tokenAddress &&
            tx.approval.spender === spender,
        ),
    )
  }
  return hasPendingApproval
}

// returns whether a account has a pending claim transaction
export function useHasPendingClaim(auctionId?: number, from?: string | null): boolean {
  const allTransactions = useAllTransactions()

  return useMemo(() => {
    return (
      typeof auctionId === 'number' &&
      typeof from === 'string' &&
      Object.keys(allTransactions).some((hash) => {
        const tx = allTransactions[hash]
        if (!tx) return false
        if (tx.receipt) {
          return false
        } else {
          return `Claiming tokens auction-${auctionId}` === tx.summary && isTransactionRecent(tx)
        }
      })
    )
  }, [allTransactions, auctionId, from])
}
