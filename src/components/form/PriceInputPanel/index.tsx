import React from 'react'
import styled from 'styled-components'
import { Token } from 'uniswap-xdai-sdk'

import DoubleLogo from '../../DoubleLogo'
import { FormLabel } from '../../form/FormLabel'
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
  margin-left: 15px;
`

interface CurrencyInputPanelProps {
  auctioningToken: Token | null
  biddingToken: Token | null
  label: string
  onUserPriceInput: (val: string) => void
  value: string
}

export default function PriceInputPanel({
  auctioningToken = null,
  biddingToken = null,
  label,
  onUserPriceInput,
  value,
}: CurrencyInputPanelProps) {
  return (
    <FormRow>
      <FormLabel text={label} />
      <TextfieldWrapper>
        <NumericalInput
          onUserSellAmountInput={(val) => {
            onUserPriceInput(val)
          }}
          value={value}
        />
        <TokenInfo>
          <DoubleLogo
            a0={biddingToken?.address}
            a1={auctioningToken?.address}
            margin={true}
            size={24}
          />
        </TokenInfo>
      </TextfieldWrapper>
    </FormRow>
  )
}
