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
  flex-flow: row nowrap;
  justify-content: space-between;
  margin: 0 0 16px;

  > h3 {
    flex: 1 1 auto;
    display: flex;
    text-align: center;
    align-items: center;
    margin: 0 auto;
    font-size: 16px;
    font-weight: normal;
  }

  > h3 > b {
    margin: 0 5px;
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
          Selling{" "}
          <b>
            {initialAuctionOrder?.sellAmount.toSignificant(2)}{" "}
            {auctioningToken?.symbol}
          </b>{" "}
          for at least{" "}
          <b>
            {initialAuctionOrder?.buyAmount.toSignificant(2)}{" "}
            {biddingToken?.symbol}
          </b>
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
      {renderAuctionStatus({
        auctioningToken,
        biddingToken,
        auctionState,
        initialAuctionOrder,
      })}
      <CountdownTimer auctionEndDate={auctionEndDate} />
    </Wrapper>
  );
}
