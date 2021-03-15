import React from 'react'

import AllAuctions from '../../components/auctions/AllAuctions'
import { FeaturedAuctions } from '../../components/auctions/FeaturedAuctions'
import DoubleLogo from '../../components/common/DoubleLogo'
import { InlineLoading } from '../../components/common/InlineLoading'
import { SpinnerSize } from '../../components/common/Spinner'
import { Tooltip } from '../../components/common/Tooltip'
import { ChevronRightBig } from '../../components/icons/ChevronRightBig'
import { InfoIcon } from '../../components/icons/InfoIcon'
import {
  EmptyContentText,
  EmptyContentWrapper,
} from '../../components/pureStyledComponents/EmptyContent'
import { useAllAuctionInfo } from '../../hooks/useAllAuctionInfos'
import { getChainName } from '../../utils/tools'

const Overview = () => {
  const allAuctions = useAllAuctionInfo()
  const tableData = []

  allAuctions?.forEach((item) => {
    tableData.push({
      auctionId: `#${item.auctionId}`,
      buying: item.symbolBiddingToken,
      chainId: getChainName(Number(item.chainId)),
      chevron: <ChevronRightBig />,
      date: (
        <>
          <span>{new Date(item.endTimeTimestamp * 1000).toLocaleDateString()}</span>
          <Tooltip
            id={`auction_date${item.auctionId}`}
            text={new Date(item.endTimeTimestamp * 1000).toString()}
          />
        </>
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
      url: `/auction?auctionId=${item.auctionId}&chainId=${Number(item.chainId)}#topAnchor`,
    })
  })

  return (
    <>
      <FeaturedAuctions />
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
