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

export const ShapeIcon3: React.FC<{ className?: string }> = (props) => {
  return (
    <Wrapper
      className={`shapeIcon1 ${props.className}`}
      height="248"
      viewBox="0 0 248 248"
      width="248"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <g id="shape-3" transform="translate(-527 -907)">
        <path className="stroke" d="M175 0L0 175" id="Stroke_13" transform="translate(564 944)" />
        <path className="stroke" d="M0 0l175 175" id="Stroke_14" transform="translate(563 944)" />
        <path className="stroke" d="M.5 0v248" id="Stroke_15" transform="translate(650 907)" />
        <path className="stroke" d="M0 .5h248" id="Stroke_17" transform="translate(527 1031)" />
      </g>
    </Wrapper>
  )
}
