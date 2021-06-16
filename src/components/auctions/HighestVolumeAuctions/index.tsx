import { transparentize } from 'polished'
import React from 'react'
import { NavLink } from 'react-router-dom'
import styled, { css } from 'styled-components'

import { AuctionInfo } from '../../../hooks/useAllAuctionInfos'
import { getChainName } from '../../../utils/tools'
import { ChevronRightBig } from '../../icons/ChevronRightBig'
import { InfoIcon } from '../../icons/InfoIcon'
import { NetworkIcon } from '../../icons/NetworkIcon'
import { EmptyContentText, EmptyContentWrapper } from '../../pureStyledComponents/EmptyContent'
import { PageTitle } from '../../pureStyledComponents/PageTitle'
import DoubleLogo from '../../token/DoubleLogo'

const Wrapper = styled.div`
  margin: 0 0 50px;
  max-width: 400px;
  margin: auto;
  @media (min-width: ${(props) => props.theme.themeBreakPoints.md}) {
    margin: 0 0 80px;
    max-width: 100%;
  }
`

const IconCSS = css`
  height: 12px;
  width: 12px;
  margin-right: 5px;

  .fill {
    fill: rgba(255, 255, 255, 0.9);
  }
`

const BottomIconNetwork = styled(NetworkIcon)`
  ${IconCSS}
`

const SectionTitle = styled(PageTitle)`
  font-size: 22px;
  margin-bottom: 24px;
`

const Chevron = styled(ChevronRightBig)`
  flex-shrink: 0;
  width: 11px;
`

const StyledTable = styled.div`
  border-radius: 12px;
  width: 100%;
  @media (min-width: ${(props) => props.theme.themeBreakPoints.md}) {
    display: grid;
    grid-column-gap: 15px;
    grid-template-columns: 1fr 1fr;
  }
  @media (min-width: ${(props) => props.theme.themeBreakPoints.xl}) {
    border: 1px solid ${(props) => props.theme.dropdown.item.borderColor};
    grid-column-gap: 0;
    grid-template-columns: 1fr;
  }
`

const StyledTHead = styled.div`
  display: none;
  width: 100%;
  grid-template-columns: 2.8fr 0.9fr 0.8fr 1.1fr;
  grid-column-gap: 15px;
  @media (min-width: ${(props) => props.theme.themeBreakPoints.xl}) {
    display: grid;
    border-bottom: 1px solid ${(props) => props.theme.dropdown.item.borderColor};
  }
`

export const StyledTr = styled(NavLink)`
  display: flex;
  border: 1px solid ${(props) => props.theme.dropdown.item.borderColor};
  border-radius: 12px;
  width: 100%;
  flex-wrap: wrap;
  margin-bottom: 15px;
  color: ${(props) => props.theme.dropdown.item.color};
  @media (min-width: ${(props) => props.theme.themeBreakPoints.xl}) {
    display: grid;
    grid-template-columns: 110px 1.1fr 0.6fr 1fr 1fr 1fr 1fr 40px;
    border-top: 0;
    margin-bottom: 0;
    border-right: 0;
    border-left: 0;
    border-radius: 0;
    border-bottom: 1px solid ${(props) => props.theme.dropdown.item.borderColor};
  }
  &,
  &:hover,
  &:focus {
    text-decoration: none;
    outline: none;
  }
  &:hover {
    background-color: ${(props) => transparentize(0.95, props.theme.dropdown.item.color)};
  }
`

