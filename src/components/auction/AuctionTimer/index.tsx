import React from 'react'
import styled from 'styled-components'

import {
  AuctionState,
  useDerivedAuctionInfo,
  useDerivedAuctionState,
} from '../../../state/orderPlacement/hooks'

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
  align-items: center;
  background-color: ${({ theme }) => theme.mainBackground};
  border-radius: 50%;
  box-shadow: 0 0 6px 0 ${({ theme }) => theme.mainBackground};
  display: flex;
  height: 126px;
  justify-content: center;
  width: 126px;
`

const formatSeconds = (seconds: number): string => {
  const days = Math.floor(seconds / 24 / 60 / 60) % 360
  const hours = Math.floor(seconds / 60 / 60) % 24
  const minutes = Math.floor(seconds / 60) % 60
  const remainderSeconds = Math.floor(seconds % 60)
  let s = ''

  if (days > 0) {
    s += `${days}d `
  }
  if (hours > 0) {
    s += `${hours}h `
  }
  if (minutes > 0) {
    s += `${minutes}m `
  }
  if (remainderSeconds > 0 && hours < 2) {
    s += `${remainderSeconds}s`
  }
  if (minutes === 0 && remainderSeconds === 0) {
    s = '0s'
  }

  return s
}

const calculateTimeLeft = (auctionEndDate: number) => {
  if (isNaN(auctionEndDate)) return -1

  const diff = auctionEndDate - Date.now() / 1000

  if (diff < 0) return -1

  return diff
}

export const AuctionTimer = () => {
  const { auctionState } = useDerivedAuctionState()
  const { auctionEndDate } = useDerivedAuctionInfo()

  const [timeLeft, setTimeLeft] = React.useState(calculateTimeLeft(auctionEndDate))

  React.useEffect(() => {
    let mounted = true
    setTimeout(() => {
      if (mounted) setTimeLeft(calculateTimeLeft(auctionEndDate))
    }, 1000)

    return () => {
      mounted = false
    }
  }, [auctionEndDate])

  return (
    <Wrapper>
      <Center>
        {auctionState === undefined && <span>Loading</span>}
        {auctionState === AuctionState.NOT_YET_STARTED && <span>Auction not yet started</span>}
        {(auctionState === AuctionState.ORDER_PLACING_AND_CANCELING ||
          auctionState === AuctionState.ORDER_PLACING) && (
          <div>
            {timeLeft && timeLeft > -1 ? <strong>{formatSeconds(timeLeft)}</strong> : '-'}
            <div>Ends in</div>
          </div>
        )}
        {auctionState === AuctionState.PRICE_SUBMISSION && <span>Closed</span>}
        {auctionState !== AuctionState.NOT_YET_STARTED &&
          auctionState !== AuctionState.ORDER_PLACING_AND_CANCELING &&
          auctionState !== AuctionState.ORDER_PLACING &&
          auctionState !== AuctionState.PRICE_SUBMISSION &&
          auctionState !== AuctionState.CLAIMING &&
          auctionState !== undefined && <span>Settled</span>}
      </Center>
    </Wrapper>
  )
}
