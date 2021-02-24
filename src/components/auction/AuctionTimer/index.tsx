import React from 'react'
import styled, { keyframes } from 'styled-components'

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
  flex-flow: column;
  height: 126px;
  justify-content: center;
  width: 126px;
`

const Time = styled.div`
  color: ${({ theme }) => theme.primary1};
  flex-shrink: 1;
  font-size: 18px;
  font-weight: 700;
  letter-spacing: -1px;
  line-height: 1.2;
  margin-bottom: -2px;
  min-width: 0;
  text-align: center;
  white-space: nowrap;
`

const Text = styled.div`
  color: ${({ theme }) => theme.primary1};
  font-size: 15px;
  font-weight: 700;
  line-height: 1;
  opacity: 0.8;
  text-align: center;
  text-transform: uppercase;
`

const TextBig = styled.div`
  color: ${({ theme }) => theme.primary1};
  font-size: 17px;
  font-weight: 600;
  line-height: 1.2;
  text-align: center;
  text-transform: uppercase;
`

const Blinker = keyframes`
  0% {
    opacity: 1;
  }
  50% {
    opacity: 1;
  }
  50.01% {
    opacity: 0;
  }
  100% {
    opacity: 0;
  }
`

const Blink = styled.span`
  animation-direction: alternate;
  animation-duration: 0.5s;
  animation-iteration-count: infinite;
  animation-name: ${Blinker};
  animation-timing-function: linear;
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
        {auctionState === undefined && <TextBig>Loading</TextBig>}
        {auctionState === AuctionState.NOT_YET_STARTED && <TextBig>Auction not started</TextBig>}
        {(auctionState === AuctionState.ORDER_PLACING_AND_CANCELING ||
          auctionState === AuctionState.ORDER_PLACING) && (
          <>
            <Time>
              {timeLeft && timeLeft > -1 ? (
                formatSeconds(timeLeft)
              ) : (
                <>
                  --<Blink>:</Blink>--<Blink>:</Blink>--
                </>
              )}
            </Time>
            <Text>Ends in</Text>
          </>
        )}
        {auctionState === AuctionState.PRICE_SUBMISSION && <TextBig>Auction Closed</TextBig>}
        {auctionState !== AuctionState.NOT_YET_STARTED &&
          auctionState !== AuctionState.ORDER_PLACING_AND_CANCELING &&
          auctionState !== AuctionState.ORDER_PLACING &&
          auctionState !== AuctionState.PRICE_SUBMISSION &&
          auctionState !== AuctionState.CLAIMING &&
          auctionState !== undefined && <TextBig>Auction Settled</TextBig>}
      </Center>
    </Wrapper>
  )
}
