import React from 'react'
import styled from 'styled-components'

import { useInterestingAuctionInfo } from '../../../hooks/useInterestingAuctionDetails'
import { InlineLoading } from '../../common/InlineLoading'
import { SpinnerSize } from '../../common/Spinner'
import { InfoIcon } from '../../icons/InfoIcon'
import { EmptyContentText, EmptyContentWrapper } from '../../pureStyledComponents/EmptyContent'
import { PageTitle } from '../../pureStyledComponents/PageTitle'
import AuctionInfoCard from '../AuctionInfoCard'

const Wrapper = styled.div`
  margin-bottom: 40px;
`

const Row = styled.div`
  display: flex;
`

const SectionTitle = styled(PageTitle)`
  margin: 0 0 40px;
`

export const FeaturedAuctions: React.FC = (props) => {
  const { ...restProps } = props
  // We should think about how to get a network id without connection to metamask
  const chainId = 4
  const highlightedAuctions = useInterestingAuctionInfo(4, chainId)

  return (
    <Wrapper {...restProps}>
      <SectionTitle>Featured Auctions</SectionTitle>
      {(highlightedAuctions === undefined || highlightedAuctions === null) && (
        <InlineLoading message="Loading..." size={SpinnerSize.small} />
      )}
      {highlightedAuctions && highlightedAuctions.length === 0 && (
        <EmptyContentWrapper>
          <InfoIcon />
          <EmptyContentText>No featured auctions.</EmptyContentText>
        </EmptyContentWrapper>
      )}
      {highlightedAuctions && highlightedAuctions.length > 0 && (
        <Row>
          {Object.entries(highlightedAuctions).map((auctionInfo) => (
            <AuctionInfoCard key={auctionInfo[0]} {...auctionInfo[1]} />
          ))}
        </Row>
      )}
    </Wrapper>
  )
}
