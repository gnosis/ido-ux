import React from 'react'
import styled from 'styled-components'

import { ChevronDown } from '../../icons/ChevronDown'

const Wrapper = styled.button`
  align-items: center;
  background-color: ${({ theme }) => theme.textField.backgroundColor};
  border-color: ${({ theme }) => theme.textField.borderColor};
  border-radius: ${({ theme }) => theme.textField.borderRadius};
  border-style: ${({ theme }) => theme.textField.borderStyle};
  border-width: ${({ theme }) => theme.textField.borderWidth};
  color: ${({ theme }) => theme.text1};
  display: flex;
  font-size: ${({ theme }) => theme.textField.fontSize};
  font-weight: ${({ theme }) => theme.textField.fontWeight};
  height: ${({ theme }) => theme.textField.height};
  justify-content: space-between;
  outline: none;
  padding: 0 14px;
  transition: border-color 0.15s linear;
  width: 100%;

  .isOpen & {
    background-color: ${({ theme }) => theme.textField.backgroundColorActive};
    border-color: ${({ theme }) => theme.textField.borderColorActive};
  }
`

const Chevron = styled(ChevronDown)`
  margin-left: 10px;
`

interface Props {
  content: React.ReactNode | string
}

export const ButtonSelect: React.FC<Props> = (props) => {
  const { content, ...restProps } = props

  return (
    <Wrapper {...restProps}>
      {content}
      <Chevron />
    </Wrapper>
  )
}
