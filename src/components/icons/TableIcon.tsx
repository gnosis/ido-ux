import React from 'react'
import styled from 'styled-components'

const Wrapper = styled.svg`
  flex-shrink: 0;
  .fill {
    fill-rule: evenodd;
    fill: ${({ theme }) => theme.primary1};
  }
`

export const TableIcon: React.FC<{ className?: string }> = (props) => {
  return (
    <Wrapper
      className={`alertIcon ${props.className}`}
      height="10.731"
      viewBox="0 0 13.711 10.731"
      width="13.711"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <path
        className="fill"
        d="M360.4 122.946a.6.6 0 0 0-.531.6v9.538a.6.6 0 0 0 .6.6h12.519a.6.6 0 0 0 .6-.6v-9.538a.6.6 0 0 0-.6-.6h-12.519a.6.6 0 0 0-.069 0zm.661 1.192h2.086v2.086h-2.086zm3.279 0h8.048v2.086h-8.048v-2.086zm-3.279 3.279h2.086v5.067h-2.086zm3.279 0h8.048v5.067h-8.048v-5.067z"
        transform="translate(-359.873 -122.945)"
      />
    </Wrapper>
  )
}
