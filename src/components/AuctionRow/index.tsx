import React from "react";
import styled from "styled-components";
import { AuctionInfo } from "../../hooks/useInterestingAuctionDetails";
import DoubleLogo from "../DoubleLogo";
import { ButtonLight } from "../Button";
import { useHistory } from "react-router-dom";

const HeaderWrapper = styled.div`
  display: flex;
  width: 100%;
  align-content: center;
  text-align: center;
  flex-flow: row nowrap;
  justify-content: space-between;
  margin: 0;
  background: ${({ theme }) => theme.bg2};
  border-radius: 20px;
  padding: 16px;
  box-sizing: border-box;
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
      margin: 0;
      text-align: center;
      justify-content: center;
    `};
  }

  > h5 {
    width: 100%;
    margin: auto;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 16px;
    min-height: 150px;
  }

  > h4 > b {
    margin: 0 5px;
  }
`;

const ViewBtn = styled(ButtonLight)`
  background: none;
  width: 100%;
  color: ${({ theme }) => theme.text3};

  &:hover {
    background: none;
  }

  > svg {
    margin: 0 0 0 5px;
  }
`;

const Details = styled.div`
  color: ${({ theme }) => theme.text1};
  font-size: 13px;
  width: 100%;
  font-weight: normal;
  display: flex;
  flex-flow: column wrap;
  border-radius: 20px;
`;

export default function AuctionRow(auctionInfo: AuctionInfo) {
  const history = useHistory();

  function handleClick() {
    history.push(`/auction?auctionId=${auctionInfo.auctionId}`);
  }

  return (
    <ViewBtn onClick={handleClick} type="button">
      <Details>
        <HeaderWrapper>
          <h3>
            AuctionId: {auctionInfo.auctionId + ` `} Selling{" "}
            {auctionInfo.order.volume + ` `}
            {auctionInfo.symbolAuctioningToken}
          </h3>
          <DoubleLogo
            a0={auctionInfo.addressAuctioningToken}
            a1={auctionInfo.addressBiddingToken}
            size={40}
            margin={true}
          />
        </HeaderWrapper>
      </Details>
    </ViewBtn>
  );
}
