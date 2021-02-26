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

export const OrderPending: React.FC<{ className?: string }> = (props) => (
  <Wrapper
    className={`orderPending ${props.className}`}
    height="16"
    id="awaiting-confirmations"
    viewBox="0 0 16 16"
    width="16"
    xmlns="http://www.w3.org/2000/svg"
    {...props}
  >
    <path
      className="fill"
      d="M8.663 12.007a.667.667 0 0 1-.371-1.221L10 9.648V6.681a.667.667 0 1 1 1.333 0V10a.667.667 0 0 1-.3.555l-2 1.336a.668.668 0 0 1-.369.112"
      transform="translate(-2.665 -2.005)"
    />
    <path
      className="fill"
      d="M8.667 3.333A5.333 5.333 0 1 0 14 8.667a5.34 5.34 0 0 0-5.333-5.334m0 12a6.667 6.667 0 1 1 6.667-6.667 6.674 6.674 0 0 1-6.667 6.667"
      transform="translate(-.667 -.667)"
    />
  </Wrapper>
)
