import React from 'react'
import styled from 'styled-components'

import { Text } from 'rebass'

import { CloseIcon } from '../../theme/components'
import { AutoColumn } from '../Column'
import Modal from '../Modal'
import { RowBetween } from '../Row'

const Wrapper = styled.div`
  width: 100%;
`
const Section = styled(AutoColumn)`
  padding: 24px;
`
const BottomSection = styled(Section)`
  background-color: ${({ theme }) => theme.bg2};
  border-bottom-left-radius: 20px;
  border-bottom-right-radius: 20px;
`

interface WarningModalProps {
  isOpen: boolean
  onDismiss: () => void
  content: string
  title?: string
}

export default function WarningModal({
  content,
  isOpen,
  onDismiss,
  title = '',
}: WarningModalProps) {
  return (
    <Modal isOpen={isOpen} maxHeight={90} onDismiss={onDismiss}>
      <Wrapper>
        <Section>
          <RowBetween>
            <Text fontSize={20} fontWeight={500}>
              {title}
            </Text>
            <CloseIcon onClick={onDismiss} />
          </RowBetween>
        </Section>
        <BottomSection gap="12px">{content}</BottomSection>
      </Wrapper>
    </Modal>
  )
}
