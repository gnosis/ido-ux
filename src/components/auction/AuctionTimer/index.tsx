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

export const TIMER_SIZE = '162px'
const INNER_CIRCLE_SIZE = '138px'

const Wrapper = styled.div`
  align-items: center;
  background: ${({ theme }) => theme.primary3};
  border-radius: 50%;
  box-shadow: inset 0 0 3px 0 ${({ theme }) => theme.mainBackground};
  display: flex;
  height: ${TIMER_SIZE};
  justify-content: center;
  position: relative;
  width: ${TIMER_SIZE};
`

const ProgressChart = styled.div<{ progress?: string }>`
  align-items: center;
  background: conic-gradient(
    ${({ theme }) => theme.primary1} calc(${(props) => props.progress}),
    rgba(255, 255, 255, 0) 0%
  );
  border-radius: 50%;
  display: flex;
  height: calc(${TIMER_SIZE} - 5px);
  justify-content: center;
  width: calc(${TIMER_SIZE} - 5px);
`

ProgressChart.defaultProps = {
  progress: '0%',
}

const InnerCircle = styled.div`
  align-items: center;
  background: ${({ theme }) => theme.primary3};
  border-radius: 50%;
  display: flex;
  height: ${INNER_CIRCLE_SIZE};
  justify-content: center;
  width: ${INNER_CIRCLE_SIZE};
`

const CenterCircle = styled.div`
  align-items: center;
  background-color: ${({ theme }) => theme.mainBackground};
  border-radius: 50%;
  box-shadow: 0 0 10px 0px ${({ theme }) => theme.mainBackground};
  display: flex;
  flex-flow: column;
  height: calc(${INNER_CIRCLE_SIZE} - 4px);
  justify-content: center;
  width: calc(${INNER_CIRCLE_SIZE} - 4px);
`

const Time = styled.div`
  color: ${({ theme }) => theme.primary1};
  flex-shrink: 1;
  font-size: 20px;
  font-weight: 700;
  line-height: 1.1;
  margin-bottom: 2px;
  min-width: 0;
  text-align: center;
  white-space: nowrap;
`

const Text = styled.div`
  color: ${({ theme }) => theme.primary1};
  font-size: 15px;
  font-weight: 700;
  line-height: 1.1;
  opacity: 0.8;
  text-align: center;
  text-transform: uppercase;
`

const TextBig = styled.div`
  color: ${({ theme }) => theme.primary1};
  font-size: 20px;
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
      {days > 0 && `${days}d `}
      {hours >= 0 && hours < 10 && `0`}
      {hours}
      <>
        <Blink />
        {minutes >= 0 && minutes < 10 && `0`}
        {minutes}
      </>
      {days === 0 && (
        <>
          <Blink />
          {remainderSeconds >= 0 && remainderSeconds < 10 && `0`}
          {remainderSeconds}
        </>
      )}
    </>
  )
}
interface AuctionTimerProps {
  derivedAuctionInfo: DerivedAuctionInfo
  loading?: boolean
}

export const AuctionTimer = (props: AuctionTimerProps) => {
  const {
    derivedAuctionInfo: { auctionState },
    derivedAuctionInfo,
    ...restProps
  } = props
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
      return <TextBig>Waiting settlement</TextBig>
    } else if (
      auctionState !== AuctionState.NOT_YET_STARTED &&
      auctionState !== AuctionState.ORDER_PLACING_AND_CANCELING &&
      auctionState !== AuctionState.ORDER_PLACING &&
      auctionState !== AuctionState.CLAIMING &&
      auctionState !== null &&
      auctionState !== undefined
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
    <Wrapper {...restProps}>
      <ProgressChart progress={progress}>
        <InnerCircle>
          <CenterCircle>
            {!auctionState && <TextBig>Loading...</TextBig>}
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
          </CenterCircle>
        </InnerCircle>
      </ProgressChart>
    </Wrapper>
  )
}
