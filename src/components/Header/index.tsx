import React from "react";
import { Link as HistoryLink } from "react-router-dom";

import styled from "styled-components";
import { useTokenBalanceTreatingWETHasETH } from "../../state/wallet/hooks";

import Row from "../Row";
import Menu from "../Menu";
import Web3Status from "../Web3Status";
import DarkModeSwitch from "../DarkModeSwitch";

import { WETH, ChainId } from "@uniswap/sdk";
import { isMobile } from "react-device-detect";
import { YellowCard } from "../Card";
import { useActiveWeb3React } from "../../hooks";

import { RowBetween } from "../Row";

const HeaderFrame = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  flex-direction: column;
  width: 100%;
  top: 0;
  position: absolute;
  pointer-events: none;

  ${({ theme }) => theme.mediaWidth.upToExtraSmall`
    padding: 12px 0 0 0;
    position: relative;
  `};
  z-index: 2;
`;

const HeaderElement = styled.div`
  display: flex;
  align-items: center;

  ${({ theme }) => theme.mediaWidth.upToMedium`
    flex-direction: row;
    justify-content: space-between;
    justify-self: center;
    padding: 0 10px;
    position: fixed;
    bottom: 0px;
    left: 0px;
    width: 100%;
    z-index: 99;
    height: 72px;
    border-radius: 12px 12px 0px 0px;
    background-color: ${({ theme }) => theme.bg3};
    box-sizing: border-box;
  `};
`;

const Title = styled.div`
  display: flex;
  align-items: center;
  pointer-events: auto;

  :hover {
    cursor: pointer;
  }
`;

const TitleText = styled(Row)`
  width: fit-content;
  font-size: 18px;
  font-weight: 700;
  white-space: nowrap;
  color: ${({ theme }) => theme.text1};
  ${({ theme }) => theme.mediaWidth.upToExtraSmall`
    display: none;
  `};
  > a {
    color: inherit;
    text-decoration: none;
  }
`;

const EthBalance = styled.div`
  display: flex;
  align-items: center;
  pointer-events: auto;
  padding: 0 10px;

  ${({ theme }) => theme.mediaWidth.upToMedium`
    background-color: ${({ theme }) => theme.bg3};
  `};

  ${({ theme }) => theme.mediaWidth.upToSmall`
    display: none;
  `};
`;

const AccountElement = styled.div<{ active: boolean }>`
  display: flex;
  flex-direction: row;
  align-items: center;
  background-color: ${({ theme, active }) => (!active ? theme.bg1 : theme.bg3)};
  border-radius: 12px;
  white-space: nowrap;

  :focus {
    border: 1px solid blue;
  }

  ${({ theme }) => theme.mediaWidth.upToMedium`
    margin: 0 auto 0 0;
  `}
`;

const TestnetWrapper = styled.div`
  white-space: nowrap;
  width: fit-content;
  margin-left: 10px;

  ${({ theme }) => theme.mediaWidth.upToSmall`
    display: none;
  `};
`;

const NetworkCard = styled(YellowCard)`
  width: fit-content;
  margin-right: 10px;
  border-radius: 12px;
  padding: 8px 12px;
`;

export default function Header() {
  const { account, chainId } = useActiveWeb3React();

  const userEthBalance = useTokenBalanceTreatingWETHasETH(
    account,
    WETH[chainId],
  );

  return (
    <HeaderFrame>
      <RowBetween padding="1rem">
        <HeaderElement>
          <Title>
            {!isMobile && (
              <TitleText>
                <HistoryLink id="link" to="/">
                  🏁 EasyAuction
                </HistoryLink>
              </TitleText>
            )}
          </Title>
          <TestnetWrapper style={{ pointerEvents: "auto" }}></TestnetWrapper>
        </HeaderElement>
        <HeaderElement>
          <TestnetWrapper>
            {!isMobile && chainId === ChainId.ROPSTEN && (
              <NetworkCard>Ropsten</NetworkCard>
            )}
            {!isMobile && chainId === ChainId.RINKEBY && (
              <NetworkCard>Rinkeby</NetworkCard>
            )}
            {!isMobile && chainId === ChainId.GÖRLI && (
              <NetworkCard>Görli</NetworkCard>
            )}
            {!isMobile && chainId === ChainId.KOVAN && (
              <NetworkCard>Kovan</NetworkCard>
            )}
          </TestnetWrapper>
          <AccountElement active={!!account} style={{ pointerEvents: "auto" }}>
            {account && userEthBalance ? (
              <EthBalance>{userEthBalance?.toSignificant(4)} ETH</EthBalance>
            ) : null}
            <Web3Status />
          </AccountElement>
          <div style={{ pointerEvents: "auto" }}>
            <Menu />
          </div>
        </HeaderElement>
        <DarkModeSwitch />
      </RowBetween>
    </HeaderFrame>
  );
}
