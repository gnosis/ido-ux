import React from 'react'

import Modal from '../common/Modal'
import { ModalTitle } from '../common/ModalTitle'

interface Props {
  content: string
  isOpen: boolean
  onDismiss: () => void
  title?: string
}

const WarningModal: React.FC<Props> = (props) => {
  const { content, isOpen, onDismiss, title = '' } = props

  return (
    <Modal isOpen={isOpen} onDismiss={onDismiss} width={394}>
      <ModalTitle onClose={onDismiss} title={title} />
      {content}
    </Modal>
  )
}

export default WarningModal
