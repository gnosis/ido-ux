import React from 'react'
import styled from 'styled-components'

const Wrapper = styled.svg`
  .fill {
    fill: #ccc;
  }
`

export const ClearSearch: React.FC<{ className?: string }> = (props) => (
  <Wrapper
    className={`clearSearch ${props.className}`}
    height="12"
    viewBox="0 0 12 12"
    width="12"
    xmlns="http://www.w3.org/2000/svg"
    {...props}
  >
    <path
      className="fill"
      d="M6.678 6l3.98 3.979a.48.48 0 01-.679.679L6 6.678l-3.98 3.979a.48.48 0 01-.679-.679L5.319 6l-3.98-3.98a.48.48 0 01.679-.679L6 5.319l3.98-3.98a.48.48 0 11.679.679L6.678 6z"
      fillRule="evenodd"
    />
  </Wrapper>
)
