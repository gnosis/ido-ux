import React from 'react'
import styled from 'styled-components'

import TokenLogo from '../TokenLogo'

const Wrapper = styled.div`
  align-items: center;
  display: flex;
  flex-direction: row;
  flex-shrink: 0;
  position: relative;
`

const HigherLogo = styled(TokenLogo)`
  margin-right: calc(-${(props) => props.size} / 3);
  z-index: 5;
`

const CoveredLogo = styled(TokenLogo)`
  z-index: 3;
`

interface DoubleTokenLogoProps {
  auctioningToken: { address: string; symbol: string }
  biddingToken: { address: string; symbol: string }
  size?: string
}

const DoubleLogo: React.FC<DoubleTokenLogoProps> = (props) => {
  const { auctioningToken, biddingToken, size = '24px', ...restProps } = props

  return (
    <Wrapper {...restProps}>
      <HigherLogo size={size} token={auctioningToken} />
      <CoveredLogo size={size} token={biddingToken} />
    </Wrapper>
  )
}

export default DoubleLogo
