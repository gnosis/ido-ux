import { transparentize } from 'polished'
import React from 'react'
import styled, { css, keyframes } from 'styled-components'

import { HashLink } from 'react-router-hash-link'

import { AuctionInfo } from '../../../hooks/useAllAuctionInfos'
import { abbreviation } from '../../../utils/numeral'
import {
  calculateTimeLeft,
  getChainName,
  getDays,
  getHours,
  getMinutes,
  getSeconds,
} from '../../../utils/tools'
import { NetworkIcon } from '../../icons/NetworkIcon'
import { Private } from '../../icons/Private'
import DoubleLogo from '../../token/DoubleLogo'

const Wrapper = styled(HashLink)`
  align-items: center;
  border-radius: 12px;
  border: 1px solid ${({ theme }) => theme.border};
  display: flex;
  flex-flow: column;
  justify-content: space-between;
  min-height: 260px;
  padding: 12px 15px;
  text-decoration: none;
  transition: box-shadow 0.15s linear;

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
  font-size: 20px;
  font-weight: 600;
  letter-spacing: -1px;
  line-height: 1.2;
  margin: 0;
  text-transform: uppercase;
  white-space: nowrap;
`

const Badge = styled.span`
  align-items: center;
  background-color: rgba(232, 102, 61, 0.3);
  border-radius: 10px;
  color: ${({ theme }) => theme.primary1};
  display: flex;
  font-size: 13px;
  font-weight: 600;
  height: 23px;
  justify-content: center;
  line-height: 1;
  padding: 0 10px;
  white-space: nowrap;
  width: 78px;
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

const TokenIcons = styled(DoubleLogo)`
  margin-bottom: 10px;
`

const Selling = styled.h3`
  color: ${({ theme }) => theme.text1};
  font-size: 18px;
  font-weight: 700;
  line-height: 1.2;
  margin: 0 0 2px;
  text-align: center;
`

const CurrentPrice = styled.p`
  color: ${({ theme }) => theme.primary1};
  font-size: 12px;
  font-weight: 600;
  line-height: 1.2;
  margin: 0;
  text-align: center;
`

const Bottom = styled.span`
  align-items: center;
  display: flex;
  justify-content: space-between;
  width: 100%;
`

const BottomCell = styled.span`
  align-items: center;
  display: flex;
  white-space: nowrap;

  &:first-child {
    margin-right: auto;
  }
`

const BottomCellText = styled.span`
  color: ${({ theme }) => transparentize(0.1, theme.text1)};
  font-size: 11px;
  font-weight: 600;
  line-height: 1.2;
  text-align: left;
`

const IconCSS = css`
  height: 12px;
  width: 12px;
  margin-right: 5px;

  .fill {
    fill: ${({ theme }) => transparentize(0.1, theme.text1)};
  }
`

const BottomIconNetwork = styled(NetworkIcon)`
  ${IconCSS}
`

const BottomIconPrivate = styled(Private)`
  ${IconCSS}
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

interface Props {
  auctionInfo: AuctionInfo
}

const AuctionInfoCard: React.FC<Props> = (props) => {
  const { auctionInfo, ...restProps } = props
  const { chainId, endTimeTimestamp } = auctionInfo
  const [timeLeft, setTimeLeft] = React.useState(calculateTimeLeft(endTimeTimestamp))

  React.useEffect(() => {
    const interval = setInterval(() => {
      setTimeLeft(calculateTimeLeft(endTimeTimestamp))
    }, 1000)
    return () => clearInterval(interval)
  }, [endTimeTimestamp])

  return (
    <Wrapper
      to={`/auction?auctionId=${auctionInfo.auctionId}&chainId=${Number(
        auctionInfo.chainId,
      )}#topAnchor`}
      {...restProps}
    >
      <Top>
        <Tokens>
          {auctionInfo.symbolAuctioningToken} / {auctionInfo.symbolBiddingToken}
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
          size="62px"
        />
        <Selling>
          Selling{' '}
          <span title={auctionInfo.order.volume + ' ' + auctionInfo.symbolAuctioningToken}>
            {abbreviation(auctionInfo.order.volume.toFixed(2)) + ` `}
          </span>
          {auctionInfo.symbolAuctioningToken}
        </Selling>
        <CurrentPrice>
          Current price:{' '}
          {`${abbreviation(auctionInfo.currentClearingPrice.toString())} ${
            auctionInfo.symbolBiddingToken
          } per ${auctionInfo.symbolAuctioningToken}`}
        </CurrentPrice>
      </Details>
      <Bottom>
        <BottomCell>
          <BottomIconNetwork />
          <BottomCellText>{`Selling on ${getChainName(
            parseInt(chainId.toString()),
          )}`}</BottomCellText>
        </BottomCell>
        {auctionInfo.isPrivateAuction && (
          <BottomCell>
            <BottomIconPrivate />
            <BottomCellText>Private auction</BottomCellText>
          </BottomCell>
        )}
      </Bottom>
    </Wrapper>
  )
}

export default AuctionInfoCard
