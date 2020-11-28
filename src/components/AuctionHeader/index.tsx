import React from "react";
import styled from "styled-components";
import { useSwapState, useDerivedSwapInfo } from "../../state/swap/hooks";
import CountdownTimer from "../CountDown";
import { Text } from "rebass";

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
  const { auctionId, independentField, buyAmount, price } = useSwapState();
  const {
    bestTrade,
    tokenBalances,
    parsedAmounts,
    tokens,
    error,
    sellToken,
    buyToken,
    auctionEndDate,
    sellOrder,
  } = useDerivedSwapInfo(auctionId);

  return (
    <>
      <div style={{ float: "right", width: "20%" }}>
        <CountdownTimer auctionEndDate={auctionEndDate} />
      </div>
      <div style={{ float: "left", width: "80%" }}>
        <h1>Auction</h1>
        <h3>
          Selling {sellOrder?.sellAmount} {sellToken?.symbol} for at least{" "}
          {sellOrder?.buyAmount} {buyToken?.symbol}
        </h3>
        <br></br>
        <br></br>
      </div>
    </>
  );
}
