import React from 'react'
import styled, { keyframes } from 'styled-components'

import { AuctionState, DerivedAuctionInfo } from '../../../state/orderPlacement/hooks'
import {
  calculateTimeLeft,
  calculateTimeProgress,
  getDays,
  getHours,
  getMinutes,
  getSeconds,
} from '../../../utils/tools'

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
interface AuctionTimerProps {
  derivedAuctionInfo: DerivedAuctionInfo
  auctionState: AuctionState
  loading?: boolean
}

export const AuctionTimer = (props: AuctionTimerProps) => {
  const { auctionState, derivedAuctionInfo } = props
  const [timeLeft, setTimeLeft] = React.useState(
    calculateTimeLeft(derivedAuctionInfo?.auctionEndDate),
  )

  React.useEffect(() => {
    const id = setInterval(() => {
      setTimeLeft(calculateTimeLeft(derivedAuctionInfo?.auctionEndDate))
    }, 1000)
    return () => {
      clearInterval(id)
    }
  }, [derivedAuctionInfo?.auctionEndDate])

  const auctionStateTitle = React.useMemo(() => {
    if (auctionState === AuctionState.PRICE_SUBMISSION) {
      return <TextBig>Auction Closed</TextBig>
    } else if (
      auctionState !== AuctionState.NOT_YET_STARTED &&
      auctionState !== AuctionState.ORDER_PLACING_AND_CANCELING &&
      auctionState !== AuctionState.ORDER_PLACING &&
      auctionState !== AuctionState.CLAIMING &&
      auctionState !== null
    ) {
      return <TextBig>Auction Settled</TextBig>
    } else {
      return null
    }
  }, [auctionState])

  const progress = React.useMemo(() => {
    const progress = calculateTimeProgress(
      derivedAuctionInfo?.auctionStartDate,
      derivedAuctionInfo?.auctionEndDate,
    )
    // we do this so that the graph is in the same direction as a clock
    return `${100 - progress}%`
  }, [derivedAuctionInfo])

  return (
    <Wrapper progress={progress}>
      <Center>
        {auctionState === null && <TextBig>Loading</TextBig>}
        {auctionState === AuctionState.NOT_YET_STARTED && (
          <TextBig>
            Auction
            <br /> not
            <br />
            started
          </TextBig>
        )}
        {auctionState === AuctionState.CLAIMING && (
          <TextBig>
            Auction
            <br /> claiming
          </TextBig>
        )}
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
        {auctionStateTitle}
      </Center>
    </Wrapper>
  )
}
