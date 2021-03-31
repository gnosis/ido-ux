import React, { ButtonHTMLAttributes } from 'react'
import styled from 'styled-components'

import { MenuIcon } from '../../icons/MenuIcon'

const Wrapper = styled.button`
  background: none;
  border: none;
  cursor: pointer;
  height: ${({ theme }) => theme.header.height};
  margin: 0 auto 0 0;
  outline: none;
  padding: 0;
  transition: ease-out 0.15s all;
  width: 40px;

  &.active,
  &:active {
    .fill {
      fill: ${({ theme }) => theme.primary1};
    }
  }

  &[disabled],
  &[disabled]:hover {
    cursor: not-allowed;
    opacity: 0.5;

    .fill {
      fill: #fff;
    }
  }
`

export const ButtonMenu: React.FC<ButtonHTMLAttributes<HTMLButtonElement>> = (props) => {
  const { ...restProps } = props

  return (
    <Wrapper {...restProps}>
      <MenuIcon />
    </Wrapper>
  )
}
