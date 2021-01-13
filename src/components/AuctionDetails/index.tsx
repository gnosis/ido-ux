import React from "react";
import styled from "styled-components";
import { ExternalLink } from "../../theme";
import {
  useSwapState,
  useDerivedSwapInfo,
} from "../../state/orderplacement/hooks";
import { Fraction } from "@uniswap/sdk";
import { OrderBookBtn } from "../OrderbookBtn";
import { getEtherscanLink } from "../../utils";
import { useActiveWeb3React } from "../../hooks";

const Wrapper = styled.div`
  position: relative;
  width: calc(50% - 8px);
  background: none;
  border: ${({ theme }) => `1px solid ${theme.bg2}`};
  box-shadow: none;
  border-radius: 20px;
  padding: 16px;
  flex: 0 1 auto;
  box-sizing: border-box;
  display: flex;
  flex-flow: column wrap;

  ${({ theme }) => theme.mediaWidth.upToMedium`
    width: 100%;
    margin: 0 0 16px;
  `};
`;

const Title = styled.div`
  color: ${({ theme }) => theme.text1};
  font-size: 18px;
  margin: 0 0 16px;
`;

const Details = styled.div`
  color: ${({ theme }) => theme.text1};
  font-size: 15px;
  font-weight: normal;
  width: 100%;
  display: flex;
  flex-flow: column wrap;
  margin: 0 0 16px;
`;

const Row = styled.span`
  display: flex;
  flex-flow: row wrap;
  width: 100%;
  justify-content: space-between;
  align-items: flex-start;
  margin: 0 0 3px;
  font-weight: 700;

  > i {
    color: ${({ theme }) => theme.text2};
    font-weight: normal;
    font-style: normal;
  }

  > p {
    margin: 0;
    padding: 0;
  }
`;

export default function AuctionDetails() {
  const { auctionId } = useSwapState();
  const { chainId } = useActiveWeb3React();

  const {
    auctionEndDate,
    auctioningToken,
    biddingToken,
    clearingPriceOrder,
  } = useDerivedSwapInfo(auctionId);

  const auctionEnded = auctionEndDate <= new Date().getTime() / 1000;

  const auctionEndDateString = new Date(
    auctionEndDate * 1000,
  ).toLocaleDateString();

  const auctionTokenAddress = getEtherscanLink(
    chainId,
    auctioningToken?.address,
    "address",
  );

  const biddingTokenAddress = getEtherscanLink(
    chainId,
    biddingToken?.address,
    "address",
  );

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
    <>
      <Wrapper>
        <Title>Auction Details</Title>
        <Details>
          <Row>
            <i>Id</i> <p>{auctionId}</p>
          </Row>
          <Row>
            <i>Status</i>
            <p>{auctionEnded ? "Ended" : "Ongoing"}</p>
          </Row>
          <Row>
            <i> {auctionEnded ? "End date" : "Ends"}</i>
            <p>{auctionEndDateString}</p>
          </Row>
          <Row>
            <i>Selling</i>
            <ExternalLink href={auctionTokenAddress}>
              {auctioningToken?.symbol} ↗
            </ExternalLink>
          </Row>
          <Row>
            <i>Buying</i>
            <ExternalLink href={biddingTokenAddress}>
              {biddingToken?.symbol} ↗
            </ExternalLink>
          </Row>
          <Row>
            <i>Price</i>
            <p>
              {clearingPrice?.toSignificant(4)}&nbsp;
              {auctioningToken?.symbol} per {biddingToken?.symbol}
            </p>
          </Row>
        </Details>

        <OrderBookBtn baseToken={auctioningToken} quoteToken={biddingToken} />
      </Wrapper>
    </>
  );
}
