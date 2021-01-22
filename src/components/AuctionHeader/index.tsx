import React from "react";
import {
  AuctionState,
  SellOrder,
  useDerivedAuctionInfo,
  useDerivedAuctionState,
} from "../../state/orderPlacement/hooks";
import styled from "styled-components";
import CountdownTimer from "../CountDown";
import { Token } from "@uniswap/sdk";

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
    font-weight: normal;
  }

  > h4 {
    flex: 1 1 auto;
    display: flex;
    text-align: center;
    align-items: center;
    margin: 0 auto;
    font-size: 16px;
    font-weight: normal;
  }

  > h5 {
    width: 100%;
    margin: auto;
    font-size: 16px;
    min-height: 150px;
  }

  > h4 > b {
    margin: 0 5px;
  }
`;

const renderAuctionStatus = ({
  auctionState,
  auctioningToken,
  biddingToken,
  initialAuctionOrder,
}: {
  auctionState: AuctionState;
  auctioningToken: Pick<Token, "symbol">;
  biddingToken: Pick<Token, "symbol">;
  initialAuctionOrder: Pick<SellOrder, "sellAmount" | "buyAmount">;
}) => {
  switch (auctionState) {
    case AuctionState.ORDER_PLACING:
    case AuctionState.ORDER_PLACING_AND_CANCELING:
      return (
        <h4>
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
        </h4>
      );

    case AuctionState.PRICE_SUBMISSION:
      return <h3>🗓️ Auction is scheduled</h3>;

    default:
      return <h3>🏁 Auction is settled</h3>;
  }
};

export function AuctionHeaderForScheduledAuction() {
  const {
    auctioningToken,
    biddingToken,
    initialAuctionOrder,
    auctionEndDate,
  } = useDerivedAuctionInfo();
  const { auctionState } = useDerivedAuctionState();

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

export default function AuctionHeader() {
  const { auctionState } = useDerivedAuctionState();
  return (
    <Wrapper>
      {auctionState == AuctionState.NOT_YET_STARTED ? (
        <h5>⌛ Auction not yet started</h5>
      ) : (
        <AuctionHeaderForScheduledAuction />
      )}
    </Wrapper>
  );
}
