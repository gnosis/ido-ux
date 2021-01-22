import React, { useMemo } from "react";
import styled from "styled-components";
import { ExternalLink } from "../../theme";
import {
  useSwapState,
  useDerivedAuctionInfo,
  AuctionState,
} from "../../state/orderPlacement/hooks";

import { OrderBookBtn } from "../OrderbookBtn";
import { getEtherscanLink, getTokenDisplay } from "../../utils";
import { useActiveWeb3React } from "../../hooks";

const Wrapper = styled.div`
  position: relative;
  width: calc(40% - 8px);
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
    order: 1;
  `};
`;

const Details = styled.div`
  color: ${({ theme }) => theme.text1};
  font-size: 13px;
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
  font-weight: normal;

  > i {
    color: ${({ theme }) => theme.text3};
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
    auctionState,
    auctionEndDate,
    auctioningToken,
    biddingToken,
    clearingPrice,
    initialAuctionOrder,
    initialPrice,
  } = useDerivedAuctionInfo();

  const auctionTokenAddress = useMemo(
    () => getEtherscanLink(chainId, auctioningToken?.address, "address"),
    [chainId, auctioningToken],
  );

  const biddingTokenAddress = useMemo(
    () => getEtherscanLink(chainId, biddingToken?.address, "address"),
    [chainId, biddingToken],
  );

  const auctionEndDateString = new Date(
    auctionEndDate * 1000,
  ).toLocaleDateString();

  const clearingPriceNumber =
    clearingPrice && Number(clearingPrice.toSignificant(4));

  const biddingTokenDisplay = useMemo(() => getTokenDisplay(biddingToken), [
    biddingToken,
  ]);

  const auctioningTokenDisplay = useMemo(
    () => getTokenDisplay(auctioningToken),
    [auctioningToken],
  );

  const clearingPriceDisplay = !!clearingPriceNumber
    ? `${clearingPriceNumber} ${getTokenDisplay(
        auctioningToken,
      )} per ${getTokenDisplay(biddingToken)}`
    : "-";

  return (
    <Wrapper>
      <Details>
        <div>
          <Row>
            <i>
              {" "}
              {auctionState == AuctionState.ORDER_PLACING ||
              auctionState == AuctionState.ORDER_PLACING_AND_CANCELING
                ? "Current"
                : auctionState == AuctionState.PRICE_SUBMISSION
                ? "Clearing"
                : "Closing"}{" "}
              price
            </i>
            <p>{clearingPriceDisplay}</p>
          </Row>
          <Row>
            <i>Bidding with</i>
            <ExternalLink href={biddingTokenAddress}>
              {biddingTokenDisplay} ↗
            </ExternalLink>
          </Row>

          <Row>
            <i>Total auctioned</i>
            <p>
              {initialAuctionOrder?.sellAmount.toSignificant(2)}{" "}
              <ExternalLink href={auctionTokenAddress}>
                {auctioningTokenDisplay} ↗
              </ExternalLink>
            </p>
          </Row>

          <Row>
            <i>Min. price</i>
            <p>
              {initialPrice ? initialPrice?.toSignificant(2) : " - "}
              {"  "}
              {biddingTokenDisplay} per {auctioningTokenDisplay}
            </p>
          </Row>
        </div>
        <Row>
          <i>Status</i>
          <p>
            {" "}
            {auctionState == AuctionState.ORDER_PLACING ||
            auctionState == AuctionState.ORDER_PLACING_AND_CANCELING
              ? "Ongoing"
              : auctionState == AuctionState.PRICE_SUBMISSION
              ? "Clearing"
              : "Ended"}
          </p>
        </Row>
        <Row>
          <i>Id</i> <p>{auctionId}</p>
        </Row>
        <Row>
          <i>Ends</i>
          <p>{auctionEndDateString}</p>
        </Row>
      </Details>

      <OrderBookBtn baseToken={auctioningToken} quoteToken={biddingToken} />
    </Wrapper>
  );
}
