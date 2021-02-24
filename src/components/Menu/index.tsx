import React, { useEffect, useRef } from 'react'
import { Code, Info, MessageCircle } from 'react-feather'
import styled from 'styled-components'

import { ReactComponent as MenuIcon } from '../../assets/images/menu.svg'
import useToggle from '../../hooks/useToggle'
import { ExternalLink } from '../../theme'

const StyledMenuIcon = styled(MenuIcon)`
  path {
    stroke: ${({ theme }) => theme.text1};
  }
`

const StyledMenuButton = styled.button`
  width: 100%;
  height: 100%;
  border: none;
  background-color: transparent;
  margin: 0;
  padding: 0;
  height: 35px;
  background-color: ${({ theme }) => theme.bg3};
  padding: 0.15rem 0.5rem;
  border-radius: 0.5rem;

  ${({ theme }) => theme.mediaWidth.upToMedium`
    background-color: ${({ theme }) => theme.bg2}
  `};

  :hover,
  :focus {
    cursor: pointer;
    outline: none;
    background-color: ${({ theme }) => theme.bg4};
  }

  svg {
    margin-top: 2px;
  }
`

const StyledMenu = styled.div`
  margin-left: 0.5rem;
  display: flex;
  justify-content: center;
  align-items: center;
  position: relative;
  border: none;
  text-align: left;
`

const MenuFlyout = styled.span`
  min-width: 8.125rem;
  background-color: ${({ theme }) => theme.bg2};
  box-shadow: 0px 0px 1px rgba(0, 0, 0, 0.01), 0px 4px 8px rgba(0, 0, 0, 0.04),
    0px 16px 24px rgba(0, 0, 0, 0.04), 0px 24px 32px rgba(0, 0, 0, 0.01);
  border-radius: 0.5rem;
  padding: 0.5rem;
  display: flex;
  flex-direction: column;
  font-size: 1rem;
  position: absolute;
  top: 3rem;
  right: 0rem;
  z-index: 100;

  ${({ theme }) => theme.mediaWidth.upToMedium`
    bottom: 70px;
    top: initial;
  `}
`

const MenuItem = styled(ExternalLink)`
  flex: 1;
  padding: 0.5rem 0.5rem;
  color: ${({ theme }) => theme.text2};
  :hover {
    color: ${({ theme }) => theme.text1};
    cursor: pointer;
    text-decoration: none;
  }
  > svg {
    margin-right: 8px;
  }
`

const CODE_LINK = process.env.REACT_APP_GIT_COMMIT_HASH
  ? `https://github.com/gnosis/ido-contracts/tree/${process.env.REACT_APP_GIT_COMMIT_HASH}`
  : 'https://github.com/gnosis/ido-contracts'

export default function Menu() {
  const node = useRef<HTMLDivElement>()
  const [open, toggle] = useToggle(false)

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (node.current?.contains(e.target) ?? false) {
        return
      }
      toggle()
    }

    if (open) {
      document.addEventListener('mousedown', handleClickOutside)
    } else {
      document.removeEventListener('mousedown', handleClickOutside)
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [open, toggle])

  return (
    <StyledMenu ref={node}>
      <StyledMenuButton onClick={toggle}>
        <StyledMenuIcon />
      </StyledMenuButton>
      {open && (
        <MenuFlyout>
          <MenuItem
            href="https://forum.gnosis.io/t/should-gnosisdao-build-an-ido-specific-dapp/895"
            id="link"
          >
            <Info size={14} />
            About
          </MenuItem>
          <MenuItem href={CODE_LINK} id="link">
            <Code size={14} />
            Code
          </MenuItem>
          <MenuItem href="https://discord.gg/xUHSDkRB" id="link">
            <MessageCircle size={14} />
            Discord
          </MenuItem>
        </MenuFlyout>
      )}
    </StyledMenu>
  )
}
