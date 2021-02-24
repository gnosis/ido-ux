import React from 'react'
import styled from 'styled-components'

import TokenLogo from '../TokenLogo'

const TokenWrapper = styled.div`
  position: relative;
  display: flex;
  flex-direction: row;
  align-items: center;
`

interface DoubleTokenLogoProps {
  margin?: boolean
  size?: number
  a0: string
  a1: string
}

const HigherLogo = styled(TokenLogo)`
  z-index: 2;
`

const CoveredLogo = styled(TokenLogo)`
  margin-left: -5px;
`

export default function DoubleTokenLogo({ a0, a1, size = 28 }: DoubleTokenLogoProps) {
  return (
    <TokenWrapper>
      <HigherLogo address={a0} size={size.toString() + 'px'} />
      <CoveredLogo address={a1} size={size.toString() + 'px'} />
    </TokenWrapper>
  )
}
