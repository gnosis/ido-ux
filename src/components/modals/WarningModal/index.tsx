import React from 'react'

import { AlertIcon } from '../../icons/AlertIcon'
import Modal from '../common/Modal'
import { ModalTitle } from '../common/ModalTitle'
import { IconWrapper } from '../common/pureStyledComponents/IconWrapper'
import { Text } from '../common/pureStyledComponents/Text'

interface Props {
  content: string
  isOpen: boolean
  onDismiss: () => void
  title?: string
}

const WarningModal: React.FC<Props> = (props) => {
  const { content, isOpen, onDismiss, title = '' } = props

  return (
    <Modal isOpen={isOpen} onDismiss={onDismiss} width={350}>
      <ModalTitle onClose={onDismiss} title={title} />
      <IconWrapper>
        <AlertIcon />
      </IconWrapper>
      <Text fontSize="18px" textAlign="center">
        {content}
      </Text>
    </Modal>
  )
}

export default WarningModal
