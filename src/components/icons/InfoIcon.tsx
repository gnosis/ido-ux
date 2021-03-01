import React from 'react'
import styled from 'styled-components'

const Wrapper = styled.svg`
  display: block;
  max-height: 100%;
  max-width: 100%;

  .fill {
    fill: ${({ theme }) => theme.text1};
  }
`

export const InfoIcon: React.FC<{ className?: string }> = (props) => (
  <Wrapper
    className={`infoIcon ${props.className}`}
    height="60"
    id="info"
    viewBox="0 0 60 60"
    width="60"
    xmlns="http://www.w3.org/2000/svg"
    {...props}
  >
    <rect className="fill" height="20" rx="1" transform="translate(27.5 25)" width="5" />
    <path
      className="fill"
      d="M13.875 5.75a3.125 3.125 0 1 1-3.125 3.125 3.126 3.126 0 0 1 3.125-3.125z"
      transform="translate(16.125 8.625)"
    />
    <path
      className="fill"
      d="M27 52A25 25 0 1 0 2 27a25 25 0 0 0 25 25zm0-5a20 20 0 1 1 20-20 20 20 0 0 1-20 20z"
      transform="translate(3 3)"
    />
  </Wrapper>
)
