import React, { useState } from "react";
import styled from "styled-components";
import { isAddress } from "../../utils";
import { useActiveWeb3React } from "../../hooks";
import { WETH } from "uniswap-xdai-sdk";

import EthereumLogo from "../../assets/images/ethereum-logo.png";

const TOKEN_ICON_API = (address) =>
  `https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/ethereum/assets/${address}/logo.png`;
const BAD_IMAGES = {};

const Image = styled.img<{ size: string }>`
  width: ${({ size }) => size};
  height: ${({ size }) => size};
  background-color: white;
  border-radius: ${({ size }) => size};
  box-shadow: 0px 6px 10px rgba(0, 0, 0, 0.075);
`;

const Emoji = styled.span<{ size?: string }>`
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: ${({ size }) => size};
  width: ${({ size }) => size};
  height: ${({ size }) => size};
  margin-bottom: -4px;
`;

const StyledEthereumLogo = styled.img<{ size: string }>`
  width: ${({ size }) => size};
  height: ${({ size }) => size};
  box-shadow: 0px 6px 10px rgba(0, 0, 0, 0.075);
  border-radius: 24px;
`;

export default function TokenLogo({
  address,
  size = "24px",
  ...rest
}: {
  address?: string;
  size?: string;
  style?: React.CSSProperties;
}) {
  const [error, setError] = useState(false);
  const { chainId } = useActiveWeb3React();

  // mock rinkeby DAI
  if (
    chainId === 4 &&
    address &&
    address.toLowerCase() ===
      "0x5592EC0cfb4dbc12D3aB100b257153436a1f0FEa".toLowerCase()
  ) {
    address = "0x6B175474E89094C44Da98b954EedeAC495271d0F";
  }
  // mock rinkeby WBTC
  if (
    chainId === 4 &&
    address &&
    address.toLowerCase() ===
      "0x577d296678535e4903d59a4c929b718e1d575e0a".toLowerCase()
  ) {
    address = "0x2260FAC5E5542a773Aa44fBCfeDf7C193bc2C599";
  }

  // mock rinkeby GNO
  if (
    chainId === 4 &&
    address &&
    address.toLowerCase() ===
      "0xd0dab4e640d95e9e8a47545598c33e31bdb53c7c".toLowerCase()
  ) {
    address = "0x6810e776880C02933D47DB1b9fc05908e5386b96";
  }

  // mock rinkeby STAKE on xDAI
  if (
    chainId === 100 &&
    address &&
    address.toLowerCase() ===
      "0xb7D311E2Eb55F2f68a9440da38e7989210b9A05e".toLowerCase()
  ) {
    address = "0x0Ae055097C6d159879521C384F1D2123D1f195e6";
  }

  let path = "";
  // hard code to show ETH instead of WETH in UI
  if (
    address &&
    address.toLowerCase() === WETH[chainId].address.toLowerCase()
  ) {
    return <StyledEthereumLogo src={EthereumLogo} size={size} {...rest} />;
  } else if (!error && !BAD_IMAGES[address] && isAddress(address)) {
    path = TOKEN_ICON_API(address);
  } else {
    return (
      <Emoji {...rest} size={size}>
        <span role="img" aria-label="Thinking">
          🤔
        </span>
      </Emoji>
    );
  }

  return (
    <Image
      {...rest}
      // alt={address}
      src={path}
      size={size}
      onError={() => {
        BAD_IMAGES[address] = true;
        setError(true);
      }}
    />
  );
}
