import React from 'react'
import styled from 'styled-components'

import { Button } from '../../../buttons/Button'
import { AlertIcon } from '../../../icons/AlertIcon'
import { IconWrapper } from '../pureStyledComponents/IconWrapper'
import { Text } from '../pureStyledComponents/Text'

const ActionButton = styled(Button)`
  margin-top: 40px;
  width: 100%;
`

interface Props {
  confirmText: string
  onCancelOrder: () => any
}

const CancelModalFooter: React.FC<Props> = (props) => {
  const { confirmText, onCancelOrder } = props
  return (
    <>
      <IconWrapper>
        <AlertIcon />
      </IconWrapper>
      <Text fontSize="18px" textAlign="center">
        You will need to place a new order if you still want to participate in this auction.
      </Text>
      <ActionButton onClick={onCancelOrder}>{confirmText}</ActionButton>
    </>
  )
}

export default CancelModalFooter
