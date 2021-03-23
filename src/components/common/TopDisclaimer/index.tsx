import React from 'react'
import styled from 'styled-components'

import { InnerContainer } from '../../pureStyledComponents/InnerContainer'

const Wrapper = styled.div`
  background-color: ${({ theme }) => theme.primary1};
  height: 30px;
`

export const TopDisclaimer: React.FC = () => {
  return (
    <Wrapper>
      <InnerContainer>asd</InnerContainer>
    </Wrapper>
  )
}
