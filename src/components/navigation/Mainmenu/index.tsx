import React from 'react'
import { NavLink } from 'react-router-dom'
import styled from 'styled-components'

import { navItems } from '../sections'

const Wrapper = styled.nav`
  display: flex;
  flex-direction: row;
  flex-shrink: 0;
  height: 100%;
  max-width: 100%;
`

const Item = styled(NavLink)`
  align-items: center;
  color: ${({ theme }) => theme.bg6};
  cursor: pointer;
  display: flex;
  font-size: 16px;
  font-weight: 400;
  height: 100%;
  justify-content: center;
  margin-right: 50px;
  text-decoration: none;

  &:hover,
  &.active {
    color: ${({ theme }) => theme.primary1};

    .fill {
      fill: ${({ theme }) => theme.primary1};
    }
  }

  &.active {
    cursor: default;
    pointer-events: none;
  }
`

export const Mainmenu: React.FC = (props) => {
  return (
    <Wrapper {...props}>
      {navItems.map((item, index) => {
        return (
          <Item activeClassName="active" key={index} to={item.url}>
            {item.title}
          </Item>
        )
      })}
    </Wrapper>
  )
}
