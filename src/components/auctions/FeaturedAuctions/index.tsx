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
  column-gap: 40px;
  display: grid;
  grid-template-columns: 1fr 1fr 1fr;
`

const SectionTitle = styled(PageTitle)`
  margin: 0 0 40px;
`

export const FeaturedAuctions: React.FC = (props) => {
  const { ...restProps } = props
  const highlightedAuctions = useInterestingAuctionInfo()

  const auctions = React.useMemo(() => {
    const items: React.ReactNodeArray = []

    if (highlightedAuctions && highlightedAuctions.length > 0) {
      const highlightedAuctionsFirstThree = highlightedAuctions.slice(0, 3)
      for (const highlightedAuction of highlightedAuctionsFirstThree) {
        items.push(
          <AuctionInfoCard auctionInfo={highlightedAuction} key={highlightedAuction.auctionId} />,
        )
      }
    }

    return items
  }, [highlightedAuctions])

  return (
    <Wrapper {...restProps}>
      <SectionTitle as="h2" className="featuredAuctionsTitle">
        Featured Auctions
      </SectionTitle>
      {(highlightedAuctions === undefined || highlightedAuctions === null) && (
        <InlineLoading message="Loading..." size={SpinnerSize.small} />
      )}
      {highlightedAuctions && highlightedAuctions.length === 0 && (
        <EmptyContentWrapper>
          <InfoIcon />
          <EmptyContentText>No featured auctions.</EmptyContentText>
        </EmptyContentWrapper>
      )}
      {highlightedAuctions && highlightedAuctions.length > 0 && <Row>{auctions}</Row>}
    </Wrapper>
  )
}
