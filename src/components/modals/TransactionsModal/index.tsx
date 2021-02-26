import React from 'react'
import styled from 'styled-components'

import { ReactComponent as Close } from '../../../assets/images/x.svg'
import { useAllTransactions } from '../../../state/transactions/hooks'
import { TransactionDetails } from '../../../state/transactions/reducer'
import Transaction from '../../AccountDetails/Transaction'
import Modal from '../Modal'

const CloseIcon = styled.div`
  position: absolute;
  right: 1rem;
  top: 14px;
  &:hover {
    cursor: pointer;
    opacity: 0.6;
  }
`

const CloseColor = styled(Close)`
  path {
    stroke: ${({ theme }) => theme.text4};
  }
`

const Wrapper = styled.div`
  ${({ theme }) => theme.flexColumnNoWrap}
  margin: 0;
  padding: 0;
  width: 100%;
`

const HeaderRow = styled.div`
  ${({ theme }) => theme.flexRowNoWrap};
  padding: 1rem 1rem;
  font-weight: 500;
  color: ${(props) => (props.color === 'blue' ? ({ theme }) => theme.primary1 : 'inherit')};
  ${({ theme }) => theme.mediaWidth.upToMedium`
    padding: 1rem;
  `};
`

const ContentWrapper = styled.div`
  background-color: ${({ theme }) => theme.bg2};
  padding: 2rem;
  border-bottom-left-radius: 20px;
  border-bottom-right-radius: 20px;

  ${({ theme }) => theme.mediaWidth.upToMedium`padding: 1rem`};
`

const UpperSection = styled.div`
  position: relative;

  h5 {
    margin: 0;
    margin-bottom: 0.5rem;
    font-size: 1rem;
    font-weight: 400;
  }

  h5:last-child {
    margin-bottom: 0px;
  }

  h4 {
    margin-top: 0;
    font-weight: 500;
  }
`

const HoverText = styled.div`
  :hover {
    cursor: pointer;
  }
`

const TransactionListWrapper = styled.div`
  ${({ theme }) => theme.flexColumnNoWrap};
`

interface Props {
  isOpen: boolean
  maxHeight?: number
  minHeight?: Maybe<number>
  onDismiss: () => void
}

export const TransactionsModal: React.FC<Props> = (props) => {
  const { isOpen, maxHeight, minHeight, onDismiss } = props
  const allTransactions = useAllTransactions()

  const newTranscationsFirst = (a: TransactionDetails, b: TransactionDetails) => {
    return b.addedTime - a.addedTime
  }

  const recentTransactionsOnly = (a: TransactionDetails) => {
    return new Date().getTime() - a.addedTime < 86_400_000
  }

  const sortedRecentTransactions = React.useMemo(() => {
    const txs = Object.values(allTransactions)
    return txs.filter(recentTransactionsOnly).sort(newTranscationsFirst)
  }, [allTransactions])

  const pending = sortedRecentTransactions.filter((tx) => !tx.receipt).map((tx) => tx.hash)
  const confirmed = sortedRecentTransactions.filter((tx) => tx.receipt).map((tx) => tx.hash)

  const renderTransactions = (transactions) => {
    return (
      <TransactionListWrapper>
        {transactions.map((hash, i) => {
          return <Transaction hash={hash} key={i} />
        })}
      </TransactionListWrapper>
    )
  }

  return (
    <Modal isOpen={isOpen} maxHeight={maxHeight} minHeight={minHeight} onDismiss={onDismiss}>
      <Wrapper>
        <UpperSection>
          <CloseIcon onClick={onDismiss}>
            <CloseColor />
          </CloseIcon>
          <HeaderRow>
            <HoverText>Transactions</HoverText>
          </HeaderRow>
          <ContentWrapper>
            {renderTransactions(pending)}
            {renderTransactions(confirmed)}
          </ContentWrapper>
        </UpperSection>
      </Wrapper>
    </Modal>
  )
}
