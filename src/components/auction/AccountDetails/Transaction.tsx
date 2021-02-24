import React from 'react'
import { Check, Triangle } from 'react-feather'
import styled from 'styled-components'

import Circle from '../../../assets/images/circle.svg'
import { useActiveWeb3React } from '../../../hooks'
import { useAllTransactions } from '../../../state/transactions/hooks'
import { ExternalLink, Spinner } from '../../../theme'
import { getEtherscanLink } from '../../../utils'

const TransactionWrapper = styled.div`
  margin-top: 0.75rem;
`

const TransactionStatusText = styled.div`
  margin-right: 0.5rem;
`

const TransactionState = styled(ExternalLink)`
  border-color: #fff;
  border-radius: 0.5rem;
  border: 1px solid;
  color: #fff;
  display: flex;
  font-size: 0.75rem;
  font-weight: 500;
  justify-content: space-between;
  padding: 0.5rem 0.75rem;
  text-decoration: none !important;
`

const IconWrapper = styled.div`
  flex-shrink: 0;
`

export default function Transaction({ hash }: { hash: string }) {
  const { chainId } = useActiveWeb3React()
  const allTransactions = useAllTransactions()

  const summary = allTransactions?.[hash]?.summary
  const pending = !allTransactions?.[hash]?.receipt
  const success =
    !pending &&
    (allTransactions[hash].receipt.status === 1 ||
      typeof allTransactions[hash].receipt.status === 'undefined')

  return (
    <TransactionWrapper>
      <TransactionState href={getEtherscanLink(chainId, hash, 'transaction')}>
        <TransactionStatusText>{summary ? summary : hash}</TransactionStatusText>
        <IconWrapper>
          {pending ? (
            <Spinner src={Circle} />
          ) : success ? (
            <Check size="16" />
          ) : (
            <Triangle size="16" />
          )}
        </IconWrapper>
      </TransactionState>
    </TransactionWrapper>
  )
}
