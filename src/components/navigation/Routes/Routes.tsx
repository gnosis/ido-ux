import React from 'react'
import { Redirect, Route, RouteComponentProps, Switch, withRouter } from 'react-router-dom'

import { About } from '../../../pages/About'
import Auction from '../../../pages/Auction'
import { Documentation } from '../../../pages/Documentation'
import { Landing } from '../../../pages/Landing'
import { Licenses } from '../../../pages/Licenses'
import { NotAllowed } from '../../../pages/NotAllowed'
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
      {showTopWarning && <TopDisclaimer />}
      <MainScroll>
        <span id="topAnchor" />
        <InnerContainer>
          <Popups />
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
              <Route component={About} exact path="/about" strict />
              <Route component={Documentation} exact path="/docs" strict />
              <Route component={Documentation} exact path="/docs/batch-auctions" strict />
              <Route component={Documentation} exact path="/docs/use-cases" strict />
              <Route component={Documentation} exact path="/docs/user-flow" strict />
              <Route component={Documentation} exact path="/docs/participate-as-a-bidder" strict />
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
  )
}

export default withRouter(Routes)
