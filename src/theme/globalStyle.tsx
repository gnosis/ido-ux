import { createGlobalStyle } from 'styled-components'

import { reactTooltipCSS } from './reactTooltipCSS'
import { walletConnectModalCSS } from './walletConnectModalCSS'

export const GlobalStyle = createGlobalStyle<{ theme: any }>`

  html body {
    -moz-osx-font-smoothing: grayscale;
    -webkit-font-smoothing: antialiased;
    font-family: ${(props) => props.theme.fonts.fontFamily};
    font-size: ${(props) => props.theme.fonts.defaultSize};
  }

  code {
    font-family: ${(props) => props.theme.fonts.fontFamilyCode};
  }

  body,
  html,
  #root {
    height: 100vh;
  }

  ${reactTooltipCSS}
  ${walletConnectModalCSS}
`

export const ThemedGlobalStyle = createGlobalStyle`
  html {
    color: ${({ theme }) => theme.text4};
    background-color: ${({ theme }) => theme.mainBackground};
  }
`
