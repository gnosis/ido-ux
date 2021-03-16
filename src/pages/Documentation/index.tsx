import React from 'react'
import { Link, useLocation } from 'react-router-dom'
import styled from 'styled-components'

import ReactMarkdown from 'react-markdown'

import overviewDocMarkdown from '../../docs/files/devguide01.md'
import batchAuctionDocMarkdown from '../../docs/files/devguide02.md'
import useCasesDocMarkdown from '../../docs/files/devguide03.md'
import userFlowDocMarkdown from '../../docs/files/devguide04.md'
import participateAsABidderDocMarkdown from '../../docs/files/devguide05.md'
import participateAsAuctioneerDocMarkdown from '../../docs/files/devguide06.md'
import faqDocMarkdown from '../../docs/files/devguide07.md'

const Wrapper = styled.div``
const Sidebar = styled.div``
const Content = styled.div``

export const Documentation: React.FC = () => {
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
    <Wrapper>
      <Sidebar>
        <Link to="/docs">Overview</Link>
        <Link to="/docs/batch-auctions">How do Batch Auctions work?</Link>
        <Link to="/docs/use-cases">Use Cases</Link>
        <Link to="/docs/user-flow">User flow</Link>
        <Link to="/docs/participate-as-a-bidder">Participate as a bidder</Link>
        <Link to="/docs/participate-as-auctioneer">Participate as auctioneer</Link>
        <Link to="/docs/faq">Faq</Link>
      </Sidebar>
      <Content>
        <ReactMarkdown escapeHtml={false} source={content} />
      </Content>
    </Wrapper>
  )
}
