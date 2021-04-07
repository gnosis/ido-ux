import { useCallback, useMemo } from 'react'
import { TokenAmount } from 'uniswap-xdai-sdk'

import { MaxUint256 } from '@ethersproject/constants'
import { TransactionResponse } from '@ethersproject/providers'

import { useTokenAllowance } from '../data/Allowances'
import { useHasPendingApproval, useTransactionAdder } from '../state/transactions/hooks'
import { calculateGasMargin } from '../utils'
import { getLogger } from '../utils/logger'
import { useActiveWeb3React } from './index'
import { useTokenContract } from './useContract'
import { useGasPrice } from './useGasPrice'

const logger = getLogger('useApproveCallback')

export enum ApprovalState {
  UNKNOWN,
  NOT_APPROVED,
  PENDING,
  APPROVED,
}

// returns a variable indicating the state of the approval and a function which approves if necessary or early returns
export function useApproveCallback(
  amountToApprove?: TokenAmount,
  addressToApprove?: string,
): [ApprovalState, () => Promise<void>] {
  const { account } = useActiveWeb3React()
  const gasPrice = useGasPrice()

  const currentAllowance = useTokenAllowance(
    amountToApprove?.token,
    account ?? undefined,
    addressToApprove,
  )
  const pendingApproval = useHasPendingApproval(amountToApprove?.token?.address, addressToApprove)

  // check the current approval status
  const approval = useMemo(() => {
    if (!amountToApprove) return ApprovalState.UNKNOWN
    // we might not have enough data to know whether or not we need to approve
    if (!currentAllowance) return ApprovalState.UNKNOWN
    if (pendingApproval) return ApprovalState.PENDING
    // amountToApprove will be defined if currentAllowance is
    return currentAllowance.lessThan(amountToApprove)
      ? ApprovalState.NOT_APPROVED
      : ApprovalState.APPROVED
  }, [amountToApprove, currentAllowance, pendingApproval])

  const tokenContract = useTokenContract(amountToApprove?.token?.address)
  const addTransaction = useTransactionAdder()

  const approve = useCallback(async (): Promise<void> => {
    if (approval !== ApprovalState.NOT_APPROVED) {
      logger.error('approve was called unnecessarily')
      return
    }

    if (!tokenContract) {
      logger.error('tokenContract is null')
      return
    }

    if (!amountToApprove) {
      logger.error('missing amount to approve')
      return
    }

    let useExact = false
    const estimatedGas = await tokenContract.estimateGas
      .approve(addressToApprove, MaxUint256)
      .catch(() => {
        // general fallback for tokens who restrict approval amounts
        useExact = true
        return tokenContract.estimateGas.approve(addressToApprove, amountToApprove.raw.toString())
      })

    return tokenContract
      .approve(addressToApprove, useExact ? amountToApprove.raw.toString() : MaxUint256, {
        gasPrice,
        gasLimit: calculateGasMargin(estimatedGas),
      })
      .then((response: TransactionResponse) => {
        addTransaction(response, {
          summary: 'Approve ' + amountToApprove?.token?.symbol,
          approval: { tokenAddress: amountToApprove?.token?.address, spender: addressToApprove },
        })
      })
      .catch((error: Error) => {
        logger.debug('Failed to approve token', error)
        throw error
      })
  }, [approval, tokenContract, amountToApprove, addressToApprove, gasPrice, addTransaction])

  return [approval, approve]
}
