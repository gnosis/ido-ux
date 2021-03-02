import React from 'react'
import { useHistory } from 'react-router-dom'
import styled from 'styled-components'

import DatatablePage from '../../components/AllAuctionsTable'
import AuctionInfoCard from '../../components/AuctionInfoCard'
import { ButtonLight } from '../../components/Button'
import DoubleLogo from '../../components/common/DoubleLogo'
import { chainNames } from '../../constants'
import { useAllAuctionInfo } from '../../hooks/useAllAuctionInfos'
import { useInterestingAuctionInfo } from '../../hooks/useInterestingAuctionDetails'

const ViewBtn = styled(ButtonLight)`
  background: none;
  width: 100%;
  color: ${({ theme }) => theme.text3};

  &:hover {
    background: none;
  }

  > svg {
    margin: 0 0 0 5px;
  }
`

export default function Overview() {
  // Todo: think about how to get a network id without connection to metamaks
  const chainId = 4
  const highlightedAuctions = useInterestingAuctionInfo(4, chainId)
  const allAuctions = useAllAuctionInfo()
  const history = useHistory()
  const tableData = []
  let highlightedAuctionEntries = []

  const handleClick = (auctionId: number, chainId: number) => {
    history.push(`/auction?auctionId=${auctionId}&chainId=${chainId}`)
  }

  if (highlightedAuctions && highlightedAuctions.length > 0) {
    highlightedAuctionEntries = Object.entries(highlightedAuctions)
  }

  if (allAuctions && allAuctions.length > 0) {
    allAuctions.forEach((item) => {
      tableData.push({
        auctionId: item.auctionId,
        chainId: chainNames[Number(item.chainId)],
        selling: item.symbolAuctioningToken,
        buying: item.symbolBiddingToken,
        symbol: (
          <DoubleLogo
            a0={item.addressAuctioningToken}
            a1={item.addressBiddingToken}
            margin={true}
            size={40}
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
  }

  return (
    <>
      <div style={{ display: 'flex', marginBottom: '40px' }}>
        {Object.entries(highlightedAuctionEntries).map((auctionInfo) => (
          <AuctionInfoCard key={auctionInfo[0]} {...auctionInfo[1]} />
        ))}
      </div>
      <DatatablePage {...tableData} />
    </>
  )
}
