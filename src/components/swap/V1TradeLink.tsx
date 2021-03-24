import React, { useContext } from 'react'
import { ThemeContext } from 'styled-components'

import { Text } from 'rebass'

import { ExternalLink } from '../../theme'
import { YellowCard } from './Card'
import { AutoColumn } from './Column'

export default function V1TradeLink({ v1TradeLinkIfBetter }: { v1TradeLinkIfBetter: string }) {
  const theme = useContext(ThemeContext)
  return v1TradeLinkIfBetter ? (
    <YellowCard style={{ marginTop: '12px', padding: '8px 4px' }}>
      <AutoColumn gap="sm" justify="center" style={{ alignItems: 'center', textAlign: 'center' }}>
        <Text color={theme.text1} fontSize={14} fontWeight={400} lineHeight="145.23%;">
          There is a better price for this trade on{' '}
          <ExternalLink href={v1TradeLinkIfBetter}>
            <b>Uniswap V1 ↗</b>
          </ExternalLink>
        </Text>
      </AutoColumn>
    </YellowCard>
  ) : null
}
