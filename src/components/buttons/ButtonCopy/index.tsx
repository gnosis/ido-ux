import React, { ButtonHTMLAttributes } from 'react'
import styled from 'styled-components'

import { CopyToClipboard } from 'react-copy-to-clipboard'

import { CopyIcon } from '../../icons/CopyIcon'

const Wrapper = styled.button`
  background: none;
  border: none;
  cursor: pointer;
  height: 14px;
  margin: 0;
  outline: none;
  padding: 0;
  width: 14px;

  svg {
    .fill {
      fill: ${({ theme }) => theme.text1};
      transition: fill 0.1s linear;
    }
  }

  &:active {
    opacity: 0.7;
  }

  &:hover {
    .fill {
      fill: ${({ theme }) => theme.primary1};
    }
  }

  &[disabled],
  &[disabled]:hover {
    cursor: not-allowed;
    opacity: 0.5;
  }
`

interface ButtonCopyProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  copyValue: string
}

export const ButtonCopy: React.FC<ButtonCopyProps> = (props) => {
  const { copyValue, ...restProps } = props

  return (
    <CopyToClipboard text={copyValue}>
      <Wrapper className="buttonCopy" {...restProps}>
        <CopyIcon />
      </Wrapper>
    </CopyToClipboard>
  )
}
