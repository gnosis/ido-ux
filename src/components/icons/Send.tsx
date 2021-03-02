import React from 'react'
import styled from 'styled-components'

const Wrapper = styled.svg`
  .fill {
    fill: ${({ theme }) => theme.buttonPrimary.color};
  }
`

export const Send: React.FC<{ className?: string }> = (props) => (
  <Wrapper
    className={`send ${props.className}`}
    height="24"
    viewBox="0 0 24 24"
    width="24"
    xmlns="http://www.w3.org/2000/svg"
    {...props}
  >
    <path
      className="fill"
      d="M.392 7.047c-.522-.174-.527-.455.01-.634L19.489.051c.529-.176.832.12.684.638l-5.454 19.086c-.15.529-.455.547-.679.045l-3.594-8.088 6-8-8 6z"
      transform="translate(1.554 2.268)"
    />
  </Wrapper>
)
