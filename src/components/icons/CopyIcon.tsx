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

export const CopyIcon: React.FC<{ className?: string }> = (props) => (
  <Wrapper
    className={`copyIcon ${props.className}`}
    height="14"
    viewBox="0 0 14 14"
    width="14"
    xmlns="http://www.w3.org/2000/svg"
    {...props}
  >
    <path
      className="fill"
      d="M10 9.583h2.333V3.167H7.667v1.75h1.166A1.166 1.166 0 0 1 10 6.083zM6.5 4.917v-1.75A1.166 1.166 0 0 1 7.667 2h4.667A1.166 1.166 0 0 1 13.5 3.167v6.416a1.166 1.166 0 0 1-1.167 1.167H10v1.75a1.166 1.166 0 0 1-1.167 1.167H4.167A1.166 1.166 0 0 1 3 12.5V6.083a1.166 1.166 0 0 1 1.167-1.166zM4.167 6.083V12.5h4.666V6.083z"
      transform="translate(-1.25 -.833)"
    />
  </Wrapper>
)
