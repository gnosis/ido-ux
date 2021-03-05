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

interface Props {
  auctionsAmount?: number
}

export const FeaturedAuctions: React.FC<Props> = (props) => {
  const { auctionsAmount = 3, ...restProps } = props
  // We should think about how to get a network id without connection to metamask
  const chainId = 4
  const highlightedAuctions = useInterestingAuctionInfo(4, chainId)

  const getItems = () => {
    const maxItems = !highlightedAuctions
      ? 0
      : auctionsAmount > highlightedAuctions.length
      ? highlightedAuctions.length
      : auctionsAmount
    const items: React.ReactNodeArray = []

    for (let count = 0; count < maxItems; count++) {
      items.push(<AuctionInfoCard auctionInfo={highlightedAuctions[count]} key={count} />)
    }

    return items
  }

  return !auctionsAmount ? null : (
    <Wrapper {...restProps}>
      <SectionTitle as="h2">Featured Auctions</SectionTitle>
      {(highlightedAuctions === undefined || highlightedAuctions === null) && (
        <InlineLoading message="Loading..." size={SpinnerSize.small} />
      )}
      {highlightedAuctions && highlightedAuctions.length === 0 && (
        <EmptyContentWrapper>
          <InfoIcon />
          <EmptyContentText>No featured auctions.</EmptyContentText>
        </EmptyContentWrapper>
      )}
      {highlightedAuctions && highlightedAuctions.length > 0 && <Row>{getItems()}</Row>}
    </Wrapper>
  )
}
