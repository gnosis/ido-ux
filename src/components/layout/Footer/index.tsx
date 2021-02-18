import React from 'react'
import { NavLink } from 'react-router-dom'
import styled, { css } from 'styled-components'

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
  align-items: center;
  flex-flow: row;
  flex-grow: 1;
  flex-shrink: 0;
  justify-content: center;
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

const Link = styled(NavLink)`
  ${LinkCSS}
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
      <Inner as="ul">
        <Item>
          <ExternalLink href="https://gnosis.io/" rel="noopener noreferrer" target="_blank">
            {`©${year} Gnosis`}
          </ExternalLink>
        </Item>
        <Item>
          <Link to="/terms-and-conditions">Terms</Link>
        </Item>
        <Item>
          <Link to="/privacy-policy">Privacy</Link>
        </Item>
        <Item>
          <Link to="/licenses">Cookies</Link>
          <IconWrapper onClick={onCookiesBannerShow}>
            <SettingsIconStyled />
          </IconWrapper>
        </Item>
        <Item>
          <Link to="/licenses">Licenses</Link>
        </Item>
        <Item>
          <Link to="/imprint">Imprint</Link>
        </Item>
      </Inner>
    </Wrapper>
  )
}
