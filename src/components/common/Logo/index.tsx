import React from 'react'
import styled from 'styled-components'

const Wrapper = styled.span`
  align-items: center;
  display: flex;
`

const LogoSVG = styled.svg``

export const Logo: React.FC = (props) => {
  return (
    <Wrapper {...props}>
      <LogoSVG height="33" viewBox="0 0 205.5 33" width="205.5" xmlns="http://www.w3.org/2000/svg">
        <text
          fill="#fff"
          fontFamily="Averta-ExtraBold"
          fontSize="24px"
          fontWeight="800"
          transform="translate(40.5 24)"
        >
          <tspan x="0" y="0">
            Gnosis Auction
          </tspan>
        </text>
        <path
          d="M17 3a15 15 0 0 1 10.607 25.607A14.9 14.9 0 0 1 17 33zm-2 27A15 15 0 0 1 4.394 4.394 14.9 14.9 0 0 1 15 0v30z"
          fill="#fff"
        />
      </LogoSVG>
    </Wrapper>
  )
}
