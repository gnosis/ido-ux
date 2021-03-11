import React from 'react'

import { LockBig } from '../../icons/LockBig'
import { EmptyContentText, EmptyContentWrapper } from '../../pureStyledComponents/EmptyContent'

export const AuctionPending: React.FC = () => {
  return (
    <EmptyContentWrapper>
      <LockBig />
      <EmptyContentText>Pending on-chain price-calculation.</EmptyContentText>
    </EmptyContentWrapper>
  )
}
