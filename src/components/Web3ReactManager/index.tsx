import React, { useEffect, useState } from 'react'
import styled from 'styled-components'

import { useWeb3React } from '@web3-react/core'
import { useTranslation } from 'react-i18next'

import { tokenLogosServiceApi } from '../../api'
import Circle from '../../assets/images/circle.svg'
import { network } from '../../connectors'
import { NetworkContextName } from '../../constants'
import { useActiveListener, useEagerConnect, useInactiveListener } from '../../hooks'
import { useTokenListActionHandlers } from '../../state/tokenList/hooks'
import { Spinner } from '../../theme'

const MessageWrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  height: 20rem;
`

const Message = styled.h2`
  color: ${({ theme }) => theme.secondary1};
`

const SpinnerWrapper = styled(Spinner)`
  font-size: 4rem;

  svg {
    path {
      color: ${({ theme }) => theme.secondary1};
    }
  }
`

export default function Web3ReactManager({ children }) {
  const { t } = useTranslation()
  const { active } = useWeb3React()
  const { activate: activateNetwork, active: networkActive, error: networkError } = useWeb3React(
    NetworkContextName,
  )
  const { onLoadTokenList } = useTokenListActionHandlers()

  // try to eagerly connect to an injected provider, if it exists and has granted access already
  const triedEager = useEagerConnect()

  // after eagerly trying injected, if the network connect ever isn't active or in an error state, activate itd
  useEffect(() => {
    if (triedEager && !networkActive && !networkError && !active) {
      activateNetwork(network)
    }
  }, [triedEager, networkActive, networkError, activateNetwork, active])

  // when there's no account connected, react to logins (broadly speaking) on the injected provider, if it exists
  useInactiveListener(!triedEager)

  // So we can trigger some events on accountsChanged
  useActiveListener()

  // handle delayed loader state
  const [showLoader, setShowLoader] = useState(false)
  useEffect(() => {
    const timeout = setTimeout(() => {
      setShowLoader(true)
    }, 600)

    return () => {
      clearTimeout(timeout)
    }
  }, [])

  // Fetch token logos by chain ID
  useEffect(() => {
    let cancelled = false
    const fetchTokenList = async (): Promise<void> => {
      try {
        setShowLoader(true)

        const data = await tokenLogosServiceApi.getAllTokens()
        if (!cancelled) {
          onLoadTokenList(data)
          setShowLoader(false)
        }
      } catch (error) {
        console.error('Error getting token list', error)
        if (cancelled) return
        onLoadTokenList(null)
        setShowLoader(false)
      }
    }

    fetchTokenList()
    return (): void => {
      cancelled = true
    }
  }, [onLoadTokenList])

  // on page load, do nothing until we've tried to connect to the injected connector
  if (!triedEager) {
    return null
  }

  // if the account context isn't active, and there's an error on the network context, it's an irrecoverable error
  if (!active && networkError) {
    return (
      <MessageWrapper>
        <Message>{t('unknownError')}</Message>
      </MessageWrapper>
    )
  }

  // if neither context is active, spin
  if (!active && !networkActive) {
    return showLoader ? (
      <MessageWrapper>
        <SpinnerWrapper src={Circle} />
      </MessageWrapper>
    ) : null
  }

  return children
}
