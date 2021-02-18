import React from 'react'
import styled from 'styled-components'

import { ButtonCSS, ButtonProps } from '../buttonStylingTypes'

const Wrapper = styled.button<ButtonProps>`
  ${ButtonCSS}
`

export const Button: React.FC<ButtonProps> = (props: ButtonProps) => {
  const { children, ...restProps } = props

  return <Wrapper {...restProps}>{children}</Wrapper>
}
