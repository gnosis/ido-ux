import React from 'react'
import styled from 'styled-components'

import AllAuctions from '../../components/auctions/AllAuctions'
import { FeaturedAuctions } from '../../components/auctions/FeaturedAuctions'
import { InlineLoading } from '../../components/common/InlineLoading'
import { Tooltip } from '../../components/common/Tooltip'
import { ChevronRightBig } from '../../components/icons/ChevronRightBig'
import { Private } from '../../components/icons/Private'
import { YesIcon } from '../../components/icons/YesIcon'
import DoubleLogo from '../../components/token/DoubleLogo'
import { useActiveWeb3React } from '../../hooks'
import {
  AuctionInfo,
  useAllAuctionInfo,
  useAllAuctionInfoWithParticipation,
} from '../../hooks/useAllAuctionInfos'
import { useInterestingAuctionInfo } from '../../hooks/useInterestingAuctionDetails'
import { useSetNoDefaultNetworkId } from '../../state/orderPlacement/hooks'
import { getChainName } from '../../utils/tools'

const Chevron = styled(ChevronRightBig)`
  flex-shrink: 0;
  width: 11px;
`

const CheckIcon = styled(YesIcon)`
  height: 14px;
  width: 14px;
`

const PrivateIcon = styled(Private)`
  zoom: unset;
`

const Overview = () => {
  const { account } = useActiveWeb3React()
  return account ? <OverviewWithAccount account={account} /> : <OverviewWithoutAccount />
}

const OverviewWithoutAccount = () => {
  const allAuctions = useAllAuctionInfo()
  return <OverviewCommon allAuctions={allAuctions} />
}

const OverviewWithAccount = ({ account }: { account: string }) => {
  const allAuctions = useAllAuctionInfoWithParticipation(account)
  return <OverviewCommon allAuctions={allAuctions} />
}

interface OverviewProps {
  allAuctions: Maybe<AuctionInfo[]>
}

const OverviewCommon = ({ allAuctions }: OverviewProps) => {
  const tableData = []

  const featuredAuctions = useInterestingAuctionInfo()

  const allAuctionsSorted = allAuctions?.sort((a, b) => {
    const aStatus = new Date(a.endTimeTimestamp * 1000) > new Date() ? 'Ongoing' : 'Ended'
    const bStatus = new Date(b.endTimeTimestamp * 1000) > new Date() ? 'Ongoing' : 'Ended'
    return bStatus.localeCompare(aStatus) || b.interestScore - a.interestScore
  })

  useSetNoDefaultNetworkId()

  allAuctionsSorted?.forEach((item) => {
    tableData.push({
      auctionId: `#${item.auctionId}`,
      buying: item.symbolBiddingToken,
      chainId: getChainName(Number(item.chainId)),
      chevron: <Chevron />,
      date: (
        <>
          <span>{new Date(item.endTimeTimestamp * 1000).toLocaleDateString()}</span>
          <Tooltip text={new Date(item.endTimeTimestamp * 1000).toString()} />
        </>
      ),
      participation: item.hasParticipation ? (
        <>
          <span>Yes</span>
          <CheckIcon />
        </>
      ) : (
        'No'
      ),
      selling: item.symbolAuctioningToken == 'WXDAI' ? 'XDAI' : item.symbolAuctioningToken,
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
          size="26px"
        />
      ),
      type: item.isPrivateAuction ? (
        <>
          <span>Private</span>
          <PrivateIcon />
        </>
      ) : (
        'Public'
      ),
      url: `/auction?auctionId=${item.auctionId}&chainId=${Number(item.chainId)}#topAnchor`,
    })
  })

  const isLoading = React.useMemo(
    () =>
      featuredAuctions === undefined ||
      featuredAuctions === null ||
      allAuctions === undefined ||
      allAuctions === null,
    [allAuctions, featuredAuctions],
  )

  return (
    <>
      {isLoading && <InlineLoading />}
      {!isLoading && (
        <>
          <FeaturedAuctions featuredAuctions={featuredAuctions} />
          <AllAuctions tableData={tableData} />
        </>
      )}
    </>
  )
}

export default Overview
