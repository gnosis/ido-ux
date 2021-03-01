import React from 'react'
import styled from 'styled-components'

const Wrapper = styled.svg`
  display: block;
`

export const Spinner: React.FC = (props) => {
  return (
    <Wrapper
      height="50"
      viewBox="0 0 50 50"
      width="50"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <circle cx="25" cy="25" fill="#e8663d" r="25" />
      <path
        d="M24.708 42.417A17.708 17.708 0 1 0 7 24.418a1.771 1.771 0 0 0 3.542.057 14.167 14.167 0 1 1 14.165 14.4 1.771 1.771 0 1 0 0 3.542z"
        fill="#fff"
        transform="translate(.292 .292)"
      />
    </Wrapper>
  )
}
