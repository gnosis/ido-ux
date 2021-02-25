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

export const ChevronRight: React.FC<{ className?: string }> = (props) => (
  <Wrapper
    className={`chevronRight ${props.className}`}
    height="11.999"
    width="7"
    xmlns="http://www.w3.org/2000/svg"
    {...props}
  >
    <path
      className="fill"
      d="M6.71 5.29l-.06-.054L1.707.292A1 1 0 00.293 1.706L4.587 6 .293 10.293a1 1 0 001.414 1.414L6.66 6.756l.05-.047a1.014 1.014 0 000-1.42"
      fillRule="evenodd"
    />
  </Wrapper>
)
