import React from 'react'
import styled from 'styled-components'

// eslint-disable-next-line import/no-extraneous-dependencies
import { AbstractConnector } from '@web3-react/abstract-connector'

import { walletconnect } from '../../../../connectors'
import { useSwapState } from '../../../../state/orderPlacement/hooks'
import { Button } from '../../../buttons/Button'
import { InlineLoading } from '../../../common/InlineLoading'
import { AlertIcon } from '../../../icons/AlertIcon'
import { IconWrapper } from '../../common/pureStyledComponents/IconWrapper'
import { Text } from '../../common/pureStyledComponents/Text'
import WalletConnectData from '../WalletConnectData'

const Wrapper = styled.div``

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
  const { chainId } = useSwapState()

  const isWalletConnect = connector === walletconnect[chainId]
  return (
    <Wrapper {...restProps}>
      {error && (
        <>
          <IconWrapper>
            <AlertIcon />
          </IconWrapper>
          <Text fontSize="18px" textAlign="center">
            Error connecting.
          </Text>
          <ActionButton
            onClick={() => {
              setPendingError(false)
              tryActivation(connector)
            }}
          >
            Try Again
          </ActionButton>
        </>
      )}
      {!error && isWalletConnect && (
        <>
          <WalletConnectData size={220} uri={uri} />
          <Text fontSize="18px" textAlign="center">
            Scan QR code with a compatible wallet...
          </Text>
        </>
      )}
      {!error && !isWalletConnect && <LoadingWrapper message={'Connecting...'} />}
    </Wrapper>
  )
}

export default PendingView
