import React from "react";
import styled from "styled-components";
import AuctionInfoCard from "../../components/AuctionInfoCard";
import AuctionRow from "../../components/AuctionRow";
import { useAllAuctionInfo } from "../../hooks/useAllAuctionInfos";
import { useInterestingAuctionInfo } from "../../hooks/useInterestingAuctionDetails";
import AppBody from "../AppBody";

const Wrapper = styled.div`
  display: flex;
  width: 100%;
  flex-flow: row wrap;
  justify-content: space-between;
  align-items: stretch;
  ${({ theme }) => theme.mediaWidth.upToMedium`flex-flow: column wrap;`};
`;

const ThemeHeader = styled.div`
  display: flex;
  flex-flow: row wrap;
  padding: 2rem;
  min-width: 300px;
  min-height: 100px;
  align-items: stretch;
  background-position: center;
`;

const TitleText = styled.div`
  padding: 5rem;
  font-size: 33px;
  font-align: center;
  font-weight: 900;
`;

export default function Overview() {
  // Todo: think about how to get a network id without connection to metamaks
  const chainId = 4;
  const highlightedAuctions = useInterestingAuctionInfo(4, chainId);
  const allAuctions = useAllAuctionInfo(4, chainId);

  if (!highlightedAuctions || !allAuctions) return null;
  return (
    <>
      <ThemeHeader>
        <TitleText>EasyAuction - fairest token sales</TitleText>
      </ThemeHeader>
      <AppBody>
        <Wrapper>
          <h3>Highlighted auctions:</h3>
        </Wrapper>
        <Wrapper>
          {Object.entries(highlightedAuctions).map((auctionInfo) => (
            <AuctionInfoCard key={auctionInfo[0]} {...auctionInfo[1]} />
          ))}
        </Wrapper>
      </AppBody>
      <AppBody>
        <Wrapper>
          <h3>All auctions:</h3>
        </Wrapper>
        {Object.entries(allAuctions).map((auctionInfo) => (
          <AuctionRow key={auctionInfo[0]} {...auctionInfo[1]} />
        ))}
      </AppBody>
    </>
  );
}
