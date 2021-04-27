import React from 'react'
import styled from 'styled-components'
import { Token } from 'uniswap-xdai-sdk'

import { FormLabel } from '../../form/FormLabel'
import { Input as NumericalInput } from '../../form/NumericalInput'
import { FormRow } from '../../pureStyledComponents/FormRow'
import { TextfieldCSS } from '../../pureStyledComponents/Textfield'
import DoubleLogo from '../../token/DoubleLogo'

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
  auctioningToken: Maybe<Token>
  biddingToken: Maybe<Token>
  label: string
  onUserPriceInput: (val: string, isInvertedPrice: boolean) => void
  onInvertPrices: () => void
  value: string
  invertPrices: boolean
}

export default function PriceInputPanel({
  auctioningToken = null,
  biddingToken = null,
  invertPrices,
  label,
  onInvertPrices,
  onUserPriceInput,
  value,
}: CurrencyInputPanelProps) {
  return (
    <FormRow>
      <FormLabel onInvertPrices={onInvertPrices} text={label} />
      <TextfieldWrapper>
        <NumericalInput
          onUserSellAmountInput={(val) => {
            onUserPriceInput(val, invertPrices)
          }}
          value={value}
        />
        <TokenInfo>
          {auctioningToken && biddingToken ? (
            invertPrices ? (
              <DoubleLogo
                auctioningToken={{
                  address: biddingToken.address,
                  symbol: biddingToken.symbol,
                }}
                biddingToken={{
                  address: auctioningToken.address,
                  symbol: auctioningToken.symbol,
                }}
                size="24px"
              />
            ) : (
              <DoubleLogo
                auctioningToken={{
                  address: auctioningToken.address,
                  symbol: auctioningToken.symbol,
                }}
                biddingToken={{
                  address: biddingToken.address,
                  symbol: biddingToken.symbol,
                }}
                size="24px"
              />
            )
          ) : (
            '-'
          )}
        </TokenInfo>
      </TextfieldWrapper>
    </FormRow>
  )
}
