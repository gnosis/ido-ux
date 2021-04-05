import React from 'react'
import styled from 'styled-components'

import { useActiveWeb3React } from '../../../hooks'
import { useAllTransactions } from '../../../state/transactions/hooks'
import { ExternalLink } from '../../../theme'
import { getExplorerLink } from '../../../utils'
import { Spinner, SpinnerSize } from '../../common/Spinner'
import { AlertIcon } from '../../icons/AlertIcon'
import { OrderPlaced } from '../../icons/OrderPlaced'

const Wrapper = styled(ExternalLink)`
  align-items: center;
  background-color: transparent;
  border-radius: 12px;
  border: solid 1px ${({ theme }) => theme.primary2};
  cursor: pointer;
  display: flex;
  justify-content: flex-start;
  margin: 0 0 12px;
  min-height: 38px;
  padding: 8px 12px;
  text-decoration: none;
  width: 100%;

  &:hover,
  &:active,
  &:focus {
    background-color: #001e3c;
    text-decoration: none;
  }
`

const IconWrapper = styled.span<{ size?: number }>`
  align-items: center;
  display: flex;
  height: 20px;
  justify-content: center;
  margin-right: 12px;
  width: 20px;
`

const Text = styled.span`
  color: ${({ theme }) => theme.text1};
  font-size: 17px;
  font-weight: 400;
  line-height: 1.2;
  text-align: left;
  text-decoration: none;
`

const Alert = styled(AlertIcon)`
  height: 20px;
  width: 20px;
`

const Transaction = ({ hash }: { hash: string }) => {
  const { chainId } = useActiveWeb3React()
  const allTransactions = useAllTransactions()

  const summary = allTransactions?.[hash]?.summary
  const pending = !allTransactions?.[hash]?.receipt
  const success =
    !pending &&
    (allTransactions[hash].receipt.status === 1 ||
      typeof allTransactions[hash].receipt.status === 'undefined')

  return (
    <Wrapper href={getExplorerLink(chainId, hash, 'transaction')}>
      <IconWrapper>
        {pending ? (
          <Spinner size={SpinnerSize.extraSmall} />
        ) : success ? (
          <OrderPlaced />
        ) : (
          <Alert />
        )}
      </IconWrapper>
      <Text>{summary ? summary : hash}</Text>
    </Wrapper>
  )
}

export default Transaction
