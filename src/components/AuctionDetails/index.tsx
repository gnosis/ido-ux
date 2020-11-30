import React from "react";
import styled from "styled-components";
import { useSwapState, useDerivedSwapInfo } from "../../state/swap/hooks";
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
  const { auctionId, independentField, sellAmount, price } = useSwapState();
  const {
    bestTrade,
    tokenBalances,
    parsedAmounts,
    tokens,
    error,
    sellToken,
    buyToken,
    auctionEndDate,
  } = useDerivedSwapInfo(auctionId);

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
            Price:
            <br></br>
            End:
            <br></br>
            Legal:
            <br></br>
          </div>
          <div style={{ width: "50%", float: "right", textAlign: "right" }}>
            {auctionId}
            <br></br>
            {auctionEndDate <= new Date().getTime() / 1000
              ? "Ended"
              : "Ongoing"}
            <br></br>
            1.45
            <br></br>
            2020/1/12
            <br></br>
            Utility
          </div>
        </Text>
      </Body>
    </>
  );
}
