import React from 'react'
import styled from 'styled-components'

const Wrapper = styled.svg`
  display: block;
  flex-shrink: 0;

  .fill {
    fill-rule: evenodd;
    fill: ${({ theme }) => theme.primary1};
  }
`

export const DoubleChevronDown: React.FC<{ className?: string }> = (props) => {
  return (
    <Wrapper
      className={`doubleChevronDown ${props.className}`}
      height="8"
      viewBox="0 0 7.384 8"
      width="7.384"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <g id="Button" transform="translate(-154.54 -189.034)">
        <path
          className="fill"
          d="M4.129 3.256l-.037-.033L1.05.18a.615.615 0 0 0-.87.87l2.643 2.643L.18 6.335a.615.615 0 0 0 .87.87L4.1 4.158l.031-.029a.624.624 0 0 0 0-.874"
          transform="rotate(90 -15.402 177.326)"
        />
        <path
          className="fill"
          d="M4.129 3.256l-.037-.033L1.05.18a.615.615 0 0 0-.87.87l2.643 2.643L.18 6.335a.615.615 0 0 0 .87.87L4.1 4.158l.031-.029a.624.624 0 0 0 0-.874"
          transform="rotate(90 -13.555 175.479)"
        />
      </g>
    </Wrapper>
  )
}
