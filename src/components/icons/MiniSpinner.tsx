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

export const MiniSpinner: React.FC<{ className?: string }> = (props) => (
  <Wrapper
    className={`miniSpinner ${props.className}`}
    height="8"
    viewBox="0 0 8 8"
    width="8"
    xmlns="http://www.w3.org/2000/svg"
    {...props}
  >
    <path
      className="fill"
      d="M11 15a4 4 0 1 0-4-4.066.4.4 0 0 0 .8.013A3.2 3.2 0 1 1 11 14.2a.4.4 0 1 0 0 .8z"
      transform="translate(-1.458 -1.458) translate(-5.542 -5.542)"
    />
  </Wrapper>
)
