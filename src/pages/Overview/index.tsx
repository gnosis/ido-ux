import React from "react";
import styled from "styled-components";
import DatatablePage from "../../components/AllAuctionsTable";
import AuctionInfoCard from "../../components/AuctionInfoCard";
import AuctionRow from "../../components/AuctionRow";
import DoubleLogo from "../../components/DoubleLogo";
import { useAllAuctionInfo } from "../../hooks/useAllAuctionInfos";
import { useInterestingAuctionInfo } from "../../hooks/useInterestingAuctionDetails";
import AppBody from "../AppBody";
import { ButtonLight } from "../../components/Button";
import { useHistory } from "react-router-dom";

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
const Wrapper = styled.div`
  display: flex;
  width: 100%;
  height: 100%
  flex-flow: row wrap;
  padding: 1rem;
  justify-content: space-between;
  ${({ theme }) => theme.mediaWidth.upToMedium`flex-flow: column wrap;`};
`;

const TableWrapper = styled.div`
  display: block;
  position: relative;
  max-width: 700px;
  width: 100%;
  flex: 0 1 auto;

  box-sizing: border-box;
  box-shadow: 0px 0px 1px rgba(0, 0, 0, 0.01), 0px 4px 8px rgba(0, 0, 0, 0.04),
    0px 16px 24px rgba(0, 0, 0, 0.04), 0px 24px 32px rgba(0, 0, 0, 0.01);
  border-radius: 20px;
  padding: 16px;
  align-items: center;

  > div {
    width: 100%;
  }
`;

const ThemeHeader = styled.div`
  display: flex;
  flex-flow: row wrap;
  padding: 0.5rem;
  min-width: 300px;
  min-height: 20px;
  align-items: stretch;
  border-radius: 40px;
  background: ${({ theme }) => theme.bg1};
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
  const history = useHistory();

  function handleClick(auctionId: number) {
    history.push(`/auction?auctionId=${auctionId}`);
  }
  if (!highlightedAuctions || !allAuctions) return null;
  const tableData = [];
  allAuctions.forEach((item) => {
    tableData.push({
      auctionId: item.auctionId,
      selling: item.symbolAuctioningToken,
      buying: item.symbolBiddingToken,
      symbol: (
        <DoubleLogo
          a0={item.addressAuctioningToken}
          a1={item.addressBiddingToken}
          size={40}
          margin={true}
        />
      ),
      date: new Date(item.endTimeTimestamp * 1000).toLocaleDateString(),
      status:
        new Date(item.endTimeTimestamp * 1000) > new Date()
          ? "Ongoing"
          : "Ended",
      link: (
        <ViewBtn onClick={() => handleClick(item.auctionId)} type="button">
          {" "}
          view{" "}
        </ViewBtn>
      ),
    });
  });
  return (
    <>
      <ThemeHeader>
        <TitleText>EasyAuction - fairest auctions</TitleText>
      </ThemeHeader>
      <TableWrapper>
        <Wrapper>
          <h3>Highlighted auctions:</h3>
        </Wrapper>
        <Wrapper>
          {Object.entries(highlightedAuctions).map((auctionInfo) => (
            <AuctionInfoCard key={auctionInfo[0]} {...auctionInfo[1]} />
          ))}
        </Wrapper>
      </TableWrapper>
      <TableWrapper>
        <Wrapper>
          <h3>All auctions:</h3>
        </Wrapper>
        <DatatablePage {...tableData} />
      </TableWrapper>
    </>
  );
}
