import React, { useContext } from 'react'
import { ThemeContext } from 'styled-components'

import { Trade } from '@uniswap/sdk'
import { Repeat } from 'react-feather'
import { Text } from 'rebass'

import { StyledBalanceMaxMini } from './styleds'

interface TradePriceProps {
  trade?: Trade
  showInverted: boolean
  setShowInverted: (showInverted: boolean) => void
}

export default function TradePrice({ setShowInverted, showInverted, trade }: TradePriceProps) {
  const theme = useContext(ThemeContext)
  const inputToken = trade?.inputAmount?.token
  const outputToken = trade?.outputAmount?.token

  const price = showInverted
    ? trade?.executionPrice?.toSignificant(6)
    : trade?.executionPrice?.invert()?.toSignificant(6)

  const label = showInverted
    ? `${outputToken?.symbol} per ${inputToken?.symbol}`
    : `${inputToken?.symbol} per ${outputToken?.symbol}`

  return (
    <Text
      color={theme.text2}
      fontSize={14}
      fontWeight={500}
      style={{
        justifyContent: 'center',
        alignItems: 'center',
        display: 'flex',
      }}
    >
      {price && `${price} ${label}`}
      <StyledBalanceMaxMini onClick={() => setShowInverted(!showInverted)}>
        <Repeat size={14} />
      </StyledBalanceMaxMini>
    </Text>
  )
}
