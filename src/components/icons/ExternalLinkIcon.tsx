import React from 'react'
import styled from 'styled-components'

const Wrapper = styled.svg`
  display: block;
  max-height: 100%;
  max-width: 100%;

  .fill {
    fill: ${({ theme }) => theme.text1};
  }
`

export const ExternalLinkIcon: React.FC<{ className?: string }> = (props) => (
  <Wrapper
    className={`externalLinkIcon ${props.className}`}
    height="15"
    viewBox="0 0 15 15"
    width="15"
    xmlns="http://www.w3.org/2000/svg"
    {...props}
  >
    <path
      className="fill"
      d="M10.6 3.393l.374-.362a3.518 3.518 0 0 1 5.083 4.862l-.108.113-1.888 1.887a3.519 3.519 0 0 1-4.974 0 3.479 3.479 0 0 1-.362-.425.625.625 0 0 1 1.013-.732 2.171 2.171 0 0 0 .233.273 2.269 2.269 0 0 0 3.11.092l.1-.091 1.886-1.888a2.267 2.267 0 0 0-3.119-3.292l-.1.092-.381.369a.625.625 0 0 1-.922-.84l.053-.057z"
      transform="translate(-3.227 -.75)"
    />
    <path
      className="fill"
      d="M4.917 8.758a3.518 3.518 0 0 1 4.975 0 3.585 3.585 0 0 1 .273.305.625.625 0 1 1-.981.776A2.267 2.267 0 0 0 5.9 9.55l-.1.091-1.886 1.887a2.268 2.268 0 0 0 3.108 3.3l.1-.091.471-.477a.625.625 0 0 1 .941.819l-.052.059-.473.48a3.518 3.518 0 0 1-5.084-4.862l.108-.113 1.885-1.885z"
      transform="translate(-.75 -2.898)"
    />
  </Wrapper>
)
