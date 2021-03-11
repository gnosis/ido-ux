import React from 'react'
import { NavLink } from 'react-router-dom'
import styled from 'styled-components'

import { navItems } from '../sections'

const Wrapper = styled.nav`
  background-color: rgba(255, 255, 255, 0.85);
`

const Inner = styled.div`
  background-color: #fff;
  box-shadow: 0 3px 9px -5px rgba(212, 213, 211, 0.8);
`

const Item = styled(NavLink)`
  align-items: center;
  background-color: #fff;
  border-bottom: 1px solid #000;
  color: #000;
  display: flex;
  font-size: 15px;
  font-weight: 400;
  height: 44px;
  justify-content: flex-start;
  line-height: 1;
  padding: 0 10px;
  text-decoration: none;
  text-transform: uppercase;
  transition: all 0.1s linear;

  &.active {
  }

  &.active:active,
  &:active {
    color: #fff;
    opacity: 0.5;
  }
`

interface Props {
  onClose: () => void
}

export const Mobilemenu: React.FC<Props> = (props) => {
  const { onClose, ...restProps } = props

  const onCloseDelay = (e: React.MouseEvent<HTMLElement, MouseEvent>) => {
    e.preventDefault()
    setTimeout(() => {
      onClose()
    }, 100)
  }

  return (
    <Wrapper onClick={onCloseDelay} {...restProps}>
      <Inner>
        {navItems.map((item, index) => {
          return (
            <Item activeClassName="active" key={index} to={item.url}>
              {item.title}
            </Item>
          )
        })}
      </Inner>
    </Wrapper>
  )
}
