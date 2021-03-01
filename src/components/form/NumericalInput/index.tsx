import React from 'react'
import styled from 'styled-components'

import { escapeRegExp } from '../../../utils'
import { TexfieldPartsCSS } from '../../pureStyledComponents/Textfield'

const StyledInput = styled.input<{ error?: boolean }>`
  background-color: ${({ theme }) => theme.textField.backgroundColor};
  border: none;
  border-radius: 0;
  color: ${({ theme }) => (props) =>
    props.error ? theme.textField.errorColor : theme.textField.color};
  font-size: ${({ theme }) => theme.textField.fontSize};
  font-weight: ${({ theme }) => theme.textField.fontWeight};
  height: 100%;
  outline: none;
  padding: 0;
  width: 100%;

  ${TexfieldPartsCSS}
`

const inputRegex = RegExp(`^\\d*(?:\\\\[.])?\\d*$`) // match escaped "." characters via in a non-capturing group

export const Input = React.memo(function InnerInput({
  onUserSellAmountInput,
  placeholder,
  value,
  ...rest
}: {
  value: string | number
  onUserSellAmountInput: (string) => void
  error?: boolean
  fontSize?: string
  align?: 'right' | 'left'
} & Omit<React.HTMLProps<HTMLInputElement>, 'ref' | 'onChange' | 'as'>) {
  const enforcer = (nextUserInput: string) => {
    if (nextUserInput === '' || inputRegex.test(escapeRegExp(nextUserInput))) {
      onUserSellAmountInput(nextUserInput)
    }
  }

  return (
    <StyledInput
      autoComplete="off"
      autoCorrect="off"
      // universal input options
      inputMode="decimal"
      maxLength={79}
      minLength={1}
      onChange={(event) => {
        // replace commas with periods, because uniswap exclusively uses period as the decimal separator
        enforcer(event.target.value.replace(/,/g, '.'))
      }}
      // text-specific options
      pattern="^[0-9]*[.,]?[0-9]*$"
      placeholder={placeholder || '0.0'}
      spellCheck="false"
      title="Token Amount"
      type="text"
      value={value}
      {...rest}
    />
  )
})

export default Input
