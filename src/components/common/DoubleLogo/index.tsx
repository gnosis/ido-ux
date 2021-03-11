import React from 'react'
import styled from 'styled-components'

import TokenLogo from '../TokenLogo'

const TokenWrapper = styled.div`
  align-items: center;
  display: flex;
  flex-direction: row;
  position: relative;
`

const Logo = styled(TokenLogo)`
  border: 3px solid #001429;
`

const HigherLogo = styled(Logo)`
  margin-right: calc(-${(props) => props.size} / 3);
  z-index: 5;
`

const CoveredLogo = styled(Logo)`
  z-index: 1;
`

interface DoubleTokenLogoProps {
  auctioningToken: { address: string; symbol: string }
  biddingToken: { address: string; symbol: string }
  size?: string
}

const DoubleLogo: React.FC<DoubleTokenLogoProps> = (props) => {
  const { auctioningToken, biddingToken, size = '24px', ...restProps } = props

  return (
    <TokenWrapper {...restProps}>
      <HigherLogo size={size} token={auctioningToken} />
      <CoveredLogo size={size} token={biddingToken} />
    </TokenWrapper>
  )
}

export default DoubleLogo
