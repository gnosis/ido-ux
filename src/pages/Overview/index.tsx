import React from 'react'
import styled from 'styled-components'

import AllAuctions from '../../components/auctions/AllAuctions'
import { FeaturedAuctions } from '../../components/auctions/FeaturedAuctions'
import DoubleLogo from '../../components/common/DoubleLogo'
import { InlineLoading } from '../../components/common/InlineLoading'
import { SpinnerSize } from '../../components/common/Spinner'
import { Tooltip } from '../../components/common/Tooltip'
import { ChevronRightBig } from '../../components/icons/ChevronRightBig'
import { InfoIcon } from '../../components/icons/InfoIcon'
import { Private } from '../../components/icons/Private'
import { YesIcon } from '../../components/icons/YesIcon'
import {
  EmptyContentText,
  EmptyContentWrapper,
} from '../../components/pureStyledComponents/EmptyContent'
import { useAllAuctionInfo } from '../../hooks/useAllAuctionInfos'
import { getChainName } from '../../utils/tools'

const Chevron = styled(ChevronRightBig)`
  flex-shrink: 0;
  min-width: 11px;
`

const Featured = styled(FeaturedAuctions)`
  margin-top: 40px;

  .featuredAutionsTitle {
    margin-bottom: 25px;
  }
`

const Overview = () => {
  const allAuctions = useAllAuctionInfo()
  const tableData = []
  const mockedParticipation = 'yes'

  allAuctions?.forEach((item) => {
    tableData.push({
      auctionId: `#${item.auctionId}`,
      buying: item.symbolBiddingToken,
      chainId: getChainName(Number(item.chainId)),
      chevron: <Chevron />,
      date: (
        <>
          <span>{new Date(item.endTimeTimestamp * 1000).toLocaleDateString()}</span>
          <Tooltip
            id={`auction_date${item.auctionId}`}
            text={new Date(item.endTimeTimestamp * 1000).toString()}
          />
        </>
      ),
      participation:
        mockedParticipation === 'yes' ? (
          <>
            <span>Yes</span>
            <YesIcon />
          </>
        ) : (
          'No'
        ),
      selling: item.symbolAuctioningToken,
      status: new Date(item.endTimeTimestamp * 1000) > new Date() ? 'Ongoing' : 'Ended',
      symbol: (
        <DoubleLogo
          auctioningToken={{
            address: item.addressAuctioningToken,
            symbol: item.symbolAuctioningToken,
          }}
          biddingToken={{
            address: item.addressBiddingToken,
            symbol: item.symbolBiddingToken,
          }}
          size="32px"
        />
      ),
      type: item.isPrivateAuction ? (
        <>
          <span>Private</span>
          <Private />
        </>
      ) : (
        'Public'
      ),
      url: `/auction?auctionId=${item.auctionId}&chainId=${Number(item.chainId)}#topAnchor`,
    })
  })

  return (
    <>
      <Featured />
      {(allAuctions === undefined || allAuctions === null) && (
        <InlineLoading message="Loading..." size={SpinnerSize.small} />
      )}
      {allAuctions && allAuctions.length === 0 && (
        <EmptyContentWrapper>
          <InfoIcon />
          <EmptyContentText>No auctions.</EmptyContentText>
        </EmptyContentWrapper>
      )}
      {allAuctions && allAuctions.length > 0 && <AllAuctions {...tableData} />}
    </>
  )
}

export default Overview
