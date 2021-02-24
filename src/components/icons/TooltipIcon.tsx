import React from 'react'
import styled from 'styled-components'

const Wrapper = styled.svg`
  .fill {
    fill: #ccc;
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
      d="M7 14a7 7 0 10-7-7 7 7 0 007 7zm1.467-7.056a2.367 2.367 0 00-.987 1.887H6.348a2.852 2.852 0 011.131-2.452 1.637 1.637 0 00.74-1.279 1.028 1.028 0 00-1.1-1.128 1.076 1.076 0 00-1.124 1.177H4.752a2.146 2.146 0 012.367-2.2A2.076 2.076 0 019.43 5.105a2.288 2.288 0 01-.963 1.839zm-.717 3.543a.83.83 0 11-.826-.822.81.81 0 01.826.822z"
    />
  </Wrapper>
)
