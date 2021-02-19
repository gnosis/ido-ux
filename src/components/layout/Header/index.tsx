import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import styled from 'styled-components'

import { UnsupportedChainIdError, useWeb3React } from '@web3-react/core'

import { NetworkContextName } from '../../../constants'
import { ButtonConnect } from '../../buttons/ButtonConnect'
import { ButtonMenu } from '../../buttons/ButtonMenu'
import { Logo } from '../../common/Logo'
import { UserDropdown } from '../../common/UserDropdown'
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

const LogoLink = styled(Link)`
  &.logoLink {
    left: 50%;
    position: absolute;
    text-decoration: none;
    top: 50%;
    transform: translateX(-50%) translateY(-50%);
    z-index: 1;

    @media (min-width: ${(props) => props.theme.themeBreakPoints.md}) {
      left: auto;
      position: relative;
      top: auto;
      transform: none;
    }
  }
`

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

export const Header: React.FC = (props) => {
  const isConnecting = false
  const { account, active, connector, error } = useWeb3React()
  const contextNetwork = useWeb3React(NetworkContextName)
  const isDisconnected = !contextNetwork.active && !active
  const [mobileMenuVisible, setMobileMenuVisible] = useState(false)

  const mobileMenuToggle = () => {
    setMobileMenuVisible(!mobileMenuVisible)
  }

  return (
    <Wrapper className="siteHeader" {...props}>
      <Inner>
        <ButtonMenuStyled onClick={mobileMenuToggle} />
        {mobileMenuVisible && <MobilemenuStyled onClose={() => setMobileMenuVisible(false)} />}
        <LogoLink className="logoLink" to="/">
          <Logo />
        </LogoLink>
        <Menu />
        {isDisconnected ? <ButtonConnectStyled disabled={isConnecting} /> : <UserDropdownStyled />}
      </Inner>
    </Wrapper>
  )
}
