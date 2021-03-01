import React from 'react'
import styled from 'styled-components'

import TokenLogo from '../../TokenLogo'

const TokenWrapper = styled.div`
  align-items: center;
  display: flex;
  flex-direction: row;
  position: relative;
`

interface DoubleTokenLogoProps {
  margin?: boolean
  size?: number
  a0: string
  a1: string
}

const HigherLogo = styled(TokenLogo)`
  z-index: 2;
  margin-right: -5px;
`

const CoveredLogo = styled(TokenLogo)``

export default function DoubleTokenLogo({ a0, a1, size = 28 }: DoubleTokenLogoProps) {
  return (
    <TokenWrapper>
      <HigherLogo address={a0} size={size.toString() + 'px'} />
      <CoveredLogo address={a1} size={size.toString() + 'px'} />
    </TokenWrapper>
  )
}
