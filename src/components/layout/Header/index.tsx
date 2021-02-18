import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import styled from 'styled-components'

import { ButtonConnect } from '../../buttons/ButtonConnect'
import { ButtonMenu } from '../../buttons/ButtonMenu'
import { Logo } from '../../common/Logo'
import { UserDropdown } from '../../common/UserDropdown'
import { Mobilemenu } from '../../navigation/Mobilemenu'

const Wrapper = styled.header`
  &.siteHeader {
    align-items: center;
    background-color: ${(props) => props.theme.header.backgroundColor};
    border-bottom: solid 1px #e8e7e6;
    display: flex;
    flex-shrink: 0;
    height: ${(props) => props.theme.header.height};
    justify-content: space-between;
    padding-left: ${(props) => props.theme.layout.horizontalPadding};
    padding-right: ${(props) => props.theme.layout.horizontalPadding};
    position: relative;
    z-index: 100;
  }
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
`

const UserDropdownStyled = styled(UserDropdown)`
  margin-left: auto;
  position: relative;
  z-index: 5;
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
  const isDisconnected = true
  const [mobileMenuVisible, setMobileMenuVisible] = useState(false)

  const mobileMenuToggle = () => {
    setMobileMenuVisible(!mobileMenuVisible)
  }

  return (
    <Wrapper className="siteHeader" {...props}>
      <ButtonMenuStyled onClick={mobileMenuToggle} />
      {mobileMenuVisible && <MobilemenuStyled onClose={() => setMobileMenuVisible(false)} />}
      <LogoLink className="logoLink" to="/">
        <Logo />
      </LogoLink>
      {isDisconnected ? <ButtonConnectStyled disabled={isConnecting} /> : <UserDropdownStyled />}
    </Wrapper>
  )
}
