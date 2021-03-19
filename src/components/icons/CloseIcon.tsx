import React from 'react'
import styled from 'styled-components'

const Wrapper = styled.svg`
  .fill {
    fill: ${({ theme }) => theme.text1};
  }
`

export const CloseIcon: React.FC<{ className?: string }> = (props) => (
  <Wrapper
    className={`closeIcon ${props.className}`}
    height="24"
    viewBox="0 0 24 24"
    width="24"
    xmlns="http://www.w3.org/2000/svg"
    {...props}
  >
    <path
      className="fill"
      d="M13.413 12l8.287 8.289a1 1 0 0 1-1.411 1.411L12 13.413 3.706 21.7a1 1 0 0 1-1.415-1.414L10.583 12 2.291 3.706a1 1 0 0 1 1.415-1.415L12 10.583l8.291-8.292A1 1 0 1 1 21.7 3.706L13.413 12z"
      fillRule="evenodd"
    />
  </Wrapper>
)
