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

export const ChevronDown: React.FC<{ className?: string }> = (props) => (
  <Wrapper
    className={`chevronDown ${props.className}`}
    height="7"
    viewBox="0 0 11.999 7"
    width="11.999"
    xmlns="http://www.w3.org/2000/svg"
    {...props}
  >
    <path
      className="fill"
      d="M6.709 5.29l-.06-.054L1.706.292A1 1 0 0 0 .292 1.706L4.586 6 .292 10.293a1 1 0 0 0 1.414 1.414l4.953-4.951.05-.047a1.014 1.014 0 0 0 0-1.42"
      fillRule="evenodd"
      transform="rotate(90 6 6)"
    />
  </Wrapper>
)
