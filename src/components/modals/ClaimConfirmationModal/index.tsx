import React, { useContext } from 'react'
import { ArrowUpCircle } from 'react-feather'
import styled, { ThemeContext } from 'styled-components'

import { Text } from 'rebass'

import { useActiveWeb3React } from '../../../hooks'
import { ExternalLink } from '../../../theme'
import { CloseIcon } from '../../../theme/components'
import { getEtherscanLink } from '../../../utils'
import { ButtonPrimary } from '../../Button'
import { AutoColumn, ColumnCenter } from '../../Column'
import Loader from '../../Loader'
import { RowBetween } from '../../Row'
import Modal from '../common/Modal'

const Wrapper = styled.div`
  width: 100%;
`
const Section = styled(AutoColumn)`
  padding: 24px;
`

const ConfirmedIcon = styled(ColumnCenter)`
  padding: 60px 0;
`

interface ConfirmationModalProps {
  isOpen: boolean
  onDismiss: () => void
  hash: string
  pendingConfirmation: boolean
  pendingText: string
}

export default function ClaimConfirmationModal({
  hash,
  isOpen,
  onDismiss,
  pendingConfirmation,
  pendingText,
}: ConfirmationModalProps) {
  const { chainId } = useActiveWeb3React()
  const theme = useContext(ThemeContext)

  return (
    <Modal isOpen={isOpen} maxHeight={90} onDismiss={onDismiss}>
      {
        <Wrapper>
          <Section>
            <RowBetween>
              <div />
              <CloseIcon onClick={onDismiss} />
            </RowBetween>
            <ConfirmedIcon>
              {pendingConfirmation ? (
                <Loader size="90px" />
              ) : (
                <ArrowUpCircle color={theme.primary1} size={90} strokeWidth={0.5} />
              )}
            </ConfirmedIcon>
            <AutoColumn gap="12px" justify={'center'}>
              <Text fontSize={20} fontWeight={500}>
                {!pendingConfirmation ? 'Transaction Submitted' : 'Waiting For Confirmation'}
              </Text>
              <AutoColumn gap="12px" justify={'center'}>
                <Text color="" fontSize={14} fontWeight={600} textAlign="center">
                  {pendingText}
                </Text>
              </AutoColumn>
              {!pendingConfirmation && (
                <>
                  <ExternalLink href={getEtherscanLink(chainId, hash, 'transaction')}>
                    <Text color={theme.primary1} fontSize={14} fontWeight={500}>
                      View on Etherscan
                    </Text>
                  </ExternalLink>
                  <ButtonPrimary onClick={onDismiss} style={{ margin: '20px 0 0 0' }}>
                    <Text fontSize={20} fontWeight={500}>
                      Close
                    </Text>
                  </ButtonPrimary>
                </>
              )}

              {pendingConfirmation && (
                <Text color="#565A69" fontSize={12} textAlign="center">
                  Confirm this transaction in your wallet
                </Text>
              )}
            </AutoColumn>
          </Section>
        </Wrapper>
      }
    </Modal>
  )
}
