import React from 'react'
import styled from 'styled-components'

import { useTokenListState } from '../../state/tokenList/hooks'
import { isAddress } from '../../utils'

const Image = styled.img<{ size: string }>`
  border-radius: 50%;
  height: ${({ size }) => size};
  position: relative;
  top: -1px;
  width: ${({ size }) => size};
`

interface TokenLogoProps {
  address: string
  size?: string
  style?: React.CSSProperties
}

export default function TokenLogo({ address, size = '24px', ...rest }: TokenLogoProps) {
  const { tokens } = useTokenListState()

  if (isAddress(address) && tokens && tokens.length > 0) {
    const tokenInfo = tokens.find((token) => token.address.toLowerCase() === address.toLowerCase())

    if (tokenInfo) {
      return <Image {...rest} size={size} src={tokenInfo.logoURI} />
    }
  }

  return <></>
}
