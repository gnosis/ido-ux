import React from "react";
import {
  AuctionState,
  useDerivedAuctionInfo,
} from "../../state/orderPlacement/hooks";
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

const renderAuctionStatus = ({
  auctioningToken,
  biddingToken,
  auctionState,
  initialAuctionOrder,
}) => {
  switch (auctionState) {
    case AuctionState.ORDER_PLACING:
    case AuctionState.ORDER_PLACING_AND_CANCELING:
      return (
        <h3>
          Selling {initialAuctionOrder?.sellAmount.toSignificant(2)}{" "}
          {auctioningToken?.symbol} for at least{" "}
          {initialAuctionOrder?.buyAmount.toSignificant(2)}{" "}
          {biddingToken?.symbol}
        </h3>
      );

    case AuctionState.PRICE_SUBMISSION:
      return <h3>🗓️ Auction is scheduled</h3>;

    default:
      return <h3>🏁 Auction is settled</h3>;
  }
};

export default function AuctionHeader() {
  const {
    auctioningToken,
    auctionEndDate,
    biddingToken,
    auctionState,
    initialAuctionOrder,
  } = useDerivedAuctionInfo();

  return (
    <Wrapper>
      <CountdownTimer auctionEndDate={auctionEndDate} />
      {renderAuctionStatus({
        auctioningToken,
        biddingToken,
        auctionState,
        initialAuctionOrder,
      })}
    </Wrapper>
  );
}
