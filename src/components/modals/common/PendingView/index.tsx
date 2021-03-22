import { darken } from 'polished'
import React from 'react'
import styled from 'styled-components'

// eslint-disable-next-line import/no-extraneous-dependencies
import { AbstractConnector } from '@web3-react/abstract-connector'

import Circle from '../../../../assets/images/circle.svg'
import { walletconnect } from '../../../../connectors'
import { Spinner } from '../../../../theme'
import WalletConnectData from '../WalletConnectData'

const Wrapper = styled.div`
  ${({ theme }) => theme.flexColumnNoWrap};
  align-items: center;
  justify-content: center;
  width: 100%;
  & > * {
    width: 100%;
  }
`

const SpinnerWrapper = styled(Spinner)`
  font-size: 4rem;
  margin-right: 1rem;
  svg {
    path {
      color: ${({ theme }) => theme.bg4};
    }
  }
`

const LoadingMessage = styled.div<{ error?: boolean }>`
  ${({ theme }) => theme.flexRowNoWrap};
  align-items: center;
  justify-content: flex-start;
  border-radius: 12px;
  margin-bottom: 20px;
  color: ${({ error, theme }) => (error ? theme.red1 : 'inherit')};
  border: 1px solid ${({ error, theme }) => (error ? theme.red1 : theme.text4)};

  & > * {
    padding: 1rem;
  }
`

const ErrorGroup = styled.div`
  ${({ theme }) => theme.flexRowNoWrap};
  align-items: center;
  justify-content: flex-start;
`

const ErrorButton = styled.div`
  border-radius: 8px;
  font-size: 12px;
  color: ${({ theme }) => theme.text1};
  background-color: ${({ theme }) => theme.bg4};
  margin-left: 1rem;
  padding: 0.5rem;
  font-weight: 600;
  user-select: none;

  &:hover {
    cursor: pointer;
    background-color: ${({ theme }) => darken(0.1, theme.text4)};
  }
`

const LoadingWrapper = styled.div`
  ${({ theme }) => theme.flexRowNoWrap};
  align-items: center;
  justify-content: center;
`

interface Props {
  connector?: AbstractConnector
  error?: boolean
  setPendingError: (error: boolean) => void
  size?: number
  tryActivation: (connector: AbstractConnector) => void
  uri?: string
}

const PendingView: React.FC<Props> = (props) => {
  const {
    connector,
    error = false,
    setPendingError,
    size,
    tryActivation,
    uri = '',
    ...restProps
  } = props

  return (
    <Wrapper {...restProps}>
      {!error && connector === walletconnect && <WalletConnectData size={size} uri={uri} />}
      <LoadingMessage error={error}>
        <LoadingWrapper>
          {!error && <SpinnerWrapper src={Circle} />}
          {error ? (
            <ErrorGroup>
              <div>Error connecting.</div>
              <ErrorButton
                onClick={() => {
                  setPendingError(false)
                  tryActivation(connector)
                }}
              >
                Try Again
              </ErrorButton>
            </ErrorGroup>
          ) : connector === walletconnect ? (
            'Scan QR code with a compatible wallet...'
          ) : (
            'Initializing...'
          )}
        </LoadingWrapper>
      </LoadingMessage>
    </Wrapper>
  )
}

export default PendingView
