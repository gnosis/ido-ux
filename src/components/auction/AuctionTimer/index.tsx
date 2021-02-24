import React from 'react'
import styled from 'styled-components'

import { Token } from '@uniswap/sdk'

import {
  AuctionState,
  SellOrder,
  useDerivedAuctionInfo,
  useDerivedAuctionState,
} from '../../../state/orderPlacement/hooks'
import CountdownTimer from '../../CountDown'

const TIMER_SIZE = '154px'

const Wrapper = styled.div`
  align-items: center;
  background-color: ${({ theme }) => theme.primary1};
  border-radius: 50%;
  display: flex;
  height: ${TIMER_SIZE};
  justify-content: center;
  margin-top: -13px;
  width: ${TIMER_SIZE};
`

const Center = styled.div`
  background-color: #001429;
  border-radius: 50%;
  box-shadow: 0 0 6px 0 #001429;
  height: 126px;
  width: 126px;
`

const renderAuctionStatus = ({
  auctionState,
}: {
  auctionState: AuctionState
  auctioningToken: Token | null
  initialAuctionOrder: SellOrder | null
}) => {
  switch (auctionState) {
    case AuctionState.ORDER_PLACING:
    case AuctionState.ORDER_PLACING_AND_CANCELING:
      return null
    case AuctionState.PRICE_SUBMISSION:
      return <span>Closed</span>
    default:
      return <span>Settled</span>
  }
}

export const AuctionHeaderForScheduledAuction = () => {
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

export const AuctionTimer = () => {
  const { auctionState } = useDerivedAuctionState()

  return (
    <Wrapper>
      <Center>
        {auctionState == undefined ? (
          <span>⌛ Loading</span>
        ) : auctionState == AuctionState.NOT_YET_STARTED ? (
          <span>⌛ Auction not yet started</span>
        ) : (
          <AuctionHeaderForScheduledAuction />
        )}
      </Center>
    </Wrapper>
  )
}
