import React from "react";
import styled from "styled-components";
import { ExternalLink } from "../../theme";
import {
  useSwapState,
  useDerivedAuctionInfo,
  AuctionState,
} from "../../state/orderPlacement/hooks";
import { Text } from "rebass";
import { OrderBookBtn } from "../OrderbookBtn";
import { getEtherscanLink } from "../../utils";
import { useActiveWeb3React } from "../../hooks";

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
  const { chainId } = useActiveWeb3React();

  const {
    auctionState,
    auctionEndDate,
    auctioningToken,
    biddingToken,
  } = useDerivedAuctionInfo();

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
            {auctionState == AuctionState.ORDER_PLACING ||
            auctionState == AuctionState.ORDER_PLACING_AND_CANCELING
              ? "Ongoing"
              : auctionState == AuctionState.PRICE_SUBMISSION
              ? "Clearing"
              : "Ended"}
            <br></br>
            {new Date(auctionEndDate * 1000).toLocaleDateString()}
            <br></br>
            <ExternalLink
              href={getEtherscanLink(
                chainId,
                auctioningToken?.address,
                "address",
              )}
              style={{ fontSize: "14px" }}
            >
              {auctioningToken?.symbol}
            </ExternalLink>
            <br></br>
            <ExternalLink
              href={getEtherscanLink(chainId, biddingToken?.address, "address")}
              style={{ fontSize: "14px" }}
            >
              {biddingToken?.symbol}
            </ExternalLink>
            <br></br>
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
