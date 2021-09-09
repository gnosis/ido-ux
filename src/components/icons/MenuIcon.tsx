import React from 'react'
import styled from 'styled-components'

const Wrapper = styled.svg`
  .fill {
    fill: ${({ theme }) => theme.text1};
  }
`

export const MenuIcon: React.FC<{ className?: string }> = (props) => (
  <Wrapper
    className={`menuIcon ${props.className}`}
    height="22"
    viewBox="0 0 32 22"
    width="32"
    xmlns="http://www.w3.org/2000/svg"
    {...props}
  >
    <path className="fill" d="M1 2h30a1 1 0 0 0 0-2H1a1 1 0 1 0 0 2z" />
    <path
      className="fill"
      d="M31 7.812H1a1 1 0 1 0 0 2h30a1 1 0 0 0 0-2z"
      transform="translate(0 2.187)"
    />
    <path
      className="fill"
      d="M31 15.625H1a1 1 0 1 0 0 2h30a1 1 0 1 0 0-2z"
      transform="translate(0 4.375)"
    />
  </Wrapper>
)
