import React from 'react'
import styled from 'styled-components'

const Wrapper = styled.svg`
  .fill {
    fill: #fff;
  }
`

export const SendIcon: React.FC<{ className?: string }> = (props) => (
  <Wrapper
    className={`sendIcon ${props.className}`}
    height="20"
    viewBox="0 0 20 20"
    width="20"
    xmlns="http://www.w3.org/2000/svg"
    {...props}
  >
    <path
      className="fill"
      d="M.327 5.872c-.435-.145-.439-.379.008-.528L16.241.042c.441-.147.693.1.57.532l-4.545 15.905c-.125.441-.379.456-.566.038l-2.995-6.74 5-6.667-6.667 5z"
      transform="translate(1.295 1.89)"
    />
  </Wrapper>
)
