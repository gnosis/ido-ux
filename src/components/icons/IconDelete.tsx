import React from 'react'
import styled from 'styled-components'

const Wrapper = styled.svg`
  .fill {
    fill: #ccc;
  }
`

export const IconDelete: React.FC<{ className?: string }> = (props) => (
  <Wrapper
    className={`iconDelete ${props.className}`}
    height="20"
    viewBox="0 0 20 20"
    width="20"
    xmlns="http://www.w3.org/2000/svg"
    {...props}
  >
    <path
      className="fill"
      d="M9.833 16.677a.833.833 0 0 0 .833-.833v-5a.833.833 0 1 0-1.667 0v5a.833.833 0 0 0 .833.833m3.334 0a.833.833 0 0 0 .834-.834v-5a.833.833 0 1 0-1.667 0v5a.833.833 0 0 0 .833.833"
      fillRule="evenodd"
      transform="translate(-1.5 -1.668)"
    />
    <path
      className="fill"
      d="M14.261 16.625a.42.42 0 0 1-.414.377H7.141a.427.427 0 0 1-.395-.382L6.206 7h8.572l-.517 9.625zM8.831 4.181a.521.521 0 0 1 .514-.513h2.307a.515.515 0 0 1 .514.513v1.152H8.831V4.18zm8.336 1.153h-3.335V4.18A2.181 2.181 0 0 0 11.653 2H9.346a2.183 2.183 0 0 0-2.182 2.18v1.153H3.833a.833.833 0 1 0 0 1.667h.7l.544 9.706a2.067 2.067 0 0 0 2.033 1.963h6.759a2.07 2.07 0 0 0 2.052-1.957L16.447 7h.719a.833.833 0 1 0 0-1.667z"
      fillRule="evenodd"
      transform="translate(-.5 -.333)"
    />
  </Wrapper>
)
