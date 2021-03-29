import React from 'react'
import styled from 'styled-components'

import { LockBig } from '../../icons/LockBig'
import { EmptyContentText, EmptyContentWrapper } from '../../pureStyledComponents/EmptyContent'

const Wrapper = styled(EmptyContentWrapper)`
  min-height: 352px;
`

export const AuctionPending: React.FC = () => {
  return (
    <Wrapper>
      <LockBig />
      <EmptyContentText>Pending on-chain price-calculation.</EmptyContentText>
    </Wrapper>
  )
}
