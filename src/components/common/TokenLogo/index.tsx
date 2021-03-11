import React from 'react'
import styled from 'styled-components'

import { useTokenListState } from '../../../state/tokenList/hooks'
import { isAddress } from '../../../utils'

const Wrapper = styled.div<{ size?: string }>`
  background-color: #606467;
  border-radius: 50%;
  height: ${({ size }) => size};
  overflow: hidden;
  position: relative;
  top: -1px;
  width: ${({ size }) => size};
`

const Image = styled.img`
  display: block;
  height: 100%;
  width: 100%;
`

const Placeholder = styled.div<{ size?: string }>`
  align-items: center;
  color: #fff;
  display: flex;
  font-size: calc(${(props) => props.size} * 0.26);
  font-weight: bold;
  height: 100%;
  justify-content: center;
  letter-spacing: 0px;
  line-height: 1.3;
  text-align: center;
  width: 100%;
  white-space: nowrap;
`

interface TokenLogoProps {
  token: { address: string; symbol?: string }
  size?: string
}

const TokenLogo: React.FC<TokenLogoProps> = (props) => {
  const { size = '24px', token, ...restProps } = props
  const { address, symbol } = token
  const { tokens } = useTokenListState()
  const validToken = isAddress(address) && tokens && tokens.length > 0
  const tokenInfo =
    validToken && tokens.find((token) => token.address.toLowerCase() === address.toLowerCase())
  const imageURL = validToken && tokenInfo && tokenInfo.logoURI ? tokenInfo.logoURI : undefined
  const tokenSymbol = tokenInfo && tokenInfo.symbol ? tokenInfo.symbol : symbol

  return (
    <Wrapper size={size} {...restProps}>
      {imageURL ? <Image src={imageURL} /> : <Placeholder size={size}>{tokenSymbol}</Placeholder>}
    </Wrapper>
  )
}

export default TokenLogo
