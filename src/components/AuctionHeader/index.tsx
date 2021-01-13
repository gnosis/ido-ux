import React from "react";
// import { Text } from "rebass";
import {
  AuctionState,
  useDerivedAuctionInfo,
} from "../../state/orderplacement/hooks";
import styled from "styled-components";
import CountdownTimer from "../CountDown";

const Wrapper = styled.div`
  display: flex;
  width: 100%;
  align-content: center;
  text-align: center;

  > h3 {
    width: 100%;
    display: flex;
    text-align: center;
    margin: 16px auto 26px;
  }
`;

export default function AuctionHeader() {
  const {
    auctionState,
    auctioningToken,
    biddingToken,
    auctionEndDate,
    initialAuctionOrder,
  } = useDerivedAuctionInfo();

  return (
    <Wrapper>
      <CountdownTimer auctionEndDate={auctionEndDate} />

      {auctionState == AuctionState.ORDER_PLACING ||
      auctionState == AuctionState.ORDER_PLACING_AND_CANCELING ? (
        <h3>
          Selling {initialAuctionOrder?.sellAmount.toSignificant(2)}{" "}
          {auctioningToken?.symbol} for at least{" "}
          {initialAuctionOrder?.buyAmount.toSignificant(2)}{" "}
          {biddingToken?.symbol}
        </h3>
      ) : auctionState == AuctionState.PRICE_SUBMISSION ? (
        <h3>🗓️ Auction is scheduled</h3>
      ) : (
        <h3>🏁 Auction is settled</h3>
      )}
    </Wrapper>
  );
}
