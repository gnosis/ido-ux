import React, { useCallback, useEffect, useMemo, useState } from 'react'
import { NavLink, useLocation } from 'react-router-dom'
import styled from 'styled-components'

import { isMobile } from 'react-device-detect'
import ReactGA from 'react-ga'

import { GOOGLE_ANALYTICS_ID } from '../../../constants/config'
import { getLogger } from '../../../utils/logger'
import { Button } from '../../buttons/Button'
import { ButtonType } from '../../buttons/buttonStylingTypes'
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
  padding: 0;
  position: relative;
  text-align: center;
  width: ${INNER_WIDTH};
  z-index: 1;

  @media (min-width: ${({ theme }) => theme.themeBreakPoints.md}) {
    padding: 0 20px;
  }
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
  margin-bottom: 10px;
  width: 100%;

  &:last-child {
    margin-bottom: 0;
  }

  @media (min-width: ${({ theme }) => theme.themeBreakPoints.md}) {
    margin-bottom: 0;
    margin-right: 15px;
    max-width: 170px;

    &:last-child {
      margin-right: 0;
    }
  }
`

const VISIBLE_COOKIES_BANNER = 'VISIBLE_COOKIES_BANNER'
const ACCEPT_GOOGLE_ANALYTICS = 'ACCEPT_GOOGLE_ANALYTICS'
const FALSE = 'false'
const TRUE = 'true'

interface Props {
  isVisible: boolean
  onHide?: () => void
}

export const CookiesBanner: React.FC<Props> = (props) => {
  const { isVisible, onHide, ...restProps } = props
  const storage = window.localStorage
  const location = useLocation()

  const isBannerCookieTrue = useMemo(
    () =>
      !storage.getItem(VISIBLE_COOKIES_BANNER) ||
      storage.getItem(VISIBLE_COOKIES_BANNER) === undefined ||
      storage.getItem(VISIBLE_COOKIES_BANNER) === '' ||
      storage.getItem(VISIBLE_COOKIES_BANNER) === TRUE,
    [storage],
  )

  const isGoogleAnalyticsCookieTrue = useMemo(
    () => storage.getItem(ACCEPT_GOOGLE_ANALYTICS) === TRUE,
    [storage],
  )

  const [warningVisible, setWarningVisible] = useState(isBannerCookieTrue || isVisible)
  const [googleAnalyticsAccepted, setGoogleAnalyticsAccepted] = useState(
    isGoogleAnalyticsCookieTrue,
  )

  const showWarning = useCallback(() => {
    setWarningVisible(true)
    storage.setItem(VISIBLE_COOKIES_BANNER, TRUE)
  }, [storage])

  const hideWarning = useCallback(() => {
    setWarningVisible(false)
    storage.setItem(VISIBLE_COOKIES_BANNER, FALSE)

    if (onHide) {
      onHide()
    }
  }, [onHide, storage])

  const acceptGoogleAnalytics = useCallback(() => {
    setGoogleAnalyticsAccepted(true)
    storage.setItem(ACCEPT_GOOGLE_ANALYTICS, TRUE)
  }, [storage])

  const rejectGoogleAnalytics = useCallback(() => {
    setGoogleAnalyticsAccepted(false)
    storage.setItem(ACCEPT_GOOGLE_ANALYTICS, FALSE)
  }, [storage])

  const toggleAcceptGoogleAnalytics = useCallback(() => {
    if (googleAnalyticsAccepted) {
      rejectGoogleAnalytics()
    } else {
      acceptGoogleAnalytics()
    }
  }, [acceptGoogleAnalytics, googleAnalyticsAccepted, rejectGoogleAnalytics])

  const acceptSelected = useCallback(() => {
    hideWarning()
  }, [hideWarning])

  const acceptAll = useCallback(() => {
    acceptGoogleAnalytics()
    hideWarning()
  }, [acceptGoogleAnalytics, hideWarning])

  const loadGoogleAnalytics = useCallback(() => {
    if (!GOOGLE_ANALYTICS_ID) {
      logger.warn(
        'In order to use Google Analytics you need to add a trackingID using the REACT_APP_GOOGLE_ANALYTICS_ID environment variable.',
      )
      return
    }

    if (typeof GOOGLE_ANALYTICS_ID === 'string') {
      ReactGA.initialize(GOOGLE_ANALYTICS_ID, { gaOptions: { cookieDomain: 'auto' } })
      ReactGA.set({
        customBrowserType: !isMobile
          ? 'desktop'
          : 'web3' in window || 'ethereum' in window
          ? 'mobileWeb3'
          : 'mobileRegular',
      })
      ReactGA.set({ anonymizeIp: true })
      ReactGA.set({ page: location.pathname })
      ReactGA.pageview(location.pathname)
    }
  }, [location])

  useEffect(() => {
    googleAnalyticsAccepted && loadGoogleAnalytics()
    isVisible && showWarning()
  }, [googleAnalyticsAccepted, loadGoogleAnalytics, showWarning, isVisible])

  return warningVisible ? (
    <Wrapper {...restProps}>
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
          <ButtonAccept buttonType={ButtonType.primaryInverted} onClick={acceptSelected}>
            Accept Selected
          </ButtonAccept>
          <ButtonAccept onClick={acceptAll}>Accept All</ButtonAccept>
        </ButtonContainer>
      </Content>
    </Wrapper>
  ) : null
}
