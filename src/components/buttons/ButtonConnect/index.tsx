import { darken } from 'polished'
import React, { ButtonHTMLAttributes } from 'react'
import styled from 'styled-components'

import { getLogger } from '../../../utils/logger'
import { ChevronRight } from '../../icons/ChevronRight'

const logger = getLogger('ButtonConnect')

const Wrapper = styled.button`
  align-items: center;
  background: transparent;
  border: none;
  color: ${({ theme }) => theme.primary1};
  cursor: pointer;
  display: flex;
  font-size: 16px;
  font-weight: 400;
  height: 100%;
  line-height: 1.2;
  outline: none;
  padding: 0;

  &[disabled] {
    cursor: not-allowed;
    opacity: 0.5;
  }

  .fill {
    fill: ${({ theme }) => theme.primary1};
  }

  &:hover {
    color: ${({ theme }) => darken(0.15, theme.primary1)};

    .fill {
      fill: ${({ theme }) => darken(0.15, theme.primary1)};
    }
  }
`

const Text = styled.span`
  margin-right: 10px;
  font-family: 'Averta', sans-serif;
`

export const ButtonConnect: React.FC<ButtonHTMLAttributes<HTMLButtonElement>> = (props) => {
  const { className, ...restProps } = props

  return (
    <Wrapper
      className={`buttonConnect ${className}`}
      onClick={() => {
        logger.log('connect')
      }}
      {...restProps}
    >
      <Text>Connect a Wallet</Text>
      <ChevronRight />
    </Wrapper>
  )
}
