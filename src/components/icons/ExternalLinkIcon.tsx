import React from 'react'
import styled from 'styled-components'

const Wrapper = styled.svg`
  display: block;

  .fill {
    fill: #ccc;
  }
`

export const ExternalLinkIcon: React.FC<{ className?: string }> = (props) => (
  <Wrapper
    className={`externalLinkIcon ${props.className}`}
    height="15"
    viewBox="0 0 768 1024"
    width="15"
    xmlns="http://www.w3.org/2000/svg"
    {...props}
  >
    <path
      className="fill"
      d="M640 768H128V257.90599999999995L256 256V128H0v768h768V576H640V768zM384 128l128 128L320 448l128 128 192-192 128 128V128H384z"
    />
  </Wrapper>
)
