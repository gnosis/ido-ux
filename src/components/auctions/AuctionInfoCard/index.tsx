import React from 'react'
import styled, { keyframes } from 'styled-components'

import { HashLink } from 'react-router-hash-link'

import { AuctionInfo } from '../../../hooks/useAllAuctionInfos'
import { abbreviation } from '../../../utils/numeral'
import {
  calculateTimeLeft,
  calculateTimeProgress,
  getChainName,
  getDays,
  getHours,
  getMinutes,
  getSeconds,
} from '../../../utils/tools'
import { NetworkIcon } from '../../icons/NetworkIcon'
import DoubleLogo from '../../token/DoubleLogo'

const Wrapper = styled(HashLink)`
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

const Cell = styled.span`
  display: flex;
  flex-direction: column;
`

const Subtitle = styled.span<{ textAlign?: string }>`
  color: ${({ theme }) => theme.text1};
  display: block;
  font-size: 13px;
  font-weight: normal;
  line-height: 1.2;
  margin: 0;
  opacity: 0.7;
  padding: 0 0 5px;
  text-align: ${(props) => props.textAlign};
`

Subtitle.defaultProps = {
  textAlign: 'left',
}

const Text = styled.span`
  color: ${({ theme }) => theme.primary1};
  font-size: 13px;
  font-weight: 700;
  line-height: 1.2;
  margin-top: auto;
`

const ProgressBar = styled.span`
  background-color: rgba(232, 102, 61, 0.15);
  border-radius: 5px;
  display: block;
  height: 5px;
  margin-bottom: 3px;
  margin-top: auto;
  width: 120px;
`

const Progress = styled.span<{ width: string }>`
  background-color: ${({ theme }) => theme.primary1};
  border-radius: 5px;
  display: block;
  height: 100%;
  max-width: 100%;
  width: ${(props) => props.width};
`

const Network = styled.div`
  align-items: center;
  display: flex;
  justify-content: center;
  opacity: 0.7;
  padding-top: 4px;
`

const NetworkName = styled.div`
  color: ${({ theme }) => theme.text1};
  font-size: 11px;
  font-weight: 600;
  margin-left: 5px;
`

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

interface Props {
  auctionInfo: AuctionInfo
}

const AuctionInfoCard: React.FC<Props> = (props) => {
  const { auctionInfo, ...restProps } = props
  const { chainId, endTimeTimestamp, startingTimestamp } = auctionInfo
  const [timeLeft, setTimeLeft] = React.useState(calculateTimeLeft(endTimeTimestamp))

  React.useEffect(() => {
    const interval = setInterval(() => {
      setTimeLeft(calculateTimeLeft(endTimeTimestamp))
    }, 1000)
    return () => clearInterval(interval)
  }, [endTimeTimestamp])

  const progressWidth = React.useMemo(() => {
    const progress = calculateTimeProgress(startingTimestamp, endTimeTimestamp)
    return `${100 - progress}%`
  }, [startingTimestamp, endTimeTimestamp])

  return (
    <Wrapper
      to={`/auction?auctionId=${auctionInfo.auctionId}&chainId=${Number(
        auctionInfo.chainId,
      )}#topAnchor`}
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
          auctioningToken={{
            address: auctionInfo.addressAuctioningToken,
            symbol: auctionInfo.symbolAuctioningToken,
          }}
          biddingToken={{
            address: auctionInfo.addressBiddingToken,
            symbol: auctionInfo.symbolBiddingToken,
          }}
          size="68px"
        />
        <SellingText>
          Selling{' '}
          <span title={auctionInfo.order.volume + ' ' + auctionInfo.symbolAuctioningToken}>
            {abbreviation(auctionInfo.order.volume.toFixed(2)) + ` `}
          </span>
          {auctionInfo.symbolAuctioningToken}
        </SellingText>
        <Network>
          <NetworkIcon />
          <NetworkName>Selling on {getChainName(parseInt(chainId.toString()))}</NetworkName>
        </Network>
      </Details>
      <PriceAndDuration>
        <Cell>
          <Subtitle>Current price</Subtitle>
          <Text>
            {abbreviation(auctionInfo.order.price.toFixed(2))}{' '}
            {` ` + auctionInfo.symbolBiddingToken} per {auctionInfo.symbolAuctioningToken}
          </Text>
        </Cell>
        <Cell>
          <Subtitle textAlign="right">Duration</Subtitle>
          <ProgressBar>
            <Progress width={progressWidth} />
          </ProgressBar>
        </Cell>
      </PriceAndDuration>
    </Wrapper>
  )
}

export default AuctionInfoCard
