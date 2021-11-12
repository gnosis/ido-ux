import React, { useCallback, useEffect, useState } from 'react'
import { NavLink, useLocation } from 'react-router-dom'
import styled from 'styled-components'

import { isMobile } from 'react-device-detect'
import { initialize, pageview, set } from 'react-ga'

import { GOOGLE_ANALYTICS_ID } from '../../../constants/config'
import { getLogger } from '../../../utils/logger'
import { Button } from '../../buttons/Button'
import { CloseIcon } from '../../icons/CloseIcon'
import { Checkbox } from '../../pureStyledComponents/Checkbox'

const logger = getLogger('CookiesBanner')

const INNER_WIDTH = '840px'

const Wrapper = styled.div`
  background-color: ${({ theme }) => theme.mainBackground};
  bottom: 0;
  box-shadow: 0 -20px 24px 0 #002249;
  display: flex;
  justify-content: center;
  left: 0;
  min-height: 160px;
  padding: 20px;
  position: fixed;
  width: 100%;
  z-index: 123;
`

const Content = styled.div`
  max-width: 100%;
  position: relative;
  width: ${(props) => props.theme.layout.maxWidth};
`

const Text = styled.p`
  color: ${({ theme }) => theme.text1};
  font-size: 17px;
  font-weight: normal;
  line-height: 1.4;
  margin: 0 auto 20px;
  max-width: 100%;
  padding: 0 20px;
  position: relative;
  text-align: center;
  width: ${INNER_WIDTH};
  z-index: 1;
`

const Link = styled(NavLink)`
  color: ${({ theme }) => theme.text1};
  text-decoration: underline;

  &:hover {
    text-decoration: none;
  }
`

const ButtonContainer = styled.div`
  display: block;
  position: relative;

  @media (min-width: ${({ theme }) => theme.themeBreakPoints.md}) {
    align-items: center;
    display: flex;
    justify-content: center;
  }
`

const Labels = styled.div`
  align-items: center;
  display: flex;
  margin-bottom: 30px;

  @media (min-width: ${({ theme }) => theme.themeBreakPoints.md}) {
    margin-bottom: 0;
  }
`

const Label = styled.div<{ clickable?: boolean }>`
  align-items: center;
  color: ${({ theme }) => theme.text1};
  display: flex;
  font-size: 17px;
  font-weight: normal;
  line-height: 1.4;
  margin: 0 25px 0 0;

  &:last-child {
    margin-right: 80px;
  }

  ${(props) => props.clickable && 'cursor: pointer'}
`

Label.defaultProps = {
  clickable: false,
}

const CheckboxStyled = styled(Checkbox)`
  margin: 0 10px 0 0;
`

const ButtonAccept = styled(Button)`
  font-size: 18px;
  height: 36px;
  width: 100%;

  @media (min-width: ${({ theme }) => theme.themeBreakPoints.md}) {
    max-width: 170px;
  }
`

const ButtonClose = styled.button`
  align-items: center;
  background-color: transparent;
  border: none;
  cursor: pointer;
  display: flex;
  justify-content: center;
  outline: none;
  padding: 0;
  position: absolute;
  right: 0;
  top: 0;
  transition: all 0.15s linear;
  z-index: 5;

  &:hover {
    opacity: 0.5;
  }
`

const VISIBLE_COOKIES_BANNER = 'VISIBLE_COOKIES_BANNER'
const COOKIES_FALSE = 'false'
const ACCEPT_GOOGLE_ANALYTICS = 'ACCEPT_GOOGLE_ANALYTICS'

interface Props {
  isBannerVisible: boolean
  onHide: () => void
}

