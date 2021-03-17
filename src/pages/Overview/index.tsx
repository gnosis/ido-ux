import React from 'react'
import styled from 'styled-components'

import AllAuctions from '../../components/auctions/AllAuctions'
import { FeaturedAuctions } from '../../components/auctions/FeaturedAuctions'
import DoubleLogo from '../../components/common/DoubleLogo'
import { Tooltip } from '../../components/common/Tooltip'
import { ChevronRightBig } from '../../components/icons/ChevronRightBig'
import { Private } from '../../components/icons/Private'
import { YesIcon } from '../../components/icons/YesIcon'
import { useAllAuctionInfo } from '../../hooks/useAllAuctionInfos'
import { useSetNoDefaultNetworkId } from '../../state/orderPlacement/hooks'
import { getChainName } from '../../utils/tools'

const Chevron = styled(ChevronRightBig)`
  flex-shrink: 0;
  min-width: 11px;
`

const Featured = styled(FeaturedAuctions)`
  margin-top: 40px;

  .featuredAuctionsTitle {
    margin-bottom: 25px;
  }
`

const Overview = () => {
  const allAuctions = useAllAuctionInfo()
  const tableData = []
  const mockedParticipation = 'yes'

  useSetNoDefaultNetworkId()

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
      <AllAuctions
        isLoading={allAuctions === undefined || allAuctions === null}
        tableData={tableData}
      />
    </>
  )
}

export default Overview
