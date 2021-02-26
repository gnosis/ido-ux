import React from 'react'
import styled from 'styled-components'

const Wrapper = styled.svg`
  display: block;
  flex-shrink: 0;
  max-height: 100%;
  max-width: 100%;

  .fill {
    fill: ${({ theme }) => theme.error};
  }
`

export const ErrorLock: React.FC<{ className?: string }> = (props) => (
  <Wrapper
    className={`errorLock ${props.className}`}
    height="20"
    viewBox="0 0 20 20"
    width="20"
    xmlns="http://www.w3.org/2000/svg"
    {...props}
  >
    <path
      className="fill"
      d="M15.667 16.164a.834.834 0 0 1-.833.833H6.5a.834.834 0 0 1-.833-.833v-5.833A.834.834 0 0 1 6.5 9.5h8.333a.834.834 0 0 1 .833.833zm-5-12.5A3.337 3.337 0 0 1 14 7v.831H7.337V7a3.337 3.337 0 0 1 3.333-3.334zm5 4.319V7a5 5 0 1 0-10 0v.983A2.5 2.5 0 0 0 4 10.331v5.833a2.5 2.5 0 0 0 2.5 2.5h8.333a2.5 2.5 0 0 0 2.5-2.5v-5.833a2.5 2.5 0 0 0-1.663-2.345z"
      fillRule="evenodd"
      transform="translate(-.667 -.333)"
    />
    <path
      className="fill"
      d="M13 14.244a1.25 1.25 0 0 0-2.5 0 1.233 1.233 0 0 0 .418.925v1.155a.836.836 0 0 0 1.673 0v-1.16a1.244 1.244 0 0 0 .409-.92"
      fillRule="evenodd"
      transform="translate(-1.75 -2.166)"
    />
  </Wrapper>
)
