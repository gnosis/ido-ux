import React from 'react'
import styled from 'styled-components'

const Wrapper = styled.svg`
  .fill {
    fill: ${({ theme }) => theme.text1};
  }
`

export const Delete: React.FC<{ className?: string }> = (props) => (
  <Wrapper
    className={`delete ${props.className}`}
    height="12"
    viewBox="0 0 12 12"
    width="12"
    xmlns="http://www.w3.org/2000/svg"
    {...props}
  >
    <path
      className="fill"
      d="M7.478 6.8l3.98 3.979a.48.48 0 0 1-.679.679L6.8 7.478l-3.98 3.979a.48.48 0 0 1-.679-.679L6.119 6.8l-3.98-3.98a.48.48 0 0 1 .679-.679L6.8 6.119l3.98-3.98a.48.48 0 1 1 .679.679L7.478 6.8z"
      fillRule="evenodd"
      transform="translate(-.8 -.8)"
    />
  </Wrapper>
)
