import React from "react";
import {
  useSwapState,
  useDerivedSwapInfo,
} from "../../state/orderplacement/hooks";
import CountdownTimer from "../CountDown";

export default function AuctionHeader() {
  const { auctionId } = useSwapState();
  const {
    sellToken,
    buyToken,
    auctionEndDate,
    initialAuctionOrder,
    clearingPriceOrder,
  } = useDerivedSwapInfo(auctionId);
  return (
    <>
      <div style={{ float: "right", width: "20%" }}>
        <CountdownTimer auctionEndDate={auctionEndDate} />
      </div>
      <div style={{ float: "left", width: "80%" }}>
        {auctionEndDate >= new Date().getTime() / 1000 ? (
          <div>
            <h1>Auction</h1>
            <h3>
              Selling {initialAuctionOrder?.sellAmount} {sellToken?.symbol} for
              at least {initialAuctionOrder?.buyAmount} {buyToken?.symbol}
            </h3>
          </div>
        ) : (
          <div>
            <h1>Auction</h1>
            <h3>
              Auction settled with a price of{" "}
              {clearingPriceOrder?.buyAmount / clearingPriceOrder.sellAmount}
            </h3>
          </div>
        )}
        <br></br>
        <br></br>
      </div>
    </>
  );
}
