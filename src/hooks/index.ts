import { useEffect, useState } from 'react'

import { Web3Provider } from '@ethersproject/providers'
import { useWeb3React as useWeb3ReactCore } from '@web3-react/core'
import { isMobile } from 'react-device-detect'

import { injected } from '../connectors'
import { NetworkContextName } from '../constants'
import { useOrderActionHandlers } from '../state/orders/hooks'

export function useActiveWeb3React() {
  const context = useWeb3ReactCore<Web3Provider>()
  const contextNetwork = useWeb3ReactCore<Web3Provider>(NetworkContextName)
  return context.active ? context : contextNetwork
}

export function useEagerConnect() {
  const { activate, active } = useWeb3ReactCore() // specifically using useWeb3ReactCore because of what this hook does
  const [tried, setTried] = useState(false)

  useEffect(() => {
    injected.isAuthorized().then((isAuthorized) => {
      if (isAuthorized) {
        activate(injected, undefined, true).catch(() => {
          setTried(true)
        })
      } else {
        if (isMobile && window.ethereum) {
          activate(injected, undefined, true).catch(() => {
            setTried(true)
          })
        } else {
          setTried(true)
        }
      }
    })
  }, [activate]) // intentionally only running on mount (make sure it's only mounted once :))

  // if the connection worked, wait until we get confirmation of that to flip the flag
  useEffect(() => {
    if (active) {
      setTried(true)
    }
  }, [active])

  return tried
}

/**
 * Use for network and injected - logs user in
 * and out after checking what network theyre on
 */
export function useInactiveListener(suppress = false) {
  const { activate, active, error } = useWeb3ReactCore() // specifically using useWeb3React because of what this hook does

  useEffect(() => {
    const { ethereum } = window

    if (ethereum && ethereum.on && !active && !error && !suppress) {
      const handleChainChanged = () => {
        // eat errors
        activate(injected, undefined, true).catch((error) => {
          console.error('Failed to activate after chain changed', error)
        })
      }

      const handleAccountsChanged = (accounts: string[]) => {
        if (accounts.length > 0) {
          // eat errors
          activate(injected, undefined, true).catch((error) => {
            console.error('Failed to activate after accounts changed', error)
          })
        }
      }

      const handleNetworkChanged = () => {
        // eat errors
        activate(injected, undefined, true).catch((error) => {
          console.error('Failed to activate after networks changed', error)
        })
      }

      ethereum.on('chainChanged', handleChainChanged)
      ethereum.on('networkChanged', handleNetworkChanged)
      ethereum.on('accountsChanged', handleAccountsChanged)

      return () => {
        if (ethereum.removeListener) {
          ethereum.removeListener('chainChanged', handleChainChanged)
          ethereum.removeListener('networkChanged', handleNetworkChanged)
          ethereum.removeListener('accountsChanged', handleAccountsChanged)
        }
      }
    }
    return
  }, [active, error, suppress, activate])
}

/**
 * Hook that subscribes to some events
 */
export function useActiveListener() {
  const { activate, active, error } = useWeb3ReactCore()
  const { onReloadFromAPI } = useOrderActionHandlers()

  useEffect(() => {
    const { ethereum } = window

    if (ethereum && ethereum.on && active && !error) {
      const handleAccountsChanged = () => {
        // Reload orders on accounts changed
        onReloadFromAPI()
      }

      ethereum.on('accountsChanged', handleAccountsChanged)
    }
  }, [active, error, onReloadFromAPI, activate])
}
