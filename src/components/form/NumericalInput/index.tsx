import React from 'react'

import { escapeRegExp } from '../../../utils'

const inputRegex = RegExp(`^\\d*(?:\\\\[.])?\\d*$`) // match escaped "." characters via in a non-capturing group

interface Props {
  onUserSellAmountInput: (string) => void
  value: string | number
}

export const Input = React.memo(function InnerInput(
  props: Props & Omit<React.HTMLProps<HTMLInputElement>, 'ref' | 'onChange' | 'as'>,
) {
  const { onUserSellAmountInput, placeholder, value, ...restProps } = props
  const enforcer = (nextUserInput: string) => {
    if (nextUserInput === '' || inputRegex.test(escapeRegExp(nextUserInput))) {
      onUserSellAmountInput(nextUserInput)
    }
  }

  return (
    <input
      autoComplete="off"
      autoCorrect="off"
      inputMode="decimal"
      maxLength={79}
      minLength={1}
      onChange={(event) => {
        enforcer(event.target.value.replace(/,/g, '.'))
      }}
      pattern="^[0-9]*[.,]?[0-9]*$"
      placeholder={placeholder || '0.0'}
      spellCheck="false"
      type="text"
      value={value}
      {...restProps}
    />
  )
})

export default Input
