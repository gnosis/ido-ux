import React from 'react'
import styled from 'styled-components'

const Wrapper = styled.svg`
  .fill {
    fill: #ccc;
  }
`

export const CloseIcon: React.FC<{ className?: string }> = (props) => (
  <Wrapper
    className={`closeIcon ${props.className}`}
    height="20"
    viewBox="0 0 20 20"
    width="20"
    xmlns="http://www.w3.org/2000/svg"
    {...props}
  >
    <path d="M0 0h20v20H0z" fill="none" fillRule="evenodd" />
    <path
      className="fill"
      d="M11.13 10l6.633 6.632a.8.8 0 0 1-1.132 1.131L10 11.13l-6.635 6.632a.8.8 0 0 1-1.132-1.132L8.866 10 2.233 3.365a.8.8 0 0 1 1.132-1.132L10 8.866l6.633-6.633a.8.8 0 0 1 1.132 1.132L11.13 10z"
      fillRule="evenodd"
    />
  </Wrapper>
)
