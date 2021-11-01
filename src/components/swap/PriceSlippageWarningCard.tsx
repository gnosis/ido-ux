import React, { useContext } from 'react'
import { ThemeContext } from 'styled-components'

import { Percent } from '@josojo/honeyswap-sdk'
import { Text } from 'rebass'

import { YellowCard } from './Card'
import { AutoColumn } from './Column'
import { RowBetween, RowFixed } from './Row'

export function PriceSlippageWarningCard({ priceSlippage }: { priceSlippage: Percent }) {
  const theme = useContext(ThemeContext)
  return (
    <YellowCard style={{ padding: '20px', paddingTop: '10px' }}>
      <AutoColumn gap="md">
        <RowBetween>
          <RowFixed style={{ paddingTop: '8px' }}>
            <span aria-label="warning" role="img">
              ⚠️
            </span>{' '}
            <Text color={theme.text1} fontWeight={500} marginLeft="4px">
              Price Warning
            </Text>
          </RowFixed>
        </RowBetween>
        <Text color={theme.text1} fontSize={16} fontWeight={400} lineHeight="145.23%;">
          This trade will move the price by ~{priceSlippage.toFixed(2)}%.
        </Text>
      </AutoColumn>
    </YellowCard>
  )
}
