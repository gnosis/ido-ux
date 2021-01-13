import React from "react";
import { Text } from "rebass";
import {
  AuctionState,
  useDerivedAuctionInfo,
} from "../../state/orderPlacement/hooks";
import CountdownTimer from "../CountDown";

export default function AuctionHeader() {
  const {
    auctionState,
    auctioningToken,
    biddingToken,
    auctionEndDate,
    initialAuctionOrder,
    clearingPrice,
  } = useDerivedAuctionInfo();

  return (
    <>
      <div style={{ float: "right", width: "20%" }}>
        <CountdownTimer auctionEndDate={auctionEndDate} />
      </div>
      <div style={{ float: "left", width: "80%", paddingBottom: "30px" }}>
        <div>
          <Text fontSize={30} fontWeight={"bold"}>
            Auction
          </Text>
        </div>
        {auctionState == AuctionState.ORDER_PLACING ||
        auctionState == AuctionState.ORDER_PLACING_AND_CANCELING ? (
          <div>
            <h3>
              Selling {initialAuctionOrder?.sellAmount.toSignificant(2)}{" "}
              {auctioningToken?.symbol} for at least{" "}
              {initialAuctionOrder?.buyAmount.toSignificant(2)}{" "}
              {biddingToken?.symbol}
            </h3>
          </div>
        ) : auctionState == AuctionState.PRICE_SUBMISSION ? (
          <div>
            <h3>Auction ready for price submission tx.</h3>
          </div>
        ) : (
          <div>
            <h3>
              Auction settled with a price of {clearingPrice?.toSignificant(4)}{" "}
              [{auctioningToken?.symbol} /{biddingToken?.symbol} ]
            </h3>
          </div>
        )}
      </div>
    </>
  );
}
