import React from 'react'
import styled from 'styled-components'

const Wrapper = styled.svg`
  .fill {
    fill: ${({ theme }) => theme.primary1};
  }
`

export const ArrowUp: React.FC<{ className?: string }> = (props) => (
  <Wrapper
    className={`arrowUp ${props.className}`}
    height="78"
    viewBox="0 0 78 78"
    width="78"
    xmlns="http://www.w3.org/2000/svg"
    {...props}
  >
    <path
      className="fill"
      d="M34.5 67A32.5 32.5 0 1 0 2 34.5 32.5 32.5 0 0 0 34.5 67zm0-6.5a26 26 0 1 1 26-26 26 26 0 0 1-26 26z"
      transform="translate(4.5 4.5)"
    />
    <path
      className="fill"
      d="M33.934 24.5l-7.442-7.443v24.658a3.25 3.25 0 1 1-6.5 0V17.057L12.546 24.5a3.25 3.25 0 0 1-4.6-4.6L20.944 6.914a2.939 2.939 0 0 1 .65-.432 3.621 3.621 0 0 1 .4-.26 2.042 2.042 0 0 1 .423-.094 3.234 3.234 0 0 1 2.08.091 3.316 3.316 0 0 1 .383.26 2.883 2.883 0 0 1 .663.435L38.529 19.9a3.25 3.25 0 0 1-4.6 4.6z"
      fillRule="evenodd"
      transform="translate(15.749 13.499)"
    />
  </Wrapper>
)
