import React from 'react'
import styled from 'styled-components'

import { CopyToClipboard } from 'react-copy-to-clipboard'

import { CopyIcon } from '../../icons/CopyIcon'

const Wrapper = styled.button<{ light?: boolean }>`
  background: none;
  border: none;
  cursor: pointer;
  height: 15px;
  margin: 0 0 0 8px;
  outline: none;
  padding: 0;
  width: 13px;

  ${(props) =>
    props.light &&
    `svg {
      .fill {
        fill: #b2b5b2;
      }
    }`}

  &:active {
    opacity: 0.7;
  }

  &:hover {
    filter: brightness(50%);
  }

  &[disabled],
  &[disabled]:hover {
    cursor: not-allowed;
    opacity: 0.5;
  }
`

interface ButtonCopyProps {
  light?: boolean
  value: unknown
}

export const ButtonCopy: React.FC<ButtonCopyProps> = (props) => {
  const { light = false, value, ...restProps } = props

  return (
    <CopyToClipboard text={value}>
      <Wrapper className="buttonCopy" light={light} {...restProps}>
        <CopyIcon />
      </Wrapper>
    </CopyToClipboard>
  )
}
