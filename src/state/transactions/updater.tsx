import { useEffect } from 'react'

import { useDispatch, useSelector } from 'react-redux'

import { useActiveWeb3React } from '../../hooks'
import { getLogger } from '../../utils/logger'
import { useAddPopup, useBlockNumber } from '../application/hooks'
import { AppDispatch, AppState } from '../index'
import { pullOrderbookData } from '../orderbook/actions'
import { finalizeOrderCancellation, finalizeOrderPlacement } from '../orders/actions'
import { finalizeTransaction } from './actions'

const logger = getLogger('transactions/updater')

export default function Updater() {
  const { chainId, library } = useActiveWeb3React()

  const lastBlockNumber = useBlockNumber()

  const dispatch = useDispatch<AppDispatch>()
  const transactions = useSelector<AppState, AppState['transactions']>(
    (state) => state.transactions,
  )

  // show popup on confirm
  const addPopup = useAddPopup()

  useEffect(() => {
    if (!chainId || !library || !lastBlockNumber) return
    const allTransactions = transactions[chainId ?? -1] ?? {}

    Object.keys(allTransactions)
      .filter((hash) => !allTransactions[hash].receipt)
      .forEach((hash) => {
        library
          .getTransactionReceipt(hash)
          .then((receipt) => {
            if (receipt) {
              dispatch(
                finalizeTransaction({
                  chainId,
                  hash,
                  receipt: {
                    blockHash: receipt.blockHash,
                    blockNumber: receipt.blockNumber,
                    contractAddress: receipt.contractAddress,
                    from: receipt.from,
                    status: receipt.status,
                    to: receipt.to,
                    transactionHash: receipt.transactionHash,
                    transactionIndex: receipt.transactionIndex,
                  },
                }),
              )
              dispatch(finalizeOrderCancellation())
              dispatch(finalizeOrderPlacement())
              dispatch(pullOrderbookData())
              // add success or failure popup
              if (receipt.status === 1) {
                addPopup({
                  txn: {
                    hash,
                    success: true,
                    summary: allTransactions[hash]?.summary,
                  },
                })
              } else {
                addPopup({
                  txn: {
                    hash,
                    success: false,
                    summary: allTransactions[hash]?.summary,
                  },
                })
              }
            }
          })
          .catch((error) => {
            logger.error(`failed to check transaction hash: ${hash}`, error)
          })
      })
  }, [chainId, library, transactions, lastBlockNumber, dispatch, addPopup])

  return null
}
