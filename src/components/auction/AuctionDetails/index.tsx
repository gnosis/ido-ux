import React, { useMemo } from 'react'
import styled from 'styled-components'

import { useClearingPriceInfo } from '../../../hooks/useCurrentClearingOrderAndVolumeCallback'
import {
  AuctionState,
  DerivedAuctionInfo,
  orderToPrice,
  orderToSellOrder,
} from '../../../state/orderPlacement/hooks'
import { AuctionIdentifier } from '../../../state/orderPlacement/reducer'
import { getExplorerLink, getTokenDisplay } from '../../../utils'
import { abbreviation } from '../../../utils/numeral'
import { KeyValue } from '../../common/KeyValue'
import { Tooltip } from '../../common/Tooltip'
import { ExternalLink } from '../../navigation/ExternalLink'
import { BaseCard } from '../../pureStyledComponents/BaseCard'
import TokenLogo from '../../token/TokenLogo'
import { AuctionTimer } from '../AuctionTimer'

const Wrapper = styled(BaseCard)`
  align-items: center;
  display: grid;
  margin: 0 0 28px;
  max-width: 100%;
  min-height: 130px;
  grid-template-areas:
    'top top top'
    'col1 sep1 col2'
    'col3 sep2 col4';
  grid-template-columns: 1fr 3px 1fr;
  grid-template-rows: 1fr;
  padding-bottom: 20px;
  row-gap: 15px;

  @media (min-width: ${({ theme }) => theme.themeBreakPoints.md}) {
    grid-template-areas: none;
    grid-template-columns: 1fr 3px 1fr 154px 1fr 3px 1fr;
    padding-bottom: 0;
    margin: 0 0 50px;
  }
`

const Cell = styled(KeyValue)`
  height: 100%;
  justify-content: center;
  padding: 5px 0;

  &.col1 {
    grid-area: col3;
  }

  &.col2 {
    grid-area: col2;
  }

  &.col3 {
    grid-area: col1;
  }

  &.col4 {
    grid-area: col4;
  }

  .itemValue {
    flex-direction: column;
    flex-grow: 0;
    margin-bottom: 0;
  }

  @media (min-width: ${({ theme }) => theme.themeBreakPoints.md}) {
    flex-grow: 1;
    justify-content: center;
    height: auto;
    padding: 0 10px;

    &.col1,
    &.col2,
    &.col3,
    &.col4 {
      grid-area: unset;
    }

    &:first-child {
      padding-left: 0;
    }

    &:last-child {
      padding-right: 0;
    }

    .itemValue {
      flex-direction: row;
      margin-bottom: 2px;
    }
  }
`

const Break = styled.div`
  background-color: ${({ theme }) => theme.primary1};
  border-radius: 3px;
  height: 100%;
  min-height: 50px;
  width: 3px;

  &.sep1 {
    grid-area: sep1;
  }
  &.sep2 {
    grid-area: sep2;
  }

  @media (min-width: ${({ theme }) => theme.themeBreakPoints.md}) {
    height: auto;

    &.sep1,
    &.sep2 {
      grid-area: unset;
    }
  }
`

const TimerWrapper = styled.div`
  grid-area: top;
  margin: -65px auto 15px;
  max-height: 130px;
  position: relative;

  @media (min-width: ${({ theme }) => theme.themeBreakPoints.md}) {
    grid-area: unset;
    margin: 0;
  }
`

const TokenSymbol = styled.span`
  align-items: center;
  display: flex;
  font-size: 15px;
  justify-content: center;

  & > * {
    margin-right: 8px;
  }

  @media (min-width: ${({ theme }) => theme.themeBreakPoints.md}) {
    font-size: 18px;
  }
`

const TokenValue = styled.span`
  align-items: center;
  display: flex;
  font-size: 25px;
  justify-content: center;
  margin-bottom: 5px;
  margin-right: 0;

  & > * {
    margin-right: 8px;
  }

  @media (min-width: ${({ theme }) => theme.themeBreakPoints.md}) {
    font-size: 18px;
    margin-bottom: 0;
    margin-right: 8px;
  }
`

interface AuctionDetailsProps {
  auctionIdentifier: AuctionIdentifier
  auctionState: AuctionState
  derivedAuctionInfo: DerivedAuctionInfo
}

