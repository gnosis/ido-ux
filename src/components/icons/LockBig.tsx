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

export const LockBig: React.FC<{ className?: string }> = (props) => (
  <Wrapper
    className={`lockBig ${props.className}`}
    height="60"
    viewBox="0 0 60 60"
    width="60"
    xmlns="http://www.w3.org/2000/svg"
    {...props}
  >
    <path
      className="fill"
      d="M39 44.494a2.5 2.5 0 0 1-2.5 2.5h-25a2.5 2.5 0 0 1-2.5-2.5v-17.5a2.5 2.5 0 0 1 2.5-2.5h25a2.5 2.5 0 0 1 2.5 2.5zM24.01 7a10.012 10.012 0 0 1 10 10v2.493h-20V17a10.012 10.012 0 0 1 10-10zm15 12.957V17a15 15 0 1 0-30 0v2.95A7.49 7.49 0 0 0 4 26.994v17.5a7.509 7.509 0 0 0 7.5 7.5h25a7.509 7.509 0 0 0 7.5-7.5v-17.5a7.484 7.484 0 0 0-4.99-7.035z"
      fillRule="evenodd"
      transform="translate(6 2.998)"
    />
    <path
      className="fill"
      d="M18 16.744a3.75 3.75 0 0 0-7.5 0 3.7 3.7 0 0 0 1.255 2.775v3.465a2.509 2.509 0 0 0 5.017 0V19.5A3.733 3.733 0 0 0 18 16.744"
      fillRule="evenodd"
      transform="translate(15.75 19.491)"
    />
  </Wrapper>
)
