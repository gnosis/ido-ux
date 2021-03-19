import React from 'react'
import styled from 'styled-components'

import { ExternalLinkIcon } from '../../icons/ExternalLinkIcon'

const Wrapper = styled.a`
  align-items: center;
  display: flex;
  flex-shrink: 0;
  height: 15px;
  justify-content: center;
  text-decoration: none;
  width: 15px;

  .externalLinkIcon {
    .fill {
      fill: ${({ theme }) => theme.text1};
      transition: fill 0.1s linear;
    }
  }

  &:hover {
    .fill {
      fill: ${({ theme }) => theme.primary1};
    }
  }
`

interface Props {
  href: string
}

export const ExternalLink: React.FC<Props> = (props) => {
  const { href, ...restProps } = props

  return (
    <Wrapper href={href} target="_blank" {...restProps}>
      <ExternalLinkIcon />
    </Wrapper>
  )
}
