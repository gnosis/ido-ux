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

export const TooltipIcon: React.FC<{ className?: string }> = (props) => (
  <Wrapper
    className={`tooltipIcon ${props.className}`}
    height="14"
    viewBox="0 0 14 14"
    width="14"
    xmlns="http://www.w3.org/2000/svg"
    {...props}
  >
    <path
      className="fill"
      d="M7.833 13.667A5.833 5.833 0 1 0 2 7.833a5.833 5.833 0 0 0 5.833 5.834zm0-1.167A4.667 4.667 0 1 1 12.5 7.833 4.667 4.667 0 0 1 7.833 12.5z"
      id="Path_46"
      transform="translate(-.833 -.833)"
    />
    <path
      className="fill"
      d="M9.609 7.715a.858.858 0 0 1 1.714 0c.005.328-.078.442-.481.736l-.027.02a1.741 1.741 0 0 0-.93 1.688v.115a.583.583 0 0 0 1.167 0v-.145c-.016-.328.054-.426.451-.715l.028-.02a1.821 1.821 0 0 0 .96-1.687 2.024 2.024 0 0 0-4.047.009.583.583 0 0 0 1.167 0zm.909 3.859a.729.729 0 1 1-.729.729.729.729 0 0 1 .728-.728z"
      id="Path_47"
      transform="translate(-3.517 -2.387)"
    />
  </Wrapper>
)
