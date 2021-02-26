import React from 'react'
import styled from 'styled-components'

const Wrapper = styled.svg`
  display: block;
  flex-shrink: 0;
  max-height: 100%;
  max-width: 100%;

  .fill {
    fill: ${({ theme }) => theme.error};
  }
`

export const ErrorInfo: React.FC<{ className?: string }> = (props) => (
  <Wrapper
    className={`errorInfo ${props.className}`}
    height="20"
    viewBox="0 0 20 20"
    width="20"
    xmlns="http://www.w3.org/2000/svg"
    {...props}
  >
    <path
      className="fill"
      d="M11.791 8a.833.833 0 0 1 .833.833v3.333a.833.833 0 0 1-1.667 0V8.835A.833.833 0 0 1 11.791 8m0 6.458a1.042 1.042 0 1 1-1.042 1.042 1.042 1.042 0 0 1 1.042-1.042"
      fillRule="evenodd"
      transform="translate(-1.791 -1.334)"
    />
    <path
      className="fill"
      d="M10.167 2a1.21 1.21 0 0 0-1.067.627L1.156 16.858a1.218 1.218 0 0 0 1.069 1.808h15.883a1.217 1.217 0 0 0 1.069-1.808L11.236 2.627A1.209 1.209 0 0 0 10.167 2m0 2.128l7.187 12.878H2.981l7.186-12.878"
      fillRule="evenodd"
      transform="translate(-.167 -.333)"
    />
  </Wrapper>
)
