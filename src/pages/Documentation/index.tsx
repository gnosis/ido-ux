import React from 'react'
import { useLocation } from 'react-router-dom'
import styled from 'styled-components'

import ReactMarkdown from 'react-markdown'
import { NavHashLink } from 'react-router-hash-link'

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
  grid-template-columns: 1fr;

  @media (min-width: ${({ theme }) => theme.themeBreakPoints.md}) {
    grid-template-columns: 240px 1fr;
  }
`

const Sidebar = styled.div`
  background-color: ${({ theme }) => theme.mainBackground};
  color: ${({ theme }) => theme.text1};
  display: flex;
  flex-direction: column;
  height: fit-content;
  padding-right: 24px;
  padding-top: 24px;
  position: sticky;
  top: 0;
`

const Content = styled.div`
  color: ${({ theme }) => theme.text1};
  font-size: 16px;
  font-weight: 400;
  line-height: 1.6;
  overflow: auto;
  padding: 24px 24px 0 24px;

  a {
    color: ${({ theme }) => theme.primary1};
    font-size: 14px;
    text-decoration: none;

    &:hover {
      text-decoration: underline;
    }
  }

  h3 {
    font-size: 32px;
    font-weight: 700;
    letter-spacing: 0.2rem;
    line-height: 1.4;
    margin: 0 0 40px;
  }

  h4 {
    font-size: 24px;
    font-weight: 600;
    line-height: 1.4;
    margin: 0 0 16px;
  }

  > ul,
  > ol,
  > p {
    margin: 0 0 36px 0;

    &:last-child {
      margin-bottom: 0;
    }
  }

  > ul,
  > ol {
    padding-left: 20px;
  }

  li {
    margin-bottom: 10px;

    &:last-child {
      margin-bottom: 0;
    }

    p {
      margin: 0;
    }
  }

  > span {
    display: block;
    margin-bottom: 36px;
    width: 100%;

    &:last-child {
      margin-bottom: 0;
    }

    img {
      display: block;
      max-width: 100%;
      margin: 0 auto;
    }
  }

  > pre {
    background-color: rgb(246, 248, 250);
    border-radius: 6px;
    color: rgb(7, 12, 17);
    display: block;
    font-family: ${({ theme }) => theme.fonts.fontFamilyCode};
    font-size: 14px;
    line-height: 1.45;
    margin-bottom: 36px;
    overflow: auto;
    padding: 16px;
    width: 100%;

    &:last-child {
      margin-bottom: 0;
    }
  }
`

const IndexLink = styled(NavHashLink)`
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
          <IndexLink activeClassName="isActive" exact to="/docs#topAnchor">
            Overview
          </IndexLink>
          <IndexLink activeClassName="isActive" to="/docs/batch-auctions#topAnchor">
            How do Batch Auctions work?
          </IndexLink>
          <IndexLink activeClassName="isActive" to="/docs/use-cases#topAnchor">
            Use Cases
          </IndexLink>
          <IndexLink activeClassName="isActive" to="/docs/user-flow#topAnchor">
            User flow
          </IndexLink>
          <IndexLink activeClassName="isActive" to="/docs/participate-as-a-bidder#topAnchor">
            Participate as a bidder
          </IndexLink>
          <IndexLink activeClassName="isActive" to="/docs/participate-as-auctioneer#topAnchor">
            Participate as auctioneer
          </IndexLink>
          <IndexLink activeClassName="isActive" to="/docs/faq#topAnchor">
            Faq
          </IndexLink>
        </Sidebar>
        <Content>
          <ReactMarkdown escapeHtml={false} source={content} />
        </Content>
      </Grid>
    </Wrapper>
  )
}
