import React from 'react'
import { NavLink } from 'react-router-dom'
import styled from 'styled-components'

import { InnerContainer } from '../../pureStyledComponents/InnerContainer'
import { navItems } from '../sections'

const Wrapper = styled.nav`
  display: none;

  @media (min-width: ${(props) => props.theme.themeBreakPoints.md}) {
    background-color: rgba(255, 255, 255, 0.8);
    box-shadow: 0 2px 8px 0 rgba(212, 213, 211, 0.7);
    display: flex;
    flex-shrink: 0;
    height: 36px;
    max-width: 100%;
  }
`

const MenuItems = styled(InnerContainer)`
  flex-direction: column;
  flex-shrink: 0;

  @media (min-width: ${(props) => props.theme.themeBreakPoints.md}) {
    flex-direction: row;
    height: 100%;
  }
`

const Item = styled(NavLink)`
  border-bottom-color: transparent;
  border-bottom-style: solid;
  border-bottom-width: 2px;
  border-top: 2px solid transparent;
  color: #000;
  display: block;
  flex-shrink: 0;
  font-size: 14px;
  font-weight: 600;
  line-height: 36px;
  margin-right: 15px;
  position: relative;
  text-align: center;
  text-decoration: none;
  text-transform: uppercase;
  user-select: none;
  z-index: 1;

  &:last-child {
    margin-right: 0;
  }

  &:hover {
    color: #000;
  }

  &.active {
  }
`

export const Mainmenu: React.FC = (props) => {
  return (
    <Wrapper {...props}>
      <MenuItems>
        {navItems.map((item, index) => {
          return (
            <Item activeClassName="active" key={index} to={item.url}>
              {item.title}
            </Item>
          )
        })}
      </MenuItems>
    </Wrapper>
  )
}
