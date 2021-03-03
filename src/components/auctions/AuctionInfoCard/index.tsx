import React from 'react'
import { NavLink } from 'react-router-dom'
import styled, { keyframes } from 'styled-components'

import { AuctionInfo } from '../../../hooks/useAllAuctionInfos'
import DoubleLogo from '../../common/DoubleLogo'

const Wrapper = styled(NavLink)`
  align-items: center;
  border-radius: 12px;
  border: 1px solid ${({ theme }) => theme.border};
  display: flex;
  flex-flow: column;
  justify-content: space-between;
  min-height: 290px;
  padding: 12px 18px;
  text-decoration: none;
  transition: all 0.15s linear;

  &:hover {
    box-shadow: 10px -10px 24px 0 rgba(0, 34, 73, 0.7);
  }
`

const Top = styled.span`
  align-items: center;
  display: flex;
  justify-content: space-between;
  width: 100%;
`

const Tokens = styled.span`
  color: ${({ theme }) => theme.text1};
  font-size: 24px;
  font-weight: 700;
  line-height: 1.2;
  margin: 0;
  text-transform: uppercase;
`

const Badge = styled.span`
  align-items: center;
  background-color: rgba(232, 102, 61, 0.3);
  border-radius: 17px;
  color: ${({ theme }) => theme.primary1};
  display: flex;
  height: 34px;
  padding: 0 18px;
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

const Details = styled.span`
  align-items: center;
  display: flex;
  flex-direction: column;
  flex-grow: 1;
  flex-shrink: 0;
  justify-content: center;
  margin: auto 0;
  padding: 10px 0;
`

const TokenIcons = styled(DoubleLogo)``

const SellingText = styled.span`
  color: ${({ theme }) => theme.text1};
  font-size: 18px;
  font-weight: 700;
  line-height: 1.2;
  margin: 15px 0 0 0;
  text-align: center;
`

const PriceAndDuration = styled.span`
  display: flex;
  justify-content: space-between;
  margin: auto 0 0 0;
  width: 100%;
`

const Cell = styled.span``

const Subtitle = styled.span<{ textAlign?: string }>`
  color: ${({ theme }) => theme.text1};
  display: block;
  font-size: 13px;
  font-weight: normal;
  line-height: 1.2;
  margin: 0 0 5px;
  opacity: 0.7;
  text-align: ${(props) => props.textAlign};
`

const Text = styled.span`
  color: ${({ theme }) => theme.primary1};
  font-size: 13px;
  font-weight: 700;
  line-height: 1.2;
`

Subtitle.defaultProps = {
  textAlign: 'left',
}

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
      {days > 0 && <>{`${days}d `}</>}
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
    </>
  )
}

const calculateTimeLeft = (auctionEndDate: number) => {
  if (isNaN(auctionEndDate)) return -1

  const diff = auctionEndDate - Date.now() / 1000

  if (diff < 0) return -1

  return diff
}

interface Props {
  auctionInfo: AuctionInfo
}

const AuctionInfoCard: React.FC<Props> = (props) => {
  const { auctionInfo, ...restProps } = props
  const endDate = auctionInfo.endTimeTimestamp
  const [timeLeft, setTimeLeft] = React.useState(calculateTimeLeft(endDate))

  setInterval(() => {
    setTimeLeft(calculateTimeLeft(endDate))
  }, 1000)

  return (
    <Wrapper
      to={`/auction?auctionId=${auctionInfo.auctionId}&chainId=${Number(auctionInfo.chainId)}`}
      {...restProps}
    >
      <Top>
        <Tokens>
          {auctionInfo.symbolAuctioningToken}/{auctionInfo.symbolBiddingToken}
        </Tokens>
        <Badge>{timeLeft && timeLeft > -1 ? formatSeconds(timeLeft) : '-'}</Badge>
      </Top>
      <Details>
        <TokenIcons
          a0={auctionInfo.addressAuctioningToken}
          a1={auctionInfo.addressBiddingToken}
          margin={true}
          size={68}
        />
        <SellingText>
          Selling {auctionInfo.order.volume + ` `}
          {auctionInfo.symbolAuctioningToken}
        </SellingText>
      </Details>
      <PriceAndDuration>
        <Cell>
          <Subtitle>Current price</Subtitle>
          <Text>
            {auctionInfo.order.price.toFixed(2)} {` ` + auctionInfo.symbolBiddingToken} per{' '}
            {auctionInfo.symbolAuctioningToken}
          </Text>
        </Cell>
        <Cell>
          <Subtitle textAlign="right">Duration</Subtitle>
          {/* <CountdownTimer auctionEndDate={auctionInfo.endTimeTimestamp} showText={false} /> */}
        </Cell>
      </PriceAndDuration>
    </Wrapper>
  )
}

export default AuctionInfoCard
