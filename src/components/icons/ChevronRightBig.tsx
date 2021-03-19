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

export const ChevronRightBig: React.FC<{ className?: string }> = (props) => (
  <Wrapper
    className={`chevronRightBig ${props.className}`}
    height="20"
    viewBox="0 0 11.667 20"
    width="11.667"
    xmlns="http://www.w3.org/2000/svg"
    {...props}
  >
    <path
      className="fill"
      d="M11.183 11.182l-.1.09-8.239 8.24a1.667 1.667 0 0 1-2.356-2.356L7.645 10 .488 2.843A1.667 1.667 0 0 1 2.844.486L11.1 8.738l.083.078a1.69 1.69 0 0 1 0 2.367"
      fillRule="evenodd"
    />
  </Wrapper>
)
