import React from 'react'
import styled from 'styled-components'

const Wrapper = styled.svg`
  display: block;
  flex-shrink: 0;
  max-height: 100%;
  max-width: 100%;

  .fill {
    fill: ${({ theme }) => theme.buttonPrimary.color};
  }
`

export const MiniLock: React.FC<{ className?: string }> = (props) => (
  <Wrapper
    className={`miniLock ${props.className}`}
    height="11"
    id="locked"
    viewBox="0 0 11 11"
    width="11"
    xmlns="http://www.w3.org/2000/svg"
    {...props}
  >
    <path
      className="fill"
      d="M10.417 9.79a.459.459 0 0 1-.458.458H5.375a.459.459 0 0 1-.458-.458V6.581a.459.459 0 0 1 .458-.458h4.583a.459.459 0 0 1 .458.458zM7.669 2.916A1.835 1.835 0 0 1 9.5 4.749v.457H5.835v-.457a1.836 1.836 0 0 1 1.834-1.833zm2.75 2.376v-.543a2.75 2.75 0 1 0-5.5 0v.541A1.373 1.373 0 0 0 4 6.581V9.79a1.377 1.377 0 0 0 1.375 1.375h4.583a1.377 1.377 0 0 0 1.375-1.375V6.581a1.372 1.372 0 0 0-.914-1.289z"
      transform="translate(-2.167 -1.083)"
    />
    <path
      className="fill"
      d="M11.875 13.681a.688.688 0 1 0-1.375 0 .678.678 0 0 0 .23.509v.635a.46.46 0 0 0 .92 0v-.638a.684.684 0 0 0 .225-.506"
      transform="translate(-5.688 -7.038)"
    />
  </Wrapper>
)
