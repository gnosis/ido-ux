import React from 'react'
import styled, { css } from 'styled-components'

import { SettingsIcon } from '../../icons/SettingsIcon'

const Wrapper = styled.footer`
  &.siteFooter {
    align-items: initial;
    border-radius: 0;
    display: block;
    height: auto;
    margin-top: auto;
    overflow: visible;
    padding: 25px 0;
    width: 100%;
  }
`

const Items = styled.ul`
  &.footerItems {
    align-items: center;
    display: flex;
    flex-direction: column;
    list-style: none;
    margin: 0;
    padding-bottom: 0;
    padding-left: ${(props) => props.theme.layout.horizontalPadding};
    padding-right: ${(props) => props.theme.layout.horizontalPadding};
    padding-top: 0;

    @media (min-width: ${(props) => props.theme.themeBreakPoints.mdPre}) {
      flex-direction: row;
      justify-content: center;
    }
  }
`

const Item = styled.li`
  color: #000;

  &:last-child {
    .break {
      display: none;
    }
  }
`

const LinkCSS = css`
  color: #000;
  text-decoration: none;

  &:hover {
    text-decoration: underline;
  }
`

const ExternalLink = styled.a`
  ${LinkCSS}
`

const Link = styled.a`
  ${LinkCSS}
`

const Break = styled.span`
  @media (min-width: ${(props) => props.theme.themeBreakPoints.mdPre}) {
    margin: 0 6px;

    &:after {
      content: '|';
    }
  }
`

const IconWrapper = styled.span`
  cursor: pointer;
  display: inline-block;
  height: 12px;
  margin-left: 6px;
  position: relative;
  top: -1px;
  width: 12px;
`

const SettingsIconStyled = styled(SettingsIcon)`
  height: 11px;
  width: 11px;

  .fill {
    fill: #000;
  }
`

interface Props {
  onCookiesBannerShow: () => void
}

export const Footer: React.FC<Props> = (props) => {
  const { onCookiesBannerShow, ...restProps } = props
  const date = new Date()
  const year = date.getFullYear()

  return (
    <Wrapper className="siteFooter" {...restProps}>
      <Items className="footerItems">
        <Item>
          <ExternalLink href="https://gnosis.io/" rel="noopener noreferrer" target="_blank">
            {`©${year} Gnosis`}
          </ExternalLink>
          <Break className="break" />
        </Item>
        <Item>
          <Link href="/terms-and-conditions#mainTitle">Terms &amp; Conditions</Link>
          <Break className="break" />
        </Item>
        <Item>
          <Link href="/privacy-policy#mainTitle">Privacy Policy</Link>
          <Break className="break" />
        </Item>
        <Item>
          <Link href="/cookie-policy#mainTitle">Cookie Policy</Link>
          <IconWrapper onClick={onCookiesBannerShow}>
            <SettingsIconStyled />
          </IconWrapper>
          <Break className="break" />
        </Item>
      </Items>
    </Wrapper>
  )
}
