import React from 'react'
import styled from 'styled-components'

const Wrapper = styled.svg`
  .fill {
    fill: ${({ theme }) => theme.textField.colorPlaceholder};
  }
`

export const Magnifier: React.FC<{ className?: string }> = (props) => (
  <Wrapper
    className={`magnifier ${props.className}`}
    height="20"
    viewBox="0 0 20 20"
    width="20"
    xmlns="http://www.w3.org/2000/svg"
    {...props}
  >
    <path
      className="fill"
      d="M3.6 8.4a4.8 4.8 0 1 1 4.8 4.8 4.8 4.8 0 0 1-4.8-4.8m14.164 8.234L13.45 12.32a6.414 6.414 0 1 0-1.132 1.132l4.314 4.314a.8.8 0 0 0 1.131-1.131"
      fillRule="evenodd"
    />
  </Wrapper>
)
