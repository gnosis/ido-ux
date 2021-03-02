import React from 'react'
import { useHistory } from 'react-router-dom'
import styled from 'styled-components'

import { AuctionInfo } from '../../../hooks/useAllAuctionInfos'
import { ButtonLight } from '../../Button'
import DoubleLogo from '../../common/DoubleLogo'

const HeaderWrapper = styled.div`
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

const Wrapper = styled.div`
  position: relative;
  width: calc(50% - 8px);
  background: none;
  box-shadow: none;
  border-radius: 20px;
  padding: 0px;
  flex: 0 1 auto;
  box-sizing: border-box;
  display: flex;
  flex-flow: column wrap;

  ${({ theme }) => theme.mediaWidth.upToMedium`
    width: 100%;
  `};
`

const ViewBtn = styled(ButtonLight)`
  background: none;
  height: 100%;
  width: 100%;
  color: ${({ theme }) => theme.text3};

  &:hover {
    background: none;
  }

  > svg {
    margin: 0 0 0 5px;
  }
`

const Details = styled.div`
  color: ${({ theme }) => theme.text1};
  background: ${({ theme }) => theme.bg1};
  font-size: 13px;
  width: 100%;
  height: 100%;
  font-weight: normal;
  display: flex;
  flex-flow: column wrap;
  padding: 16px;
  border-radius: 20px;
  border: 1px solid ${({ theme }) => theme.bg2};
`

const Row = styled.span`
  flex-flow: row-wrap;
  width: 100%;
  justify-content: space-between;
  align-items: flex;
  margin: 0 0 4px 0;
  font-weight: normal;
  display: grid;
  grid-template-columns: 1fr 1fr;
  grid-template-areas: 'label value';

  > i {
    color: ${({ theme }) => theme.text3};
    font-style: normal;
    text-align: left;
  }

  > a {
    text-align: right;
  }

  > p {
    margin: 0;
    padding: 0;
    text-align: right;
    white-space: normal;
  }
`

export default function AuctionInfoCard(auctionInfo: AuctionInfo) {
  const history = useHistory()

  function handleClick() {
    history.push(
      `/auction?auctionId=${auctionInfo.auctionId}&chainId=${Number(auctionInfo.chainId)}`,
    )
  }

  return (
    <Wrapper>
      <ViewBtn onClick={handleClick} type="button">
        <Details>
          <HeaderWrapper>
            <h3>
              Selling {auctionInfo.order.volume + ` `}
              {auctionInfo.symbolAuctioningToken}
            </h3>
            <DoubleLogo
              a0={auctionInfo.addressAuctioningToken}
              a1={auctionInfo.addressBiddingToken}
              margin={true}
              size={40}
            />
          </HeaderWrapper>
          <Row>
            <i>Ends in</i>
            {/* <CountdownTimer auctionEndDate={auctionInfo.endTimeTimestamp} showText={false} /> */}
          </Row>

          <Row>
            <i>Min. price</i>
            <p>
              {auctionInfo.order.price} {` ` + auctionInfo.symbolBiddingToken} per{' '}
              {auctionInfo.symbolAuctioningToken}
            </p>
          </Row>
          <Row>
            <i>Id</i> <p>{auctionInfo.auctionId}</p>
          </Row>
        </Details>
      </ViewBtn>
    </Wrapper>
  )
}
