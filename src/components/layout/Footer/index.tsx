import React from 'react'
import styled, { css } from 'styled-components'

import { HashLink } from 'react-router-hash-link'

import { CookiesBanner } from '../../common/CookiesBanner'
import { SettingsIcon } from '../../icons/SettingsIcon'
import { InnerContainer } from '../../pureStyledComponents/InnerContainer'

const Wrapper = styled.footer`
  border-top: solid 1px #002249;
  display: flex;
  height: auto;
  justify-content: center;
  margin-top: auto;
  overflow: visible;
  padding: 25px 0;
  width: 100%;
`

const Inner = styled(InnerContainer)`
  column-gap: 20px;
  display: grid;
  grid-template-columns: 1fr 1fr;
  list-style: none;
  margin: 0;
  padding-bottom: 0;
  padding-left: ${(props) => props.theme.layout.horizontalPadding};
  padding-right: ${(props) => props.theme.layout.horizontalPadding};
  padding-top: 0;
  row-gap: 10px;

  @media (min-width: ${({ theme }) => theme.themeBreakPoints.md}) {
    align-items: center;
    display: flex;
    flex-direction: row;
    flex-grow: 1;
    flex-shrink: 0;
    justify-content: center;
    justify-content: center;
  }
`

const Item = styled.li`
  color: ${({ theme }) => theme.text1};
  margin-right: 30px;
  opacity: 0.8;

  &:hover {
    opacity: 1;
  }

  &:last-child {
    margin-right: 0;
  }
`

const LinkCSS = css`
  color: ${({ theme }) => theme.text1};
  text-decoration: none;

  &:hover {
    color: ${({ theme }) => theme.primary2};
  }
`

const ExternalLink = styled.a`
  ${LinkCSS}
`

const Link = styled(HashLink)`
  ${LinkCSS}
`

const IconWrapper = styled.span`
  cursor: pointer;
  display: inline-block;
  height: 14px;
  margin-left: 6px;
  position: relative;
  width: 14px;
`

const SettingsIconStyled = styled(SettingsIcon)`
  fill: ${({ theme }) => theme.text1};
  height: 11px;
  width: 11px;

  &:hover {
    .fill {
      fill: ${({ theme }) => theme.primary2};
    }
  }
`

export const Footer: React.FC = (props) => {
  const { ...restProps } = props
  const date = new Date()
  const year = date.getFullYear()
  const [showCookiesBanner, setShowCookiesBanner] = React.useState(false)

  return (
    <Wrapper className="siteFooter" {...restProps}>
      <Inner as="ul">
        <Item>
          <ExternalLink href="https://gnosis.io/" rel="noopener noreferrer" target="_blank">
            {`©${year} Gnosis`}
          </ExternalLink>
        </Item>
        <Item>
          <Link to="/terms-and-conditions#topAnchor">Terms</Link>
        </Item>
        <Item>
          <Link to="/privacy-policy#topAnchor">Privacy</Link>
        </Item>
        <Item>
          <Link to="/cookie-policy#topAnchor">Cookies</Link>
          <IconWrapper onClick={() => setShowCookiesBanner(true)}>
            <SettingsIconStyled />
          </IconWrapper>
        </Item>
        <Item>
          <Link to="/licenses#topAnchor">Licenses</Link>
        </Item>
      </Inner>
      <CookiesBanner
        isVisible={showCookiesBanner}
        onHide={() => {
          setShowCookiesBanner(false)
        }}
      />
    </Wrapper>
  )
}
