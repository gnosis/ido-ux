import React from 'react'
import styled from 'styled-components'

import { AuctionInfo } from '../../../hooks/useAllAuctionInfos'
import { InfoIcon } from '../../icons/InfoIcon'
import { EmptyContentText, EmptyContentWrapper } from '../../pureStyledComponents/EmptyContent'
import { PageTitle } from '../../pureStyledComponents/PageTitle'
import AuctionInfoCard from '../AuctionInfoCard'

const Wrapper = styled.div`
  margin-bottom: 40px;
`

const Row = styled.div`
  display: grid;
  grid-template-columns: 1fr;
  row-gap: 20px;

  @media (min-width: ${({ theme }) => theme.themeBreakPoints.md}) {
    column-gap: 40px;
    grid-template-columns: 1fr 1fr 1fr;
  }
`

const SectionTitle = styled(PageTitle)`
  margin: 0 0 25px;

  @media (min-width: ${({ theme }) => theme.themeBreakPoints.md}) {
    margin: 0 0 40px;
  }
`

interface Props {
  featuredAuctions: Maybe<AuctionInfo[]>
}

export const FeaturedAuctions = (props: Props) => {
  const { featuredAuctions, ...restProps } = props

  const auctions = React.useMemo(() => featuredAuctions && featuredAuctions.slice(0, 3), [
    featuredAuctions,
  ])

  return (
    <Wrapper {...restProps}>
      <SectionTitle as="h2" className="featuredAuctionsTitle">
        Featured Auctions
      </SectionTitle>
      {featuredAuctions && featuredAuctions.length === 0 && (
        <EmptyContentWrapper>
          <InfoIcon />
          <EmptyContentText>No featured auctions.</EmptyContentText>
        </EmptyContentWrapper>
      )}
      {auctions && auctions.length > 0 && (
        <Row>
          {auctions.map((auction, index) => (
            <AuctionInfoCard auctionInfo={auction} key={index} />
          ))}
        </Row>
      )}
    </Wrapper>
  )
}
