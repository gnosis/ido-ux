import React from 'react'
import styled from 'styled-components'
import { Token } from 'uniswap-xdai-sdk'

import { Button } from '../../../buttons/Button'
import { AlertIcon } from '../../../icons/AlertIcon'
import { IconWrapper } from '../pureStyledComponents/IconWrapper'
import { Text } from '../pureStyledComponents/Text'

const ActionButton = styled(Button)`
  margin-top: 40px;
  width: 100%;
`

interface Props {
  orderId?: string
  onCancelOrder: () => any
  biddingToken?: Token
  confirmText: string
}

const CancelModalFooter: React.FC<Props> = (props) => {
  const { confirmText, onCancelOrder } = props
  return (
    <>
      <IconWrapper>
        <AlertIcon />
      </IconWrapper>
      <Text fontSize="18px" textAlign="center">
        This order can&apos;t be recovered after cancellation!
      </Text>
      <ActionButton onClick={onCancelOrder}>{confirmText}</ActionButton>
    </>
  )
}

export default CancelModalFooter
