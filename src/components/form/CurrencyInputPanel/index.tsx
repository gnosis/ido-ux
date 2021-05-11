import React from 'react'
import { Token } from 'uniswap-xdai-sdk'

import { useActiveWeb3React } from '../../../hooks'
import { ChainId, getTokenDisplay } from '../../../utils'
import {
  FieldRowBottom,
  FieldRowButton,
  FieldRowInput,
  FieldRowLabel,
  FieldRowToken,
  FieldRowTokenSymbol,
  FieldRowTop,
  FieldRowWrapper,
} from '../../pureStyledComponents/FieldRow'
import TokenLogo from '../../token/TokenLogo'

interface CurrencyInputPanelProps {
  chainId: ChainId
  onMax?: () => void
  onUserSellAmountInput: (val: string) => void
  token: Maybe<Token>
  value: string
}

export default function CurrencyInputPanel({
  chainId,
  onMax,
  onUserSellAmountInput,
  token = null,
  value,
}: CurrencyInputPanelProps) {
  const { account } = useActiveWeb3React()

  return (
    <FieldRowWrapper>
      <FieldRowTop>
        <FieldRowLabel>Amount</FieldRowLabel>
        {onMax && account && <FieldRowButton onClick={onMax}>Max</FieldRowButton>}
      </FieldRowTop>
      <FieldRowBottom>
        {token && (
          <FieldRowToken>
            {token.address && (
              <TokenLogo size={'15px'} token={{ address: token.address, symbol: token.symbol }} />
            )}
            {token && token.symbol && (
              <FieldRowTokenSymbol>{getTokenDisplay(token, chainId)}</FieldRowTokenSymbol>
            )}
          </FieldRowToken>
        )}
        <FieldRowInput
          onUserSellAmountInput={(val) => {
            onUserSellAmountInput(val)
          }}
          value={value}
        />
      </FieldRowBottom>
    </FieldRowWrapper>
  )
}
