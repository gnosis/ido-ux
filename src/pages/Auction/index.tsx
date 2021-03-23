import React from 'react'
import { RouteComponentProps } from 'react-router-dom'
import styled from 'styled-components'

import AuctionBody from '../../components/auction/AuctionBody'
import AuctionDetails from '../../components/auction/AuctionDetails'
import { ButtonCopy } from '../../components/buttons/ButtonCopy'
import { NetworkIcon } from '../../components/icons/NetworkIcon'
import { PageTitle } from '../../components/pureStyledComponents/PageTitle'
import { useDefaultsFromURLSearch, useDerivedAuctionInfo } from '../../state/orderPlacement/hooks'
import { parseURL } from '../../state/orderPlacement/reducer'
import { getChainName } from '../../utils/tools'

const Title = styled(PageTitle)`
  margin-bottom: 2px;
`

const SubTitleWrapper = styled.div`
  align-items: center;
  display: flex;
  margin: 0 0 40px;
`

const SubTitle = styled.h2`
  align-items: center;
  color: ${({ theme }) => theme.text1};
  display: flex;
  font-size: 15px;
  font-weight: 400;
  line-height: 1.2;
  margin: 0 6px 0 0;
`

const AuctionId = styled.span`
  align-items: center;
  display: flex;
`

const CopyButton = styled(ButtonCopy)`
  height: 14px;
  width: 14px;
`

const Network = styled.span`
  align-items: center;
  display: flex;
  margin-right: 5px;
`

const NetworkIconStyled = styled(NetworkIcon)`
  height: 14px;
  width: 14px;
`

const NetworkName = styled.span`
  margin-left: 8px;
  text-transform: capitalize;
`

const Auction = ({ location: { search } }: RouteComponentProps) => {
  // needed to update the auctionId for header component
  useDefaultsFromURLSearch(search)
  const auctionIdentifier = parseURL(search)
  const derivedAuctionInfo = useDerivedAuctionInfo(auctionIdentifier)

  const url = window.location.href

  return (
    <>
      <Title>Auction Details</Title>
      <SubTitleWrapper>
        <SubTitle>
          <Network>
            <NetworkIconStyled />
            <NetworkName>Selling on {getChainName(auctionIdentifier.chainId)} -</NetworkName>
          </Network>
          <AuctionId>Auction Id #{auctionIdentifier.auctionId}</AuctionId>
        </SubTitle>
        <CopyButton copyValue={url} title="Copy URL" />
      </SubTitleWrapper>
      <AuctionDetails
        auctionIdentifier={auctionIdentifier}
        auctionState={derivedAuctionInfo?.auctionState}
        derivedAuctionInfo={derivedAuctionInfo}
      />
      <AuctionBody
        auctionIdentifier={auctionIdentifier}
        auctionState={derivedAuctionInfo?.auctionState}
        derivedAuctionInfo={derivedAuctionInfo}
      />
    </>
  )
}

export default Auction
