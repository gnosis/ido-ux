import React from 'react'
import styled from 'styled-components'

const Wrapper = styled.svg`
  flex-shrink: 0;

  .fill {
    fill: #ccc;
  }
`

export const ErrorIcon: React.FC<{ className?: string }> = (props) => {
  return (
    <Wrapper
      className={`errorIcon ${props.className}`}
      height="52"
      viewBox="0 0 24 24"
      width="52"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <g fill="none" fillRule="evenodd">
        <path d="M0 0H24V24H0z" />
        <rect className="fill" height="8" rx="1" width="2" x="11" y="6" />
        <path
          className="fill"
          d="M12 15.75c.69 0 1.25.56 1.25 1.25s-.56 1.25-1.25 1.25-1.25-.56-1.25-1.25.56-1.25 1.25-1.25z"
          fillRule="nonzero"
        />
        <path
          className="fill"
          d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10zm0-2c-4.418 0-8-3.582-8-8s3.582-8 8-8 8 3.582 8 8-3.582 8-8 8z"
          fillRule="nonzero"
        />
      </g>
    </Wrapper>
  )
}
