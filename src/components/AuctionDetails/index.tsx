import React, { useContext } from "react";
import styled, { ThemeContext } from "styled-components";
import {
  useSwapState,
  useDerivedSwapInfo,
} from "../../state/orderplacement/hooks";
import { Text } from "rebass";

const Body = styled.div`
  align: center;
  position: relative;
  max-width: 420px;
  width: 100%;
  height: 330px;
  background: ${({ theme }) => theme.bg2};
  box-shadow: 0px 0px 1px rgba(0, 0, 0, 0.01), 0px 4px 8px rgba(0, 0, 0, 0.04),
    0px 16px 24px rgba(0, 0, 0, 0.04), 0px 24px 32px rgba(0, 0, 0, 0.01);
  border-radius: 30px;
  padding: 1rem;
`;

const BoxTitle = styled.div`
  align: center;
  justify-content: center;
  height: 3rem;
  flex: 1 0 auto;
  border-radius: 3rem;
  outline: none;
  cursor: pointer;
  text-decoration: none;
  color: ${({ theme }) => theme.text1};
  font-size: 20px;
`;

export default function AuctionDetails() {
  const { auctionId } = useSwapState();
  const theme = useContext(ThemeContext);

  const { auctionEndDate, sellToken, buyToken } = useDerivedSwapInfo(auctionId);
  const hrefLinkSellToken =
    "https://rinkeby.etherscan.io/token" + sellToken?.address;
  const hrefLinkBuyToken =
    "https://rinkeby.etherscan.io/token/" + buyToken?.address;

  return (
    <>
      <Body>
        <BoxTitle> Details </BoxTitle>
        <Text fontWeight={500} color="grey">
          <div style={{ width: "50%", float: "left", textAlign: "left" }}>
            Id:
            <br></br>
            Status:
            <br></br>
            End:
            <br></br>
            Legal:
            <br></br>
            SellToken:
            <br></br>
            BuyToken:
          </div>
          <div
            style={{
              width: "50%",
              float: "right",
              textAlign: "right",
              textDecoration: "none",
            }}
          >
            {auctionId}
            <br></br>
            {auctionEndDate <= new Date().getTime() / 1000
              ? "Ended"
              : "Ongoing"}
            <br></br>
            {new Date(auctionEndDate * 1000).toLocaleDateString()}
            <br></br>
            Utility
            <br></br>
            <a
              href={hrefLinkSellToken}
              style={{
                textDecoration: "none",
              }}
            >
              <Text fontWeight={500} fontSize={14} color={theme.primary1}>
                {sellToken?.symbol}
              </Text>
            </a>
            <a
              href={hrefLinkBuyToken}
              style={{
                textDecoration: "none",
              }}
            >
              <Text fontWeight={500} fontSize={14} color={theme.primary1}>
                {buyToken?.symbol}
              </Text>
            </a>
          </div>
        </Text>
      </Body>
    </>
  );
}
