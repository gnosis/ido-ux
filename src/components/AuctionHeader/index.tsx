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

  ${({ theme }) => theme.mediaWidth.upToMedium`
    flex-flow: column wrap;
  `};

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
    font-size: 18px;
    font-weight: normal;

    ${({ theme }) => theme.mediaWidth.upToMedium`
      margin: 0 0 16px;
      text-align: center;
      justify-content: center;
    `};
  }

  > h4 > b {
    margin: 0 5px;
  }
`;

const renderAuctionStatus = ({
  auctioningToken,
  auctionState,
  initialAuctionOrder,
}: Pick<
  ReturnType<typeof useDerivedAuctionInfo>,
  "auctioningToken" | "biddingToken" | "auctionState" | "initialAuctionOrder"
>) => {
  switch (auctionState) {
    case AuctionState.ORDER_PLACING:
    case AuctionState.ORDER_PLACING_AND_CANCELING:
      return (
        <h4>
          <span>Selling</span>
          <b>
            {initialAuctionOrder?.sellAmount.toSignificant(2)}{" "}
            {auctioningToken?.symbol}
          </b>
        </h4>
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
    biddingToken,
    auctionState,
    initialAuctionOrder,
    auctionEndDate,
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
