import { transparentize } from 'polished'
import React, { FC } from 'react'
import { NavLink } from 'react-router-dom'
import styled, { css } from 'styled-components'

import { BigNumber } from '@ethersproject/bignumber'
import * as CSS from 'csstype'

import { AuctionInfo } from '../../../hooks/useAllAuctionInfos'
import { abbreviation } from '../../../utils/numeral'
import { getChainName } from '../../../utils/tools'
import { ChevronRightBig } from '../../icons/ChevronRightBig'
import { InfoIcon } from '../../icons/InfoIcon'
import { NetworkIcon } from '../../icons/NetworkIcon'
import { EmptyContentText, EmptyContentWrapper } from '../../pureStyledComponents/EmptyContent'
import { PageTitle } from '../../pureStyledComponents/PageTitle'
import DoubleLogo from '../../token/DoubleLogo'

const Wrapper = styled.div`
  margin: 0 auto 50px;
  max-width: 400px;
  @media (min-width: ${(props) => props.theme.themeBreakPoints.md}) {
    margin: 0 0 120px;
    max-width: 100%;
  }
`

const IconCSS = css`
  height: 9px;
  width: 9px;
  margin-right: 5px;

  .fill {
    fill: ${({ theme }) => transparentize(0.1, theme.text1)};
    opacity: 1;
  }
`

const BottomIconNetwork = styled(NetworkIcon)`
  ${IconCSS}
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
  grid-template-columns: 2.75fr 1fr 0.8fr 1.1fr;
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
  padding: 15px;
  @media (min-width: ${(props) => props.theme.themeBreakPoints.xl}) {
    display: grid;
    padding: 0;
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

interface StyledTdProps {
  primary1?: string
}

const StyledTd = styled.div<Partial<CSS.Properties & StyledTdProps>>`
  display: flex;
  flex-grow: 1;
  align-items: center;
  font-weight: bold;
  font-size: 18px;
  padding: 7px 10px;
  span {
    color: ${(props) => props.theme.dropdown.item.color};
    opacity: 0.5;
    font-weight: normal;
    &:not(:nth-child(2)) {
      @media (min-width: ${(props) => props.theme.themeBreakPoints.xl}) {
        display: none;
      }
    }
  }
  &:first-child {
    width: 100%;
    order: 2;
    justify-content: center;
    @media (min-width: ${(props) => props.theme.themeBreakPoints.xl}) {
      padding-left: 30px;
      width: auto;
      order: unset;
      justify-content: flex-start;
    }
  }
  &:nth-child(2) {
    order: 3;
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
    width: 100%;
    justify-content: center;
    @media (min-width: ${(props) => props.theme.themeBreakPoints.xl}) {
      width: auto;
      order: unset;
      justify-content: flex-start;
    }
  }
  &:nth-child(4) {
    order: 4;
    width: 50%;
    flex-direction: column;
    align-items: flex-start;
    @media (min-width: ${(props) => props.theme.themeBreakPoints.xl}) {
      width: auto;
      order: unset;
      justify-content: flex-start;
      flex-direction: row;
      align-items: center;
    }
  }
  &:nth-child(5) {
    order: 5;
    width: 50%;
    align-items: flex-start;
    flex-direction: column;
    @media (min-width: ${(props) => props.theme.themeBreakPoints.xl}) {
      width: auto;
      order: unset;
      justify-content: flex-start;
      flex-direction: row;
      align-items: center;
    }
  }
  &:nth-child(6) {
    order: 6;
    width: 50%;
    flex-direction: column;
    align-items: flex-start;
    @media (min-width: ${(props) => props.theme.themeBreakPoints.xl}) {
      width: auto;
      order: unset;
      justify-content: flex-start;
      flex-direction: row;
      align-items: center;
    }
  }
  &:nth-child(7) {
    order: 7;
    flex-direction: column;
    align-items: flex-start;
    width: 50%;
    span:nth-child(2) {
      font-weight: bold;
      opacity: 1;
    }
    @media (min-width: ${(props) => props.theme.themeBreakPoints.xl}) {
      width: auto;
      order: unset;
      font-size: 18px;
      justify-content: flex-start;
      flex-direction: row;
      align-items: center;
      span:nth-child(2) {
        font-weight: bold;
        opacity: 1;
      }
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
  color: ${(props) => props.theme.dropdown.item.color};
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
  font-size: 9px;
  color: ${(props) => props.theme.dropdown.item.color};
  font-weight: normal;
`

const StyledDoubleLogo = styled(DoubleLogo)`
  > div {
    width: 62px;
    height: 62px;
    @media (min-width: ${(props) => props.theme.themeBreakPoints.xl}) {
      width: 35px;
      height: 35px;
    }
  }
`

interface HVAuctionsProps {
  highestVolumeAuctions?: Maybe<AuctionInfo[]>
}

const HighestVolumeAuctions: FC<HVAuctionsProps> = ({ highestVolumeAuctions }) => {
  const auctions = React.useMemo(
    () =>
      [...(highestVolumeAuctions || [])]
        .sort((a, b) => b.usdAmountTraded - a.usdAmountTraded)
        .slice(0, 4),
    [highestVolumeAuctions],
  )
  const noAuctions = !auctions || auctions?.length === 0

  return (
    <Wrapper>
      <PageTitle style={{ display: 'block' }}>Highest Volume Auctions</PageTitle>
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
          {auctions.map((auction) => (
            <StyledTr
              key={auction.auctionId}
              to={`/auction?auctionId=${auction.auctionId}&chainId=${Number(
                auction.chainId,
              )}#topAnchor`}
            >
              <StyledTd>
                <StyledDoubleLogo
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
                {abbreviation(auction.order.volume) + ' ' + auction.symbolAuctioningToken}
              </StyledTd>
              <StyledTd>
                <span>Buy Amount:&nbsp;</span>
                {abbreviation(
                  BigNumber.from(auction.currentBiddingAmount)
                    .div(BigNumber.from(10).pow(auction.decimalsBiddingToken))
                    .toString(),
                ) +
                  ' ' +
                  auction.symbolBiddingToken}
              </StyledTd>
              <StyledTd>
                <span>USD Volume:&nbsp;</span>
                {'$' + abbreviation(auction.usdAmountTraded)}
              </StyledTd>
              <StyledTd>
                <span>End Date:&nbsp;</span>
                <span>{new Date(auction.endTimeTimestamp * 1000).toLocaleDateString()}</span>
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
