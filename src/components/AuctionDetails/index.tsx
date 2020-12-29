import React, { useContext } from "react";
import styled, { ThemeContext } from "styled-components";
import {
  useSwapState,
  useDerivedSwapInfo,
} from "../../state/orderplacement/hooks";
import { Text } from "rebass";
import { OrderBookBtn } from "../OrderbookBtn";

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

  const { auctionEndDate, auctioningToken, biddingToken } = useDerivedSwapInfo(
    auctionId,
  );
  const hrefLinkauctioningToken =
    "https://rinkeby.etherscan.io/token" + auctioningToken?.address;
  const hrefLinkbiddingToken =
    "https://rinkeby.etherscan.io/token/" + biddingToken?.address;

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
            Sold:
            <br></br>
            Bought:
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
              href={hrefLinkauctioningToken}
              style={{
                textDecoration: "none",
              }}
            >
              <Text fontWeight={500} fontSize={14} color={theme.primary1}>
                {auctioningToken?.symbol}
              </Text>
            </a>
            <a
              href={hrefLinkbiddingToken}
              style={{
                textDecoration: "none",
              }}
            >
              <Text fontWeight={500} fontSize={14} color={theme.primary1}>
                {biddingToken?.symbol}
              </Text>
            </a>
          </div>
        </Text>
        <br></br>
        <div
          //TODO: get a proper design here
          style={{
            marginTop: "170px",
          }}
        >
          <OrderBookBtn baseToken={auctioningToken} quoteToken={biddingToken} />
        </div>
      </Body>
    </>
  );
}
