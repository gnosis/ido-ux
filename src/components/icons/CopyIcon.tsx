import React from 'react'
import styled from 'styled-components'

const Wrapper = styled.svg`
  display: block;

  .fill {
    fill: #ccc;
  }
`

export const CopyIcon: React.FC<{ className?: string }> = (props) => (
  <Wrapper
    className={`copyIcon ${props.className}`}
    height="15"
    viewBox="0 0 13 15"
    width="13"
    xmlns="http://www.w3.org/2000/svg"
    {...props}
  >
    <path
      className="fill"
      d="M14 13h2V6h-5v2h2a1 1 0 0 1 1 1zM9 8V5a1 1 0 0 1 1-1h7a1 1 0 0 1 1 1v9a1 1 0 0 1-1 1h-3v3a1 1 0 0 1-1 1H6a1 1 0 0 1-1-1V9a1 1 0 0 1 1-1zm-2 2v7h5v-7z"
      transform="translate(-5 -4)"
    />
  </Wrapper>
)
