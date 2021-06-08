import React from 'react'
import { Redirect, Route, RouteComponentProps, Switch, withRouter } from 'react-router-dom'
import styled from 'styled-components'

import ScrollArea from 'react-scrollbar'
import ReactTooltip from 'react-tooltip'

import Auction from '../../../pages/Auction'
import { Documentation } from '../../../pages/Documentation'
import { Landing } from '../../../pages/Landing'
import { Licenses } from '../../../pages/Licenses'
import Overview from '../../../pages/Overview'
import { Terms } from '../../../pages/Terms'
import { CookiesBanner } from '../../common/CookiesBanner'
import { TopDisclaimer } from '../../common/TopDisclaimer'
import { Footer } from '../../layout/Footer'
import { Header } from '../../layout/Header'
import Popups from '../../popups/Popups'
import { BaseCard } from '../../pureStyledComponents/BaseCard'
import { InnerContainer } from '../../pureStyledComponents/InnerContainer'
import { MainScroll } from '../../pureStyledComponents/MainScroll'
import { MainWrapper } from '../../pureStyledComponents/MainWrapper'
import Web3ReactManager from '../../web3/Web3ReactManager'

const Inner = styled(InnerContainer)`
  padding-top: 22px;
`

const Routes: React.FC<RouteComponentProps> = (props) => {
  const { history } = props
  const [showCookiesBanner, setShowCookiesBanner] = React.useState(false)
  const [showTopWarning, setShowTopWarning] = React.useState(false)

  const tokenSupport = (bothTokensSupported: boolean) => {
    setShowTopWarning(bothTokensSupported)
  }

  React.useEffect(() => {
    history.listen((location) => {
      if (!location.pathname.includes('/auction')) {
        setShowTopWarning(false)
      }
    })
  }, [history])

  return (
    <MainWrapper>
      <Header />
      <Popups />
      <ReactTooltip
        arrowColor="#001429"
        backgroundColor="#001429"
        border
        borderColor="#174172"
        className="customTooltip"
        delayHide={250}
        delayShow={50}
        effect="solid"
        textColor="#fff"
      />
      {showTopWarning && <TopDisclaimer />}
      <ScrollArea smoothScrolling speed={0.8}>
        <MainScroll>
          <span id="topAnchor" />
          <Inner>
            <Web3ReactManager>
              <Switch>
                <Route
                  exact
                  path="/auction"
                  render={(props) => <Auction showTokenWarning={tokenSupport} {...props} />}
                  strict
                />
                <Route component={Overview} exact path="/overview" strict />
                <Route component={Landing} exact path="/start" strict />
                <Route component={Terms} exact path="/terms-and-conditions" strict />
                <Route component={Licenses} exact path="/licenses" strict />
                <Route component={Documentation} exact path="/docs" strict />
                <Route component={Documentation} exact path="/docs/batch-auctions" strict />
                <Route component={Documentation} exact path="/docs/use-cases" strict />
                <Route component={Documentation} exact path="/docs/user-flow" strict />
                <Route
                  component={Documentation}
                  exact
                  path="/docs/participate-as-a-bidder"
                  strict
                />
                <Route
                  component={Documentation}
                  exact
                  path="/docs/participate-as-auctioneer"
                  strict
                />
                <Route
                  component={Documentation}
                  exact
                  path="/docs/starting-an-auction-with-safe"
                  strict
                />
                <Route
                  component={Documentation}
                  exact
                  path="/docs/Private-Auctions-And-KYC-solutions"
                  strict
                />
                <Route component={Documentation} exact path="/docs/faq" strict />
                <Route exact path="/">
                  <Redirect to="/start" />
                </Route>
                <Route path="*">
                  <BaseCard>Page not found Error 404</BaseCard>
                </Route>
              </Switch>
            </Web3ReactManager>
          </Inner>
          <Footer />
        </MainScroll>
      </ScrollArea>
      <CookiesBanner
        isBannerVisible={showCookiesBanner}
        onHide={() => {
          setShowCookiesBanner(false)
        }}
      />
    </MainWrapper>
  )
}

export default withRouter(Routes)
