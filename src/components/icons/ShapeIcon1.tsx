import React from 'react'
import styled from 'styled-components'

const Wrapper = styled.svg`
  flex-shrink: 0;

  .stroke {
    fill-rule: evenodd;
    stroke: ${({ theme }) => theme.text1};
  }
`

export const ShapeIcon1: React.FC<{ className?: string }> = (props) => {
  return (
    <Wrapper
      className={`shapeIcon1 ${props.className}`}
      height="233.854"
      viewBox="0 0 233.854 233.854"
      width="233.854"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <path
        className="stroke"
        d="M233 233H1v-1l-1 1 1-1V1L0 0l1 1h21l-.818-1L22 1h21l-.636-1L43 1h21l-.454-1L64 1h21l-.273-1L85 1h21l-.091-1L106 1h21l.091-1L127 1h21l.273-1L148 1h21l.454-1L169 1h21l.636-1L190 1h21l.818-1L211 1h21l1-1-1 1h1z"
        fill="none"
        strokeMiterlimit="10"
        transform="translate(.354 .354)"
      />
    </Wrapper>
  )
}
