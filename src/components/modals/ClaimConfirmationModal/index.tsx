import React from 'react'
import styled from 'styled-components'

import { explorerNames } from '../../../constants'
import { useActiveWeb3React } from '../../../hooks'
import { ExternalLink } from '../../../theme'
import { getExplorerLink } from '../../../utils'
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

interface Props {
  hash: string
  isOpen: boolean
  onDismiss: () => void
  pendingConfirmation: boolean
  pendingText: string
}

const ClaimConfirmationModal: React.FC<Props> = (props) => {
  const { hash, isOpen, onDismiss, pendingConfirmation, pendingText, ...restProps } = props
  const { chainId } = useActiveWeb3React()

  return (
    <Modal isOpen={isOpen} onDismiss={onDismiss} width={394} {...restProps}>
      <ModalTitle onClose={onDismiss} />
      <Content>
        {pendingConfirmation && (
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
        {!pendingConfirmation && (
          <>
            <IconWrapper>
              <ArrowUp />
            </IconWrapper>
            <Text fontSize="24px" margin="0" textAlign="center">
              Transaction Submitted
            </Text>
            <Text fontSize="20px" margin="0" textAlign="center">
              {pendingText}
            </Text>
            <Link href={getExplorerLink(chainId, hash, 'transaction')}>
              <span>View transaction {`on ${explorerNames[chainId]}`}</span>
              <LinkIcon />
            </Link>
          </>
        )}
      </Content>
    </Modal>
  )
}

export default ClaimConfirmationModal
