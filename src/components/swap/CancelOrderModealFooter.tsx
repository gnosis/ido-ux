import React from 'react'

import { Token } from '@uniswap/sdk'
import { Text } from 'rebass'

import { ButtonError } from '../Button'
import { AutoRow } from '../Row'

export default function CancelModalFooter({
  confirmText,
  onCancelOrder,
}: {
  orderId?: string
  onCancelOrder: () => any
  biddingToken?: Token
  confirmText: string
}) {
  return (
    <>
      <AutoRow>
        <ButtonError id="confirm-cancel" onClick={onCancelOrder} style={{ margin: '1px 0 0 0' }}>
          <Text fontSize={20} fontWeight={500}>
            {confirmText}
          </Text>
        </ButtonError>
      </AutoRow>
    </>
  )
}