export const CookiesBanner: React.FC<Props> = (props) => {
  const { isBannerVisible, onHide } = props
  const storage = window.localStorage

  const isCookiesBannerVisible = useCallback(
    () => !(storage.getItem(VISIBLE_COOKIES_BANNER) === COOKIES_FALSE),
    [storage],
  )

  const location = useLocation()
  const [cookiesWarningVisible, setCookiesWarningVisible] = useState(isCookiesBannerVisible())

  const showCookiesWarning = useCallback(() => {
    setCookiesWarningVisible(true)
    storage.setItem(VISIBLE_COOKIES_BANNER, '')
  }, [storage])

  const isGoogleAnalyticsAccepted = useCallback(
    () => storage.getItem(ACCEPT_GOOGLE_ANALYTICS) === ACCEPT_GOOGLE_ANALYTICS,
    [storage],
  )

  const hideCookiesWarning = useCallback(() => {
    setCookiesWarningVisible(false)
    storage.setItem(VISIBLE_COOKIES_BANNER, COOKIES_FALSE)
    onHide()
    if (!isGoogleAnalyticsAccepted()) {
      setGoogleAnalyticsAccepted(false)
    }
  }, [isGoogleAnalyticsAccepted, onHide, storage])

  const [googleAnalyticsAccepted, setGoogleAnalyticsAccepted] = useState(
    isGoogleAnalyticsAccepted(),
  )

  const acceptGoogleAnalytics = useCallback(() => {
    setGoogleAnalyticsAccepted(true)
    storage.setItem(ACCEPT_GOOGLE_ANALYTICS, ACCEPT_GOOGLE_ANALYTICS)
  }, [storage])

  const rejectGoogleAnalytics = useCallback(() => {
    setGoogleAnalyticsAccepted(false)
    storage.setItem(ACCEPT_GOOGLE_ANALYTICS, '')
  }, [storage])

  const toggleAcceptGoogleAnalytics = useCallback(() => {
    if (googleAnalyticsAccepted) {
      rejectGoogleAnalytics()
    } else {
      setGoogleAnalyticsAccepted(true)
    }
  }, [googleAnalyticsAccepted, rejectGoogleAnalytics])

  const acceptAll = useCallback(() => {
    acceptGoogleAnalytics()
    hideCookiesWarning()
  }, [acceptGoogleAnalytics, hideCookiesWarning])

  const loadGoogleAnalytics = useCallback(() => {
    if (!GOOGLE_ANALYTICS_ID) {
      logger.warn(
        'In order to use Google Analytics you need to add a trackingID using the REACT_APP_GOOGLE_ANALYTICS_ID environment variable.',
      )
      return
    }

    if (typeof GOOGLE_ANALYTICS_ID === 'string') {
      initialize(GOOGLE_ANALYTICS_ID, { gaOptions: { cookieDomain: 'auto' } })
      set({
        customBrowserType: !isMobile
          ? 'desktop'
          : 'web3' in window || 'ethereum' in window
          ? 'mobileWeb3'
          : 'mobileRegular',
      })
      set({ anonymizeIp: true })
      set({ page: location.pathname })
      pageview(location.pathname)
    }
  }, [location])

  useEffect(() => {
    if (googleAnalyticsAccepted) {
      loadGoogleAnalytics()
    }
    if (isBannerVisible) {
      showCookiesWarning()
    }
  }, [googleAnalyticsAccepted, isBannerVisible, loadGoogleAnalytics, showCookiesWarning])

  //Removing cookies banner for now
  return null
  return cookiesWarningVisible ? (
    <Wrapper>
      <Content>
        <Text>
          We use cookies to give you the best experience and to help improve our website. Please
          read our <Link to={'/cookie-policy'}>Cookie Policy</Link> for more information. By
          clicking <strong>&quot;Accept All&quot;</strong>, you agree to the storing of cookies on
          your device to enhance site navigation, analyze site usage and provide customer support.
        </Text>
        <ButtonContainer className="buttonContainer">
          <Labels>
            <Label>
              <CheckboxStyled checked disabled /> Necessary
            </Label>
            <Label clickable onClick={toggleAcceptGoogleAnalytics}>
              <CheckboxStyled checked={googleAnalyticsAccepted} /> Analytics
            </Label>
          </Labels>
          <ButtonAccept className="buttonAccept" onClick={acceptAll}>
            Accept All
          </ButtonAccept>
        </ButtonContainer>
        <ButtonClose onClick={hideCookiesWarning}>
          <CloseIcon />
        </ButtonClose>
      </Content>
    </Wrapper>
  ) : null
}
