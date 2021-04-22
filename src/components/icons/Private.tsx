import React from 'react'
import styled from 'styled-components'

const Wrapper = styled.svg`
  display: block;
  max-height: 100%;
  max-width: 100%;
  zoom: 1.2;

  .fill {
    fill-rule: evenodd;
    fill: ${({ theme }) => theme.text1};
  }
`

export const Private: React.FC<{ className?: string }> = (props) => (
  <Wrapper
    className={`private ${props.className}`}
    height="16"
    viewBox="0 0 16 16"
    width="16"
    xmlns="http://www.w3.org/2000/svg"
    {...props}
  >
    <path
      className="fill"
      d="M13.333 13.331a.667.667 0 0 1-.667.667H6a.667.667 0 0 1-.667-.667V8.664A.667.667 0 0 1 6 8h6.667a.667.667 0 0 1 .667.667zm-4-10A2.67 2.67 0 0 1 12 6v.665H6.669V6a2.67 2.67 0 0 1 2.667-2.668zm4 3.455V6a4 4 0 1 0-8 0v.787A2 2 0 0 0 4 8.664v4.667a2 2 0 0 0 2 2h6.667a2 2 0 0 0 2-2V8.664a2 2 0 0 0-1.331-1.876z"
      transform="translate(-1.333 -.666)"
    />
    <path
      className="fill"
      d="M12.5 13.994a1 1 0 0 0-2 0 .986.986 0 0 0 .335.74v.924a.669.669 0 0 0 1.338 0v-.928a1 1 0 0 0 .327-.736"
      transform="translate(-3.5 -4.331)"
    />
  </Wrapper>
)
