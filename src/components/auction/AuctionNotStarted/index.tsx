import React from 'react'

import { LockBig } from '../../icons/LockBig'
import { EmptyContentText, EmptyContentWrapper } from '../../pureStyledComponents/EmptyContent'

export const AuctionNotStarted: React.FC = () => {
  return (
    <EmptyContentWrapper>
      <LockBig />
      <EmptyContentText>Auction not started yet.</EmptyContentText>
    </EmptyContentWrapper>
  )
}
