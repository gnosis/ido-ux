import React from 'react'
import styled from 'styled-components'

const Wrapper = styled.svg`
  display: block;
  max-height: 100%;
  max-width: 100%;

  .fill {
    fill: ${({ theme }) => theme.text3};
  }
`

export const InfoIconDark: React.FC<{ className?: string }> = (props) => (
  <Wrapper
    className={`infoIconDark ${props.className}`}
    height="24"
    viewBox="0 0 24 24"
    width="24"
    xmlns="http://www.w3.org/2000/svg"
    {...props}
  >
    <rect className="fill" height="8" rx="1" transform="translate(11 6)" width="2" />
    <path className="fill" d="M12 15.75A1.25 1.25 0 1 1 10.75 17 1.25 1.25 0 0 1 12 15.75z" />
    <path
      className="fill"
      d="M12 22A10 10 0 1 0 2 12a10 10 0 0 0 10 10zm0-2a8 8 0 1 1 8-8 8 8 0 0 1-8 8z"
    />
  </Wrapper>
)