const StyledTd = styled.div`
  display: flex;
  flex-grow: 1;
  align-items: center;
  font-weight: bold;
  font-size: 18px;
  padding: 7px 10px;
  span {
    font-size: 16px;
    color: ${(props) => props.theme.dropdown.item.color};
    opacity: 0.5;
    font-weight: normal;
    @media (min-width: ${(props) => props.theme.themeBreakPoints.xl}) {
      display: none;
    }
  }
  &:first-child {
    width: 100%;
    order: 3;
    justify-content: center;
    @media (min-width: ${(props) => props.theme.themeBreakPoints.xl}) {
      padding-left: 30px;
      width: auto;
      order: unset;
      justify-content: flex-start;
    }
  }
  &:nth-child(2) {
    order: 4;
    font-size: 24px;
    width: 100%;
    justify-content: center;
    @media (min-width: ${(props) => props.theme.themeBreakPoints.xl}) {
      width: auto;
      font-size: 20px;
      order: unset;
      justify-content: flex-start;
    }
  }
  &:nth-child(3) {
    order: 1;
    @media (min-width: ${(props) => props.theme.themeBreakPoints.xl}) {
      width: auto;
      order: unset;
      justify-content: flex-start;
    }
  }
  &:nth-child(4) {
    order: 5;
    width: 100%;
    justify-content: center;
    @media (min-width: ${(props) => props.theme.themeBreakPoints.xl}) {
      width: auto;
      order: unset;
      justify-content: flex-start;
    }
  }
  &:nth-child(5) {
    order: 6;
    width: 100%;
    justify-content: center;
    @media (min-width: ${(props) => props.theme.themeBreakPoints.xl}) {
      width: auto;
      order: unset;
      justify-content: flex-start;
    }
  }
  &:nth-child(6) {
    order: 7;
    width: 100%;
    justify-content: center;
    @media (min-width: ${(props) => props.theme.themeBreakPoints.xl}) {
      width: auto;
      order: unset;
      justify-content: flex-start;
    }
  }
  &:nth-child(7) {
    order: 2;
    justify-content: flex-end;
    font-size: 14px;
    color: ${({ theme }) => theme.primary1};
    @media (min-width: ${(props) => props.theme.themeBreakPoints.xl}) {
      width: auto;
      order: unset;
      font-size: 18px;
      justify-content: flex-start;
    }
  }
  &:last-child {
    display: none;
    @media (min-width: ${(props) => props.theme.themeBreakPoints.xl}) {
      display: flex;
    }
  }
`

const StyledThCell = styled.div`
  display: flex;
  flex-grow: 1;
  align-items: center;
  justify-content: space-between;
  font-weight: bold;
  font-size: 18px;
  padding: 7px 10px;
  &:nth-child(2) {
    justify-content: center;
  }
  &:first-child {
    padding-left: 30px;
    justify-content: flex-end;
  }
`

const SmallLbl = styled.div`
  font-size: 11px;
  color: ${(props) => props.theme.dropdown.item.color};
  opacity: 0.5;
  font-weight: normal;
`

interface HVAuctionsProps {
  highestVolumeAuctions?: Maybe<AuctionInfo[]>
}

const HighestVolumeAuctions = ({ highestVolumeAuctions }: HVAuctionsProps) => {
  const noAuctions = !highestVolumeAuctions || highestVolumeAuctions?.length === 0
  const mockDate = new Date()
  return (
    <Wrapper>
      <SectionTitle style={{ display: 'block' }}>Highest Volume Auctions</SectionTitle>
      {noAuctions ? (
        <EmptyContentWrapper>
          <InfoIcon />
          <EmptyContentText>No auctions.</EmptyContentText>
        </EmptyContentWrapper>
      ) : (
        <StyledTable>
          <StyledTHead>
            <StyledThCell>Sell Amount</StyledThCell>
            <StyledThCell>Buy Amount</StyledThCell>
            <StyledThCell>USD Volume</StyledThCell>
            <StyledThCell>End Date</StyledThCell>
          </StyledTHead>
          {highestVolumeAuctions.map((auction, index) => (
            <StyledTr
              key={index}
              to={`/auction?auctionId=${auction.auctionId}&chainId=${Number(
                auction.chainId,
              )}#topAnchor`}
            >
              <StyledTd>
                <DoubleLogo
                  auctioningToken={{
                    address: auction.addressAuctioningToken,
                    symbol: auction.symbolAuctioningToken,
                  }}
                  biddingToken={{
                    address: auction.addressBiddingToken,
                    symbol: auction.symbolBiddingToken,
                  }}
                  size="35px"
                />
              </StyledTd>
              <StyledTd>
                {auction.symbolAuctioningToken} / {auction.symbolBiddingToken}
              </StyledTd>
              <StyledTd>
                <BottomIconNetwork />
                <SmallLbl>{getChainName(parseInt(auction.chainId.toString()))}</SmallLbl>
              </StyledTd>
              <StyledTd>
                <span>Sell Amount:&nbsp;</span>
                {auction.order.volume + ' ' + auction.symbolAuctioningToken}
              </StyledTd>
              <StyledTd>
                <span>Buy Amount:&nbsp;</span>
                {auction.order.volume + ' ' + auction.symbolAuctioningToken}
              </StyledTd>
              <StyledTd>
                <span>USD Volume:&nbsp;</span>
                {'$' + auction.order.volume}
              </StyledTd>
              <StyledTd>
                <span>End Date:&nbsp;</span>
                {mockDate.toLocaleDateString()}
              </StyledTd>
              <StyledTd>
                <Chevron />
              </StyledTd>
            </StyledTr>
          ))}
        </StyledTable>
      )}
    </Wrapper>
  )
}

export default HighestVolumeAuctions
