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

interface Props {
  auctioningToken: Maybe<Token>
  biddingToken: Maybe<Token>
  invertPrices: boolean
  label: string
  onInvertPrices: () => void
  onUserPriceInput: (val: string, isInvertedPrice: boolean) => void
  value: string
}

const PriceInputPanel = (props: Props) => {
  const {
    auctioningToken = null,
    biddingToken = null,
    invertPrices,
    label,
    onInvertPrices,
    onUserPriceInput,
    value,
    ...restProps
  } = props

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

export default PriceInputPanel
