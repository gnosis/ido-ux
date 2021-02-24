import React from 'react'
import styled from 'styled-components'

import { Token } from '@uniswap/sdk'

import {
  AuctionState,
  SellOrder,
  useDerivedAuctionInfo,
  useDerivedAuctionState,
} from '../../state/orderPlacement/hooks'
import { getTokenDisplay } from '../../utils'
import CountdownTimer from '../CountDown'

const Wrapper = styled.div`
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
`

const renderAuctionStatus = ({
  auctionState,
  auctioningToken,
  initialAuctionOrder,
}: {
  auctionState: AuctionState
  auctioningToken: Token | null
  initialAuctionOrder: SellOrder | null
}) => {
  switch (auctionState) {
    case AuctionState.ORDER_PLACING:
    case AuctionState.ORDER_PLACING_AND_CANCELING:
      return (
        <h4>
          <span>Selling</span>
          <b>
            {initialAuctionOrder?.sellAmount.toSignificant(2)} {getTokenDisplay(auctioningToken)}
          </b>
        </h4>
      )

    case AuctionState.PRICE_SUBMISSION:
      return <h3>🗓 Auction closed. Pending on-chain price-calculation.</h3>

    default:
      return <h3>🏁 Auction is settled</h3>
  }
}

export function AuctionHeaderForScheduledAuction() {
  const { auctionEndDate, auctioningToken, initialAuctionOrder } = useDerivedAuctionInfo()
  const { auctionState } = useDerivedAuctionState()

  return (
    <>
      {renderAuctionStatus({
        auctioningToken,
        auctionState,
        initialAuctionOrder,
      })}
      <CountdownTimer auctionEndDate={auctionEndDate} showText={true} />
    </>
  )
}

export default function AuctionHeader() {
  const { auctionState } = useDerivedAuctionState()
  return (
    <Wrapper>
      {auctionState == undefined ? (
        <h5>⌛ Loading</h5>
      ) : auctionState == AuctionState.NOT_YET_STARTED ? (
        <h5>⌛ Auction not yet started</h5>
      ) : (
        <AuctionHeaderForScheduledAuction />
      )}
    </Wrapper>
  )
}
