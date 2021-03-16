import React, { useState } from 'react'
import styled from 'styled-components'

import { useWeb3React } from '@web3-react/core'
import { HashLink } from 'react-router-hash-link'

import useENSName from '../../../hooks/useENSName'
import { useWalletModalToggle } from '../../../state/application/hooks'
import { useAllTransactions } from '../../../state/transactions/hooks'
import { TransactionDetails } from '../../../state/transactions/reducer'
import { useNetworkCheck } from '../../Web3Status'
import { ButtonConnect } from '../../buttons/ButtonConnect'
import { ButtonMenu } from '../../buttons/ButtonMenu'
import { Logo } from '../../common/Logo'
import { UserDropdown } from '../../common/UserDropdown'
import WalletModal from '../../modals/WalletModal'
import { Mainmenu } from '../../navigation/Mainmenu'
import { Mobilemenu } from '../../navigation/Mobilemenu'
import { InnerContainer } from '../../pureStyledComponents/InnerContainer'

const Wrapper = styled.header`
  background-color: ${({ theme }) => theme.mainBackground};
  display: flex;
  flex-shrink: 0;
  position: relative;
  z-index: 100;
`

const Inner = styled(InnerContainer)`
  align-items: center;
  flex-flow: row;
  flex-grow: 1;
  flex-shrink: 0;
  height: ${(props) => props.theme.header.height};
  justify-content: space-between;
  padding-left: ${(props) => props.theme.layout.horizontalPadding};
  padding-right: ${(props) => props.theme.layout.horizontalPadding};
`

const LogoLink = styled(HashLink)``

const ButtonMenuStyled = styled(ButtonMenu)`
  display: block;
  position: relative;
  z-index: 5;

  @media (min-width: ${(props) => props.theme.themeBreakPoints.md}) {
    display: none;
  }
`

const ButtonConnectStyled = styled(ButtonConnect)`
  margin-left: auto;
  position: relative;
  z-index: 5;

  @media (min-width: ${(props) => props.theme.themeBreakPoints.md}) {
    margin-left: 0;
  }
`

const UserDropdownStyled = styled(UserDropdown)`
  margin-left: auto;
  position: relative;
  z-index: 5;

  @media (min-width: ${(props) => props.theme.themeBreakPoints.md}) {
    margin-left: 0;
  }
`

const Menu = styled(Mainmenu)`
  display: none;

  @media (min-width: ${(props) => props.theme.themeBreakPoints.md}) {
    display: flex;
    margin-left: auto;
  }
`

const MobilemenuStyled = styled(Mobilemenu)`
  display: block;
  height: calc(100vh - ${(props) => props.theme.header.height});
  left: 0;
  position: fixed;
  top: ${(props) => props.theme.header.height};
  width: 100%;
  z-index: 12345;

  @media (min-width: ${(props) => props.theme.themeBreakPoints.md}) {
    display: none;
  }
`

const Error = styled.span`
  align-items: center;
  color: ${({ theme }) => theme.primary1};
  display: flex;
  font-size: 16px;
  font-weight: 600;
  height: 100%;
  line-height: 1.2;
  margin-left: auto;
`

export const Header: React.FC = (props) => {
  const { account } = useWeb3React()
  const { errorWrongNetwork } = useNetworkCheck()
  const isConnected = !!account
  const [mobileMenuVisible, setMobileMenuVisible] = useState(false)

  const toggleWalletModal = useWalletModalToggle()
  const allTransactions = useAllTransactions()
  const ENSName = useENSName(account)

  const recentTransactionsOnly = (a: TransactionDetails) => {
    return new Date().getTime() - a.addedTime < 86_400_000
  }

  const newTransactionFirst = (a: TransactionDetails, b: TransactionDetails) => {
    return b.addedTime - a.addedTime
  }

  const sortedRecentTransactions = React.useMemo(() => {
    const txs = Object.values(allTransactions)
    return txs.filter(recentTransactionsOnly).sort(newTransactionFirst)
  }, [allTransactions])

  const confirmed = sortedRecentTransactions.filter((tx) => tx.receipt).map((tx) => tx.hash)
  const pending = sortedRecentTransactions.filter((tx) => !tx.receipt).map((tx) => tx.hash)

  const mobileMenuToggle = () => {
    setMobileMenuVisible(!mobileMenuVisible)
  }
  const web3Status =
    isConnected && errorWrongNetwork == undefined ? (
      <UserDropdownStyled />
    ) : errorWrongNetwork ? (
      <Error>{errorWrongNetwork}</Error>
    ) : (
      <ButtonConnectStyled onClick={toggleWalletModal} />
    )

  return (
    <>
      <Wrapper className="siteHeader" {...props}>
        <Inner>
          <ButtonMenuStyled onClick={mobileMenuToggle} />
          {mobileMenuVisible && <MobilemenuStyled onClose={() => setMobileMenuVisible(false)} />}
          <LogoLink className="logoLink" to="/#topAnchor">
            <Logo />
          </LogoLink>
          <Menu />
          {web3Status}
        </Inner>
      </Wrapper>
      <WalletModal
        confirmedTransactions={confirmed}
        // eslint-disable-next-line
        ENSName={ENSName}
        pendingTransactions={pending}
      />
    </>
  )
}
