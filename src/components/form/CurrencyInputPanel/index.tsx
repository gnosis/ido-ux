import React from 'react'
import styled from 'styled-components'
import { Token } from 'uniswap-xdai-sdk'

import { useActiveWeb3React } from '../../../hooks'
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
  margin-left: 15px;
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
  onMax?: () => void
  onUserSellAmountInput: (val: string) => void
  token: Maybe<Token>
  value: string
}

export default function CurrencyInputPanel({
  onMax,
  onUserSellAmountInput,
  token = null,
  value,
}: CurrencyInputPanelProps) {
  const { account } = useActiveWeb3React()

  return (
    <FormRow>
      <FormLabel
        extraControls={onMax && account && <ControlButton onClick={onMax}>Max</ControlButton>}
        text={'Amount'}
      />
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
