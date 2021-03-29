import React from 'react'
import styled from 'styled-components'

const Wrapper = styled.svg`
  display: block;
  flex-shrink: 0;
  max-height: 100%;
  max-width: 100%;
`

export const IconUnregistered: React.FC<{ className?: string }> = (props) => {
  return (
    <Wrapper
      className={`iconUnregistered ${props.className}`}
      height="68"
      viewBox="0 0 74 74"
      width="68"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <g
        fill="#fff"
        stroke="red"
        strokeMiterlimit="10"
        strokeWidth="3px"
        transform="translate(2.5 7.535) translate(.5 -4.535)"
      >
        <circle cx="34" cy="34" r="34" stroke="none" />
        <circle cx="34" cy="34" fill="none" r="35.5" />
      </g>
      <text
        fill="red"
        fontFamily="Averta-Bold, Averta ☞"
        fontSize="50px"
        fontWeight="700"
        transform="translate(2.5 7.535) translate(34.5 48.465)"
      >
        <tspan x="-11.707" y="0">
          ?
        </tspan>
      </text>
    </Wrapper>
  )
}
