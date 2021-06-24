import React from 'react'
import styled from 'styled-components'

import { AbstractConnector } from '@web3-react/abstract-connector'

import { Button } from '../../../buttons/Button'
import { InlineLoading } from '../../../common/InlineLoading'
import { AlertIcon } from '../../../icons/AlertIcon'
import { IconWrapper } from '../../common/pureStyledComponents/IconWrapper'
import { Text } from '../../common/pureStyledComponents/Text'

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
  const { connector, error = false, setPendingError, tryActivation, ...restProps } = props

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
              connector && tryActivation(connector)
            }}
          >
            Try Again
          </ActionButton>
        </>
      )}
      {!error && <LoadingWrapper message={'Connecting...'} />}
    </Wrapper>
  )
}

export default PendingView
