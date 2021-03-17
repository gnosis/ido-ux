import React from 'react'
import { NavLink, useLocation } from 'react-router-dom'
import styled from 'styled-components'

import ReactMarkdown from 'react-markdown'

import { PageTitle } from '../../components/pureStyledComponents/PageTitle'
import overviewDocMarkdown from '../../docs/files/devguide01.md'
import batchAuctionDocMarkdown from '../../docs/files/devguide02.md'
import useCasesDocMarkdown from '../../docs/files/devguide03.md'
import userFlowDocMarkdown from '../../docs/files/devguide04.md'
import participateAsABidderDocMarkdown from '../../docs/files/devguide05.md'
import participateAsAuctioneerDocMarkdown from '../../docs/files/devguide06.md'
import faqDocMarkdown from '../../docs/files/devguide07.md'

const Wrapper = styled.div`
  padding-bottom: 50px;
`

const Title = styled(PageTitle)`
  margin-bottom: 0;
`

const Grid = styled.div`
  column-gap: 20px;
  display: grid;
  grid-template-columns: 240px 1fr;
`

const Sidebar = styled.div`
  display: flex;
  flex-direction: column;
  height: fit-content;
  padding-right: 24px;
  padding-top: 24px;
  position: sticky;
  top: 0;
`

const Content = styled.div`
  overflow: auto;
  padding: 24px 24px 0 24px;
`

const IndexLink = styled(NavLink)`
  color: ${({ theme }) => theme.text1};
  font-size: 14px;
  line-height: 1.6;
  margin-bottom: 8px;
  text-decoration: none;

  &.isActive {
    color: ${({ theme }) => theme.primary1};
  }
`

export const Documentation: React.FC = (props) => {
  const { ...restProps } = props
  const [content, setContent] = React.useState(null)
  const location = useLocation()

  const fetchGuide = React.useCallback(
    async (guide: any) => {
      const response = await fetch(guide)
      const markdown = await response.text()
      setContent(markdown)
    },
    [setContent],
  )

  React.useEffect(() => {
    if (location.pathname === '/docs') fetchGuide(overviewDocMarkdown)
    if (location.pathname === '/docs/batch-auctions') fetchGuide(batchAuctionDocMarkdown)
    if (location.pathname === '/docs/use-cases') fetchGuide(useCasesDocMarkdown)
    if (location.pathname === '/docs/user-flow') fetchGuide(userFlowDocMarkdown)
    if (location.pathname === '/docs/participate-as-a-bidder')
      fetchGuide(participateAsABidderDocMarkdown)
    if (location.pathname === '/docs/participate-as-auctioneer')
      fetchGuide(participateAsAuctioneerDocMarkdown)
    if (location.pathname === '/docs/faq') fetchGuide(faqDocMarkdown)
  }, [location, fetchGuide])

  return (
    <Wrapper {...restProps}>
      <Title>Gnosis Auction Documentation</Title>
      <Grid>
        <Sidebar>
          <IndexLink activeClassName="isActive" to="/docs">
            Overview
          </IndexLink>
          <IndexLink to="/docs/batch-auctions">How do Batch Auctions work?</IndexLink>
          <IndexLink to="/docs/use-cases">Use Cases</IndexLink>
          <IndexLink to="/docs/user-flow">User flow</IndexLink>
          <IndexLink to="/docs/participate-as-a-bidder">Participate as a bidder</IndexLink>
          <IndexLink to="/docs/participate-as-auctioneer">Participate as auctioneer</IndexLink>
          <IndexLink to="/docs/faq">Faq</IndexLink>
        </Sidebar>
        <Content>
          <ReactMarkdown escapeHtml={false} source={content} />
        </Content>
      </Grid>
    </Wrapper>
  )
}
