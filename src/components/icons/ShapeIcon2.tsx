import React from 'react'
import styled from 'styled-components'

const Wrapper = styled.svg`
  flex-shrink: 0;

  .stroke {
    fill: none;
    fill-rule: evenodd;
    stroke: ${({ theme }) => theme.text1};
  }
`

export const ShapeIcon2: React.FC<{ className?: string }> = (props) => {
  return (
    <Wrapper
      className={`shapeIcon1 ${props.className}`}
      height="250"
      viewBox="0 0 249 250"
      width="249"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <g id="shape-2" transform="translate(.5 .5)">
        <path
          className="stroke"
          d="M100 50A50 50 0 1 1 50 0a50 50 0 0 1 50 50z"
          id="Stroke_1"
          strokeMiterlimit="10"
          transform="translate(74 149)"
        />
        <path
          className="stroke"
          d="M149 74.5A74.5 74.5 0 1 1 74.5 0 74.5 74.5 0 0 1 149 74.5z"
          id="Stroke_3"
          strokeMiterlimit="10"
          transform="translate(49)"
        />
        <path
          className="stroke"
          d="M248 124A124 124 0 1 1 124 0a124 124 0 0 1 124 124z"
          id="Stroke_5"
          strokeMiterlimit="10"
          transform="translate(0 1)"
        />
      </g>
    </Wrapper>
  )
}
