import React from 'react'
import styled from 'styled-components'

const Wrapper = styled.svg`
  .fill {
    fill: #ccc;
  }
`

export const IconOk: React.FC<{ className?: string }> = (props) => (
  <Wrapper
    className={`iconOk ${props.className}`}
    height="20"
    viewBox="0 0 24 24"
    width="20"
    xmlns="http://www.w3.org/2000/svg"
    {...props}
  >
    <g fill="none" fillRule="evenodd">
      <path
        className="fill"
        d="M8.999 19c-.266 0-.52-.105-.707-.293l-5.999-6.003c-.391-.391-.391-1.024 0-1.414.391-.391 1.023-.391 1.414 0l5.292 5.296L20.291 5.293c.391-.391 1.023-.391 1.414 0s.391 1.023 0 1.414l-11.999 12c-.187.188-.441.293-.707.293"
      />
    </g>
  </Wrapper>
)
