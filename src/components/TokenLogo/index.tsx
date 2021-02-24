import React, { useState } from 'react'
import styled from 'styled-components'
import { WETH } from 'uniswap-xdai-sdk'

import EthereumLogo from '../../assets/images/ethereum-logo.png'
import { useActiveWeb3React } from '../../hooks'
import { isAddress } from '../../utils'

const TOKEN_ICON_API = (address) =>
  `https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/ethereum/assets/${address}/logo.png`
const BAD_IMAGES = {}

const Image = styled.img<{ size: string }>`
  border-radius: ${({ size }) => size};
  height: ${({ size }) => size};
  width: ${({ size }) => size};
`

const StyledEthereumLogo = styled.img<{ size: string }>`
  border-radius: 24px;
  height: ${({ size }) => size};
  width: ${({ size }) => size};
`

const TokenLogo = ({
  address,
  size = '24px',
  ...rest
}: {
  address?: string
  size?: string
  style?: React.CSSProperties
}) => {
  const [error, setError] = useState(false)
  const { chainId } = useActiveWeb3React()

  // mock rinkeby DAI
  if (
    chainId === 4 &&
    address &&
    address.toLowerCase() === '0x5592EC0cfb4dbc12D3aB100b257153436a1f0FEa'.toLowerCase()
  ) {
    address = '0x6B175474E89094C44Da98b954EedeAC495271d0F'
  }
  // mock rinkeby WBTC
  if (
    chainId === 4 &&
    address &&
    address.toLowerCase() === '0x577d296678535e4903d59a4c929b718e1d575e0a'.toLowerCase()
  ) {
    address = '0x2260FAC5E5542a773Aa44fBCfeDf7C193bc2C599'
  }

  // mock rinkeby GNO
  if (
    chainId === 4 &&
    address &&
    address.toLowerCase() === '0xd0dab4e640d95e9e8a47545598c33e31bdb53c7c'.toLowerCase()
  ) {
    address = '0x6810e776880C02933D47DB1b9fc05908e5386b96'
  }

  // mock rinkeby STAKE on xDAI
  if (
    chainId === 100 &&
    address &&
    address.toLowerCase() === '0xb7D311E2Eb55F2f68a9440da38e7989210b9A05e'.toLowerCase()
  ) {
    address = '0x0Ae055097C6d159879521C384F1D2123D1f195e6'
  }

  let path = ''

  // hard code to show ETH instead of WETH in UI
  if (address && address.toLowerCase() === WETH[chainId].address.toLowerCase()) {
    return <StyledEthereumLogo size={size} src={EthereumLogo} {...rest} />
  } else if (!error && !BAD_IMAGES[address] && isAddress(address)) {
    path = TOKEN_ICON_API(address)
  } else {
    return <></>
  }

  return (
    <Image
      {...rest}
      onError={() => {
        BAD_IMAGES[address] = true
        setError(true)
      }}
      size={size}
      src={path}
    />
  )
}

export default TokenLogo
