import React from 'react'
import styled from 'styled-components'

// eslint-disable-next-line import/no-extraneous-dependencies
import { AbstractConnector } from '@web3-react/abstract-connector'

import { walletconnect } from '../../../../connectors'
import { Button } from '../../../buttons/Button'
import { InlineLoading } from '../../../common/InlineLoading'
import { AlertIcon } from '../../../icons/AlertIcon'
import { EmptyContentText } from '../../../pureStyledComponents/EmptyContent'
import { Text } from '../../common/pureStyledComponents/Text'
import WalletConnectData from '../WalletConnectData'

const Wrapper = styled.div``

const ErrorWrapper = styled.div`
  align-items: center;
  display: flex;
  flex-direction: column;
  justify-content: center;
  min-height: 250px;
  width: 100%;
`

const LoadingWrapper = styled(InlineLoading)`
  height: 180px;
`

const ActionButton = styled(Button)`
  margin-top: 80px;
  width: 100%;
`

interface Props {
  connector?: AbstractConnector
  error?: boolean
  setPendingError: (error: boolean) => void
  tryActivation: (connector: AbstractConnector) => void
  uri?: string
}

const PendingView: React.FC<Props> = (props) => {
  const { connector, error = false, setPendingError, tryActivation, uri = '', ...restProps } = props

  const isWalletConnect = connector === walletconnect

  return (
    <Wrapper {...restProps}>
      {error && (
        <ErrorWrapper>
          <AlertIcon />
          <EmptyContentText>Error connecting.</EmptyContentText>
          <ActionButton
            onClick={() => {
              setPendingError(false)
              tryActivation(connector)
            }}
          >
            Try Again
          </ActionButton>
        </ErrorWrapper>
      )}
      {!error && isWalletConnect && (
        <>
          <WalletConnectData size={220} uri={uri} />
          <Text>Scan QR code with a compatible wallet...</Text>
        </>
      )}
      {!error && !isWalletConnect && <LoadingWrapper message={'Connecting...'} />}
    </Wrapper>
  )
}

export default PendingView
