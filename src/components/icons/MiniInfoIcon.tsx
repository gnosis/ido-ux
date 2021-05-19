import React from 'react'
import styled from 'styled-components'

const Wrapper = styled.svg`
  display: block;
  flex-shrink: 0;
  max-height: 100%;
  max-width: 100%;

  .fill {
    fill: ${({ theme }) => theme.text1};
  }
`

export const MiniInfoIcon: React.FC<{ className?: string }> = (props) => (
  <Wrapper
    className={`miniInfoIcon ${props.className}`}
    height="12"
    viewBox="0 0 12 12"
    width="12"
    xmlns="http://www.w3.org/2000/svg"
    {...props}
  >
    <rect className="fill" height="4" rx=".5" transform="translate(5.5 5)" width="1" />
    <path
      className="fill"
      d="M11.375 5.75a.625.625 0 1 1-.625.625.625.625 0 0 1 .625-.625z"
      transform="translate(-5.375 -2.875)"
    />
    <path
      className="fill"
      d="M7 12a5 5 0 1 0-5-5 5 5 0 0 0 5 5zm0-1a4 4 0 1 1 4-4 4 4 0 0 1-4 4z"
      transform="translate(-1 -1)"
    />
  </Wrapper>
)
