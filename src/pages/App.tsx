import React, { Suspense } from 'react'
import { BrowserRouter, HashRouter, Route, Switch } from 'react-router-dom'

import Popups from '../components/Popups'
import Web3ReactManager from '../components/Web3ReactManager'
import { CookiesBanner } from '../components/common/CookiesBanner'
// import Footer from '../components/Footer'
// import Header from '../components/Header'
import { Footer } from '../components/layout/Footer'
import { Header } from '../components/layout/Header'
import { InnerContainer } from '../components/pureStyledComponents/InnerContainer'
import { MainScroll } from '../components/pureStyledComponents/MainScroll'
import { MainWrapper } from '../components/pureStyledComponents/MainWrapper'
import DarkModeQueryParamReader from '../theme/DarkModeQueryParamReader'
import Auction from './Auction'
import { RedirectPathToSwapOnly } from './Auction/redirects'
import Overview from './Overview'

let Router: React.ComponentType
if (process.env.PUBLIC_URL === '.') {
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
            <InnerContainer>
              <Popups />
              <Web3ReactManager>
                <Switch>
                  <Route component={Auction} exact path="/auction" strict />\
                  <Route component={Overview} exact path="/overview" strict />\
                  <Route component={RedirectPathToSwapOnly} />
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
