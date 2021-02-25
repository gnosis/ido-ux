import React from 'react'
import styled, { keyframes } from 'styled-components'

import {
  AuctionState,
  useDerivedAuctionInfo,
  useDerivedAuctionState,
} from '../../../state/orderPlacement/hooks'

const TIMER_SIZE = '154px'

const Wrapper = styled.div<{ progress?: string }>`
  align-items: center;
  background: ${({ theme }) => theme.primary1};
  background: conic-gradient(
    ${({ theme }) => theme.primary1} calc(${(props) => props.progress}),
    ${({ theme }) => theme.primary3} 0%
  );
  border-radius: 50%;
  display: flex;
  height: ${TIMER_SIZE};
  justify-content: center;
  margin-top: -13px;
  width: ${TIMER_SIZE};
`

Wrapper.defaultProps = {
  progress: '0%',
}

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

const Days = styled.div`
  font-size: 20px;
  line-height: 1;
  margin: 0;
  text-transform: uppercase;
`

const Time = styled.div`
  color: ${({ theme }) => theme.primary1};
  flex-shrink: 1;
  font-size: 18px;
  font-weight: 700;
  letter-spacing: -1px;
  line-height: 1.2;
  margin-bottom: 3px;
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

  &::before {
    content: ':';
  }
`

const getDays = (seconds: number): number => {
  return Math.floor(seconds / 24 / 60 / 60) % 360
}

const getHours = (seconds: number): number => {
  return Math.floor(seconds / 60 / 60) % 24
}

const getMinutes = (seconds: number): number => {
  return Math.floor(seconds / 60) % 60
}

const getSeconds = (seconds: number): number => {
  return Math.floor(seconds % 60)
}

const formatSeconds = (seconds: number): React.ReactNode => {
  const days = getDays(seconds)
  const hours = getHours(seconds)
  const minutes = getMinutes(seconds)
  const remainderSeconds = getSeconds(seconds)

  return (
    <>
      {days > 0 && (
        <Days>
          {`${days} `}
          {days === 1 ? 'Day' : 'Days'}
        </Days>
      )}
      <div>
        <>
          {hours >= 0 && hours < 10 && `0`}
          {hours}
        </>
        <>
          <Blink />
          {minutes >= 0 && minutes < 10 && `0`}
          {minutes}
        </>
        <>
          <Blink />
          {remainderSeconds >= 0 && remainderSeconds < 10 && `0`}
          {remainderSeconds}
        </>
      </div>
    </>
  )
}

const calculateTimeLeft = (auctionEndDate: number) => {
  if (isNaN(auctionEndDate)) return -1

  const diff = auctionEndDate - Date.now() / 1000

  if (diff < 0) return -1

  return diff
}

const calculatePercentageLeft = (auctionStartingDate: string, auctionEndDate: number): number => {
  const auctionStartDate = Date.parse(auctionStartingDate)

  const totalAuctionDays = getDays(auctionEndDate - auctionStartDate / 1000)
  const passedAuctionDays = totalAuctionDays - getDays(auctionEndDate - Date.now() / 1000)

  return Math.trunc((passedAuctionDays * 100) / totalAuctionDays)
}

export const AuctionTimer = () => {
  const { auctionState } = useDerivedAuctionState()
  const { auctionEndDate } = useDerivedAuctionInfo()
  const [timeLeft, setTimeLeft] = React.useState(calculateTimeLeft(auctionEndDate))
  // mocked date, update when we get a complete endpoint
  const auctionStartingDate = '02/21/2021'

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
    <Wrapper progress={`${calculatePercentageLeft(auctionStartingDate, auctionEndDate)}%`}>
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
                  --
                  <Blink />
                  --
                  <Blink />
                  --
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
