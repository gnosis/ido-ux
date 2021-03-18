import React, { Suspense } from 'react'
import { BrowserRouter, HashRouter, Redirect, Route, Switch } from 'react-router-dom'

import Popups from '../components/Popups'
import Web3ReactManager from '../components/Web3ReactManager'
import { CookiesBanner } from '../components/common/CookiesBanner'
import { Footer } from '../components/layout/Footer'
import { Header } from '../components/layout/Header'
import { BaseCard } from '../components/pureStyledComponents/BaseCard'
import { InnerContainer } from '../components/pureStyledComponents/InnerContainer'
import { MainScroll } from '../components/pureStyledComponents/MainScroll'
import { MainWrapper } from '../components/pureStyledComponents/MainWrapper'
import { PUBLIC_URL } from '../constants/config'
import DarkModeQueryParamReader from '../theme/DarkModeQueryParamReader'
import { About } from './About'
import Auction from './Auction'
import { Cookies } from './Cookies'
import { Documentation } from './Documentation'
import { Imprint } from './Imprint'
import { Landing } from './Landing'
import { Licenses } from './Licenses'
import { NotAllowed } from './NotAllowed'
import Overview from './Overview'
import { Privacy } from './Privacy'
import { Terms } from './Terms'

let Router: React.ComponentType
if (PUBLIC_URL === '.') {
  Router = HashRouter
} else {
  Router = BrowserRouter
}

export default function App() {
  const [showCookiesBanner, setShowCookiesBanner] = React.useState(false)

  return (
    <Suspense fallback={null}>
      <Router>
        <Route component={DarkModeQueryParamReader} />
        <MainWrapper>
          <Header />
          <MainScroll>
            <span id="topAnchor" />
            <InnerContainer>
              <Popups />
              <Web3ReactManager>
                <Switch>
                  <Route component={Auction} exact path="/auction" strict />
                  <Route component={Overview} exact path="/overview" strict />
                  <Route component={Landing} exact path="/start" strict />
                  <Route component={Terms} exact path="/terms-and-conditions" strict />
                  <Route component={Privacy} exact path="/privacy-policy" strict />
                  <Route component={Cookies} exact path="/cookie-policy" strict />
                  <Route component={Licenses} exact path="/licenses" strict />
                  <Route component={About} exact path="/about" strict />
                  <Route component={Imprint} exact path="/imprint" strict />
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
                  <Route component={Documentation} exact path="/docs/faq" strict />
                  <Route component={NotAllowed} exact path="/not-allowed" strict />

                  <Route exact path="/">
                    <Redirect to="/start" />
                  </Route>
                  <Route path="*">
                    <BaseCard>Page not found Error 404</BaseCard>
                  </Route>
                </Switch>
              </Web3ReactManager>
            </InnerContainer>
            <Footer
              onCookiesBannerShow={() => {
                setShowCookiesBanner(true)
              }}
            />
          </MainScroll>
          <CookiesBanner
            isBannerVisible={showCookiesBanner}
            onHide={() => {
              setShowCookiesBanner(false)
            }}
          />
        </MainWrapper>
      </Router>
    </Suspense>
  )
}
