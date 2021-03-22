import React from 'react'
import styled from 'styled-components'

import { useActiveWeb3React } from '../../../hooks'
import { ExternalLink } from '../../../theme'
import { getEtherscanLink } from '../../../utils'
import { InlineLoading } from '../../common/InlineLoading'
import { SpinnerSize } from '../../common/Spinner'
import { ArrowUp } from '../../icons/ArrowUp'
import { LinkIcon } from '../../icons/LinkIcon'
import Modal from '../common/Modal'
import { ModalTitle } from '../common/ModalTitle'
import { Content } from '../common/pureStyledComponents/Content'
import { IconWrapper } from '../common/pureStyledComponents/IconWrapper'
import { Text } from '../common/pureStyledComponents/Text'

const LoadingWrapper = styled(InlineLoading)`
  height: 180px;
`

const Link = styled(ExternalLink)`
  color: ${({ theme }) => theme.text1};
  font-size: 16px;
  line-height: 1.2;
  padding: 12px 0 0 0;
  text-align: center;
  text-decoration: none;

  &:hover {
    text-decoration: underline;
  }

  > span {
    margin-right: 6px;
  }
`

interface ConfirmationModalProps {
  attemptingTxn: boolean
  content: () => React.ReactChild
  hash: string
  isOpen: boolean
  onDismiss: () => void
  pendingConfirmation: boolean
  pendingText: string
  title?: string
  width?: number
}

const ConfirmationModal: React.FC<ConfirmationModalProps> = (props) => {
  const {
    attemptingTxn,
    content,
    hash,
    isOpen,
    onDismiss,
    pendingConfirmation,
    pendingText,
    title = '',
    width,
    ...restProps
  } = props
  const { chainId } = useActiveWeb3React()

  const isWorking = attemptingTxn && pendingConfirmation
  const isFinished = attemptingTxn && !pendingConfirmation

  return (
    <Modal
      isOpen={isOpen}
      onDismiss={onDismiss}
      width={width ? width : isWorking || isFinished ? 394 : undefined}
      {...restProps}
    >
      <ModalTitle onClose={onDismiss} title={isWorking || isFinished ? '' : title} />
      <Content>
        {!attemptingTxn && <>{content()}</>}
        {isWorking && (
          <>
            <LoadingWrapper
              message="Waiting For Confirmation"
              size={SpinnerSize.large}
              subMessage={pendingText}
            />
            <Text fontSize="16px" textAlign="center">
              Confirm this transaction in your wallet.
            </Text>
          </>
        )}
        {isFinished && (
          <>
            <IconWrapper>
              <ArrowUp />
            </IconWrapper>
            <Text fontSize="24px" margin="0" textAlign="center">
              Transaction Submitted
            </Text>
            <Text fontSize="20px" margin="0" textAlign="center">
              Placing Order
            </Text>
            <Link href={getEtherscanLink(chainId, hash, 'transaction')}>
              <span>View on Etherscan</span>
              <LinkIcon />
            </Link>
          </>
        )}
      </Content>
    </Modal>
  )
}

export default ConfirmationModal
