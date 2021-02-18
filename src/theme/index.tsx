import React, { useMemo } from 'react'
import styled, { ThemeProvider as StyledComponentsThemeProvider, css } from 'styled-components'

import { Text, TextProps } from 'rebass'

import { useIsDarkMode } from '../state/user/hooks'
import { Colors } from './styled'

export * from './components'

const MEDIA_WIDTHS = {
  upToExtraSmall: 500,
  upToSmall: 600,
  upToMedium: 960,
  upToLarge: 1280,
}

const mediaWidthTemplates: {
  [width in keyof typeof MEDIA_WIDTHS]: typeof css
} = Object.keys(MEDIA_WIDTHS).reduce((accumulator, size) => {
  ;(accumulator as any)[size] = (a: any, b: any, c: any) => css`
    @media (max-width: ${(MEDIA_WIDTHS as any)[size]}px) {
      ${css(a, b, c)}
    }
  `
  return accumulator
}, {}) as any

export function colors(darkMode: boolean): Colors {
  return {
    // base
    white: '#fff',
    black: '#000',

    // text
    text1: darkMode ? '#FFFFFF' : '#000000',
    text2: darkMode ? '#DCDCDC' : '#565A69',
    text3: darkMode ? '#a9acbb' : '#a9acbb',
    text4: darkMode ? '#565A69' : '#C3C5CB',
    text5: darkMode ? '#2C2F36' : '#EDEEF2',

    // backgrounds / greys
    bg1: darkMode ? '#1E1F2C' : '#FFFFFF',
    bg2: darkMode ? '#2C2D3F' : '#F7F8FA',
    bg3: darkMode ? '#40444f' : '#EDEEF2',
    bg4: darkMode ? '#565A69' : '#CED0D9',
    bg5: darkMode ? '#565A69' : '#888D9B',

    //specialty colors
    modalBG: darkMode ? 'rgba(0,0,0,0.85)' : 'rgba(0,0,0,0.6)',
    advancedBG: darkMode ? '#2B2D3F' : 'rgb(247 248 250)',
    buttonGradient1: '#8958FF',
    buttonGradient2: '#3F77FF',

    //primary colors
    primary1: darkMode ? '#3F77FF' : '#3F77FF',
    primary2: darkMode ? '#3680E7' : '#FF8CC3',
    primary3: darkMode ? '#4D8FEA' : '#FF99C9',
    primary4: darkMode ? '#376bad70' : '#F6DDE8',
    primary5: darkMode ? 'rgba(69,104,255,0.25)' : 'rgba(69,104,255,0.25)',

    // color text
    primaryText1: darkMode ? '#6F9DFF' : '#3F77FF',

    // secondary colors
    secondary1: darkMode ? '#2172E5' : '#3F77FF',
    secondary2: darkMode ? '#17000b26' : '#F6DDE8',
    secondary3: darkMode ? '#17000b26' : 'rgba(69,104,255,0.25)',

    // other
    red1: '#FF6871',
    green1: '#27AE60',
    yellow1: '#FFE270',
    yellow2: '#F3841E',
    blue1: '#3F77FF',
    purple: '#8958FF',
    border: darkMode ? '#3a3b5a' : 'rgb(58 59 90 / 10%)',
    disabled: darkMode ? '#31323e' : 'rgb(237, 238, 242)',
  }
}

export const theme = (darkMode: boolean): any => ({
  ...colors(darkMode),
  fonts: {
    defaultSize: '14px',
    fontFamily: `'Averta', 'Helvetica Neue', 'Arial', 'Segoe UI', 'Oxygen', 'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', '-apple-system', 'BlinkMacSystemFont', sans-serif`,
    fontFamilyCode: `source-code-pro, Menlo, Monaco, Consolas, 'Courier New', monospace`,
  },
  grids: {
    sm: 8,
    md: 12,
    lg: 24,
  },
  shadow1: darkMode ? '#000' : '#2F80ED',
  mediaWidth: mediaWidthTemplates,
  flexColumnNoWrap: css`
    display: flex;
    flex-flow: column nowrap;
  `,
  flexRowNoWrap: css`
    display: flex;
    flex-flow: row nowrap;
  `,
})

export default function ThemeProvider({ children }: { children: React.ReactNode }) {
  const darkMode = useIsDarkMode()

  const themeObject = useMemo(() => theme(darkMode), [darkMode])

  return (
    <StyledComponentsThemeProvider theme={themeObject}>{children}</StyledComponentsThemeProvider>
  )
}

const TextWrapper = styled(Text)<{ color: keyof Colors }>`
  color: ${({ color, theme }) => (theme as any)[color]};
`

export const TYPE = {
  main(props: TextProps) {
    return <TextWrapper color={'text2'} fontWeight={500} {...props} />
  },
  link(props: TextProps) {
    return <TextWrapper color={'primary1'} fontWeight={500} {...props} />
  },
  black(props: TextProps) {
    return <TextWrapper color={'text1'} fontWeight={500} {...props} />
  },
  body(props: TextProps) {
    return <TextWrapper color={'text1'} fontSize={16} fontWeight={400} {...props} />
  },
  largeHeader(props: TextProps) {
    return <TextWrapper fontSize={24} fontWeight={600} {...props} />
  },
  mediumHeader(props: TextProps) {
    return <TextWrapper fontSize={20} fontWeight={500} {...props} />
  },
  subHeader(props: TextProps) {
    return <TextWrapper fontSize={14} fontWeight={400} {...props} />
  },
  blue(props: TextProps) {
    return <TextWrapper color={'primary1'} fontWeight={500} {...props} />
  },
  yellow(props: TextProps) {
    return <TextWrapper color={'yellow1'} fontWeight={500} {...props} />
  },
  darkGray(props: TextProps) {
    return <TextWrapper color={'text3'} fontWeight={500} {...props} />
  },
  gray(props: TextProps) {
    return <TextWrapper color={'bg3'} fontWeight={500} {...props} />
  },
  italic(props: TextProps) {
    return (
      <TextWrapper color={'text2'} fontSize={12} fontStyle={'italic'} fontWeight={500} {...props} />
    )
  },
  error({ error, ...props }: { error: boolean } & TextProps) {
    return <TextWrapper color={error ? 'red1' : 'text2'} fontWeight={500} {...props} />
  },
}
