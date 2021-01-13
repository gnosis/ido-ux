import React from "react";
// import { Text } from "rebass";
import {
  useSwapState,
  useDerivedSwapInfo,
} from "../../state/orderplacement/hooks";
import styled from "styled-components";
import { Fraction } from "@uniswap/sdk";
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
  const { auctionId } = useSwapState();
  const {
    auctioningToken,
    biddingToken,
    auctionEndDate,
    initialAuctionOrder,
    clearingPriceOrder,
  } = useDerivedSwapInfo(auctionId);

  let clearingPrice: Fraction | undefined;
  if (
    !clearingPriceOrder ||
    clearingPriceOrder.buyAmount == undefined ||
    clearingPriceOrder.sellAmount == undefined
  ) {
    clearingPrice = undefined;
  } else {
    clearingPrice = new Fraction(
      clearingPriceOrder.sellAmount.raw.toString(),
      clearingPriceOrder.buyAmount.raw.toString(),
    );
  }
  return (
    <Wrapper>
      {auctionEndDate && <CountdownTimer auctionEndDate={auctionEndDate} />}
      {auctionEndDate >= new Date().getTime() / 1000 ? (
        <h3>
          Selling {initialAuctionOrder?.sellAmount.toSignificant(2)}{" "}
          {auctioningToken?.symbol} for at least{" "}
          {initialAuctionOrder?.buyAmount.toSignificant(2)}{" "}
          {biddingToken?.symbol}
        </h3>
      ) : clearingPrice?.toSignificant(1) == "0" ? (
        <h3>🗓️ This auction is scheduled</h3>
      ) : (
        <h3>
          ✅ Auction settled with a price of {clearingPrice?.toSignificant(4)} [
          {auctioningToken?.symbol} per {biddingToken?.symbol} ]
        </h3>
      )}
    </Wrapper>
  );
}
