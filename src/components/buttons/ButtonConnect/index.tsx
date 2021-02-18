import React, { ButtonHTMLAttributes } from 'react'
import styled from 'styled-components'

import { ChevronRight } from '../../icons/ChevronRight'

const Wrapper = styled.button`
  &.buttonConnect {
    align-items: center;
    background: transparent;
    color: #fff;
    cursor: pointer;
    display: flex;
    font-size: 15px;
    font-weight: 400;
    height: 100%;
    line-height: 1.2;
    outline: none;
    padding: 0;
    border: none;

    &[disabled] {
      cursor: not-allowed;
      opacity: 0.5;
    }

    .fill {
      fill: #fff;
    }

    &:hover {
      color: #fff;

      .fill {
        fill: #fff;
      }
    }
  }
`

const Text = styled.span`
  margin-right: 10px;
`

export const ButtonConnect: React.FC<ButtonHTMLAttributes<HTMLButtonElement>> = (props) => {
  const { className, ...restProps } = props

  return (
    <Wrapper
      className={`buttonConnect ${className}`}
      onClick={() => {
        console.log('connect')
      }}
      {...restProps}
    >
      <Text>Connect a Wallet</Text>
      <ChevronRight />
    </Wrapper>
  )
}
