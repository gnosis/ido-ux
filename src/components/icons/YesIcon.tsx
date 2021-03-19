import React from 'react'
import styled from 'styled-components'

const Wrapper = styled.svg`
  display: block;
  max-height: 100%;
  max-width: 100%;

  .fill {
    fill: #008c73;
  }
`

export const YesIcon: React.FC<{ className?: string }> = (props) => (
  <Wrapper
    className={`yesIcon ${props.className}`}
    height="16"
    viewBox="0 0 16 16"
    width="16"
    xmlns="http://www.w3.org/2000/svg"
    {...props}
  >
    <path
      className="fill"
      d="M6.666 14.333a.664.664 0 0 1-.471-.2l-4-4a.667.667 0 0 1 .943-.943l3.528 3.531L14.194 5.2a.667.667 0 1 1 .943.943l-8 8a.664.664 0 0 1-.471.2"
      fill=""
      fillRule="evenodd"
      transform="translate(-.667 -1.667)"
    />
  </Wrapper>
)
