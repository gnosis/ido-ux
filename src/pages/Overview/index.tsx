import React from 'react'
import { useHistory } from 'react-router-dom'
import styled from 'styled-components'

import DatatablePage from '../../components/AllAuctionsTable'
import { ButtonLight } from '../../components/Button'
import { FeaturedAuctions } from '../../components/auctions/FeaturedAuctions'
import DoubleLogo from '../../components/common/DoubleLogo'
import { InlineLoading } from '../../components/common/InlineLoading'
import { SpinnerSize } from '../../components/common/Spinner'
import { InfoIcon } from '../../components/icons/InfoIcon'
import {
  EmptyContentText,
  EmptyContentWrapper,
} from '../../components/pureStyledComponents/EmptyContent'
import { chainNames } from '../../constants'
import { useAllAuctionInfo } from '../../hooks/useAllAuctionInfos'

const ViewBtn = styled(ButtonLight)`
  background: none;
  color: ${({ theme }) => theme.text3};
  width: 100%;

  &:hover {
    background: none;
  }

  > svg {
    margin: 0 0 0 5px;
  }
`

export default function Overview() {
  const allAuctions = useAllAuctionInfo()
  const history = useHistory()

  const handleClick = (auctionId: number, chainId: number) => {
    history.push(`/auction?auctionId=${auctionId}&chainId=${chainId}#topAnchor`)
  }

  const tableData = []
  allAuctions?.forEach((item) => {
    tableData.push({
      auctionId: item.auctionId,
      chainId: chainNames[Number(item.chainId)],
      selling: item.symbolAuctioningToken,
      buying: item.symbolBiddingToken,
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
          size="40px"
        />
      ),
      date: new Date(item.endTimeTimestamp * 1000).toLocaleDateString(),
      status: new Date(item.endTimeTimestamp * 1000) > new Date() ? 'Ongoing' : 'Ended',
      link: (
        <ViewBtn onClick={() => handleClick(item.auctionId, Number(item.chainId))} type="button">
          {' '}
          view{' '}
        </ViewBtn>
      ),
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
      {allAuctions && allAuctions.length > 0 && <DatatablePage {...tableData} />}
    </>
  )
}
