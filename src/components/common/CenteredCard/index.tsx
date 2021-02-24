import React from 'react'
import styled from 'styled-components'

import { BaseCard } from '../../pureStyledComponents/BaseCard'

const Wrapper = styled(BaseCard)`
  margin-left: auto;
  margin-right: auto;
  max-width: 100%;
  position: relative;
  width: ${(props) => props.theme.layout.commonContainerMaxWidth};
`

const DropdownContainer = styled.span`
  position: absolute;
  right: ${(props) => props.theme.cards.paddingHorizontal};
  top: ${(props) => props.theme.cards.paddingHorizontal};
  z-index: 5;
`

interface FormCardProps {
  children: React.ReactNode
  dropdown?: React.ReactNode
}

export const CenteredCard: React.FC<FormCardProps> = (props) => {
  const { children, dropdown, ...restProps } = props

  return (
    <Wrapper {...restProps}>
      <>
        {dropdown && <DropdownContainer>{dropdown}</DropdownContainer>}
        {children}
      </>
    </Wrapper>
  )
}
