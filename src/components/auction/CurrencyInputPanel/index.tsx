import React from 'react'
import styled from 'styled-components'
import { Pair, Token } from 'uniswap-xdai-sdk'

import TokenLogo from '../../TokenLogo'
import { ControlButton, FormLabel } from '../../form/FormLabel'
import { Input as NumericalInput } from '../../form/NumericalInput'
import { FormRow } from '../../pureStyledComponents/FormRow'
import { TextfieldCSS } from '../../pureStyledComponents/Textfield'

const TextfieldWrapper = styled.div`
  ${TextfieldCSS}
  align-items: center;
  display: flex;
  justify-content: space-between;
`

const TokenInfo = styled.div`
  align-items: center;
  display: flex;
  flex-shrink: 0;
  justify-content: space-between;
`

const TokenSymbol = styled.div`
  color: ${({ theme }) => theme.text1};
  font-size: 18px;
  font-stretch: 400;
  font-weight: 600;
  margin-right: 8px;
  text-align: right;
`

interface CurrencyInputPanelProps {
  disableTokenSelect?: boolean
  hideBalance?: boolean
  hideInput?: boolean
  id: string
  isExchange?: boolean
  label?: string
  onMax?: () => void
  onTokenSelection?: (tokenAddress: string) => void
  onUserSellAmountInput: (val: string) => void
  otherSelectedTokenAddress?: string | null
  pair?: Pair | null
  showMaxButton: boolean
  showSendWithSwap?: boolean
  token?: Token | null
  value: string
}

export default function CurrencyInputPanel({
  label = 'Input',
  onMax,
  onUserSellAmountInput,
  token = null,
  value,
}: CurrencyInputPanelProps) {
  return (
    <FormRow>
      <FormLabel extraControls={<ControlButton onClick={onMax}>Max</ControlButton>} text={label} />
      <TextfieldWrapper>
        <NumericalInput
          onUserSellAmountInput={(val) => {
            onUserSellAmountInput(val)
          }}
          value={value}
        />
        <TokenInfo>
          <TokenSymbol>{token?.symbol}</TokenSymbol>{' '}
          {token?.address && <TokenLogo address={token?.address} size={'24px'} />}
        </TokenInfo>
      </TextfieldWrapper>
    </FormRow>
  )
}
