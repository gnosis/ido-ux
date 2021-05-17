import React from 'react'
import styled from 'styled-components'

const Wrapper = styled.svg`
  flex-shrink: 0;
  .fill {
    fill-rule: evenodd;
    fill: ${({ theme }) => theme.primary1};
  }
`

export const ChartIcon: React.FC<{ className?: string }> = (props) => {
  return (
    <Wrapper
      className={`alertIcon ${props.className}`}
      height="11"
      viewBox="0 0 13.75 11"
      width="13.75"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <path
        className="fill"
        d="M-286.834-179.776H-285v2.75h-1.833zm-2.75-3.666h1.833v6.416h-1.833zm-2.75 1.833h1.833v4.583h-1.833zm-2.75-2.75h1.833v7.333h-1.833zm-.687-1.834a1.143 1.143 0 0 0-1.146 1.146v8.708a1.143 1.143 0 0 0 1.146 1.146h11.458a1.143 1.143 0 0 0 1.146-1.146v-8.708a1.143 1.143 0 0 0-1.146-1.146zm0 .918h11.451a.232.232 0 0 1 .233.233v8.7a.232.232 0 0 1-.233.233h-11.451a.232.232 0 0 1-.233-.233v-8.7a.232.232 0 0 1 .236-.233z"
        transform="translate(296.918 186.193)"
      />
    </Wrapper>
  )
}