const AuctionDetails = (props: AuctionDetailsProps) => {
  const { auctionIdentifier, auctionState, derivedAuctionInfo } = props
  const { chainId } = auctionIdentifier

  const auctionTokenAddress = useMemo(
    () => getExplorerLink(chainId, derivedAuctionInfo?.auctioningToken?.address, 'address'),
    [chainId, derivedAuctionInfo?.auctioningToken],
  )

  const biddingTokenAddress = useMemo(
    () => getExplorerLink(chainId, derivedAuctionInfo?.biddingToken?.address, 'address'),
    [chainId, derivedAuctionInfo?.biddingToken],
  )

  const { clearingPriceInfo } = useClearingPriceInfo(auctionIdentifier)
  const biddingTokenDisplay = useMemo(() => getTokenDisplay(derivedAuctionInfo?.biddingToken), [
    derivedAuctionInfo?.biddingToken,
  ])
  const auctioningTokenDisplay = useMemo(
    () => getTokenDisplay(derivedAuctionInfo?.auctioningToken),
    [derivedAuctionInfo?.auctioningToken],
  )
  const clearingPriceDisplay = useMemo(() => {
    const clearingPriceInfoAsSellOrder =
      clearingPriceInfo &&
      orderToSellOrder(
        clearingPriceInfo.clearingOrder,
        derivedAuctionInfo?.biddingToken,
        derivedAuctionInfo?.auctioningToken,
      )
    const clearingPriceNumber = orderToPrice(clearingPriceInfoAsSellOrder)?.toSignificant(4)

    return clearingPriceNumber ? (
      <>
        <TokenValue>{abbreviation(clearingPriceNumber)}</TokenValue>{' '}
        <TokenSymbol>
          {getTokenDisplay(derivedAuctionInfo?.biddingToken)} per{' '}
          {getTokenDisplay(derivedAuctionInfo?.auctioningToken)}
        </TokenSymbol>
      </>
    ) : (
      '-'
    )
  }, [derivedAuctionInfo?.auctioningToken, derivedAuctionInfo?.biddingToken, clearingPriceInfo])

  const titlePrice = useMemo(
    () =>
      !auctionState
        ? 'Loading...'
        : auctionState === AuctionState.ORDER_PLACING ||
          auctionState === AuctionState.ORDER_PLACING_AND_CANCELING
        ? 'Current price'
        : auctionState === AuctionState.PRICE_SUBMISSION
        ? 'Clearing price'
        : 'Closing price',
    [auctionState],
  )

  const initialPriceToDisplay = derivedAuctionInfo?.initialPrice
  return (
    <Wrapper noPadding>
      <Cell
        className="col1"
        itemKey={
          <>
            <span>{titlePrice}</span>
            <Tooltip
              id="auctionPrice"
              text={
                "This will be the auction's Closing Price if no more bids are submitted or canceled, OR it will be the auction's Clearing Price if the auction concludes without additional bids."
              }
            />
          </>
        }
        itemValue={clearingPriceDisplay ? clearingPriceDisplay : '-'}
      />
      <Break className="sep1" />
      <Cell
        className="col2"
        itemKey={
          <>
            <span>Bidding with</span>
            <Tooltip
              id="biddingWith"
              text={'This is the token that is accepted for bidding in the auction.'}
            />
          </>
        }
        itemValue={
          derivedAuctionInfo?.biddingToken ? (
            <TokenSymbol>
              <TokenLogo
                size={'20px'}
                token={{
                  address: derivedAuctionInfo?.biddingToken.address,
                  symbol: derivedAuctionInfo?.biddingToken.symbol,
                }}
              />
              <span>{biddingTokenDisplay}</span>
              <ExternalLink href={biddingTokenAddress} />
            </TokenSymbol>
          ) : (
            '-'
          )
        }
      />
      <TimerWrapper className="top">
        <AuctionTimer auctionState={auctionState} derivedAuctionInfo={derivedAuctionInfo} />
      </TimerWrapper>
      <Cell
        className="col3"
        itemKey={
          <>
            <span>Total auctioned</span>
            <Tooltip
              id="totalAuctioned"
              text={'Total amount of tokens available to be bought in the auction.'}
            />
          </>
        }
        itemValue={
          derivedAuctionInfo?.auctioningToken && derivedAuctionInfo?.initialAuctionOrder ? (
            <>
              <TokenLogo
                size={'20px'}
                token={{
                  address: derivedAuctionInfo?.auctioningToken.address,
                  symbol: derivedAuctionInfo?.auctioningToken.symbol,
                }}
              />
              <TokenValue>
                {abbreviation(derivedAuctionInfo?.initialAuctionOrder?.sellAmount.toSignificant(4))}
              </TokenValue>
              <TokenSymbol>
                <span>{auctioningTokenDisplay}</span>
                <ExternalLink href={auctionTokenAddress} />
              </TokenSymbol>
            </>
          ) : (
            '-'
          )
        }
      />
      <Break className="sep2" />
      <Cell
        className="col4"
        itemKey={
          <>
            <span>Min Sell Price</span>
            <Tooltip
              id="minSellPrice"
              text={'Minimum bidding price the auctioneer defined for participation.'}
            />
          </>
        }
        itemValue={
          <>
            <TokenValue>
              {initialPriceToDisplay
                ? abbreviation(initialPriceToDisplay?.toSignificant(2))
                : ' - '}
            </TokenValue>
            <TokenSymbol>
              {initialPriceToDisplay && auctioningTokenDisplay
                ? ` ${biddingTokenDisplay} per ${auctioningTokenDisplay}`
                : '-'}
            </TokenSymbol>
          </>
        }
      />
    </Wrapper>
  )
}

export default AuctionDetails
