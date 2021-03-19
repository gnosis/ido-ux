import React, { useEffect, useState } from 'react'
import styled from 'styled-components'

import { UnsupportedChainIdError, useWeb3React } from '@web3-react/core'
import { URI_AVAILABLE } from '@web3-react/walletconnect-connector'
import { isMobile } from 'react-device-detect'
import ReactGA from 'react-ga'

import MetamaskIcon from '../../../assets/images/metamask.png'
import { fortmatic, injected, portis, walletconnect } from '../../../connectors'
import { OVERLAY_READY } from '../../../connectors/Fortmatic'
import { SUPPORTED_WALLETS } from '../../../constants'
import usePrevious from '../../../hooks/usePrevious'
import { useWalletModalOpen, useWalletModalToggle } from '../../../state/application/hooks'
import { ExternalLink } from '../../../theme'
import AccountDetails from '../../AccountDetails'
import { useNetworkCheck } from '../../Web3Status'
import { AlertIcon } from '../../icons/AlertIcon'
import Modal from '../common/Modal'
import { ModalTitle } from '../common/ModalTitle'
import Option from '../common/Option'
import PendingView from '../common/PendingView'
import { Content } from '../common/pureStyledComponents/Content'
import { IconWrapper } from '../common/pureStyledComponents/IconWrapper'
import { Text } from '../common/pureStyledComponents/Text'

const Blurb = styled.div``

const OptionGrid = styled.div``

const WALLET_VIEWS = {
  OPTIONS: 'options',
  OPTIONS_SECONDARY: 'options_secondary',
  ACCOUNT: 'account',
  PENDING: 'pending',
}

interface Props {
  ENSName?: string
  confirmedTransactions: string[]
  pendingTransactions: string[]
}

const WalletModal: React.FC<Props> = ({ ENSName, confirmedTransactions, pendingTransactions }) => {
  const { account, activate, active, connector, error } = useWeb3React()
  const [walletView, setWalletView] = useState(WALLET_VIEWS.ACCOUNT)
  const [pendingWallet, setPendingWallet] = useState()
  const [pendingError, setPendingError] = useState<boolean>()
  const walletModalOpen = useWalletModalOpen()
  const toggleWalletModal = useWalletModalToggle()
  const previousAccount = usePrevious(account)
  const { errorWrongNetwork } = useNetworkCheck()

  useEffect(() => {
    if (account && !previousAccount && walletModalOpen) {
      toggleWalletModal()
    }
  }, [account, previousAccount, toggleWalletModal, walletModalOpen])

  useEffect(() => {
    if (walletModalOpen) {
      setPendingError(false)
      setWalletView(WALLET_VIEWS.ACCOUNT)
    }
  }, [walletModalOpen])

  const [uri, setUri] = useState()
  useEffect(() => {
    const activateWC = (uri) => {
      setUri(uri)
    }
    walletconnect.on(URI_AVAILABLE, activateWC)
    return () => {
      walletconnect.off(URI_AVAILABLE, activateWC)
    }
  }, [])

  const activePrevious = usePrevious(active)
  const connectorPrevious = usePrevious(connector)

  useEffect(() => {
    if (
      walletModalOpen &&
      ((active && !activePrevious) ||
        (connector && connector !== connectorPrevious && !error && !errorWrongNetwork))
    ) {
      setWalletView(WALLET_VIEWS.ACCOUNT)
    }
  }, [
    setWalletView,
    active,
    error,
    connector,
    errorWrongNetwork,
    walletModalOpen,
    activePrevious,
    connectorPrevious,
  ])

  const tryActivation = async (connector) => {
    let name = ''
    Object.keys(SUPPORTED_WALLETS).map((key) => {
      if (connector === SUPPORTED_WALLETS[key].connector) {
        return (name = SUPPORTED_WALLETS[key].name)
      }
      return true
    })
    ReactGA.event({
      category: 'Wallet',
      action: 'Change Wallet',
      label: name,
    })
    setPendingWallet(connector)
    setWalletView(WALLET_VIEWS.PENDING)
    activate(connector, undefined, true).catch((error) => {
      if (error instanceof UnsupportedChainIdError) {
        activate(connector) // a little janky...can't use setError because the connector isn't set
      } else {
        setPendingError(true)
      }
    })
  }

  useEffect(() => {
    fortmatic.on(OVERLAY_READY, () => {
      toggleWalletModal()
    })
  }, [toggleWalletModal])

  const getOptions = () => {
    const isMetamask = window.ethereum && window.ethereum.isMetaMask
    return Object.keys(SUPPORTED_WALLETS).map((key) => {
      const option = SUPPORTED_WALLETS[key]

      if (isMobile) {
        if (option.connector === portis) {
          return null
        }

        if (!window.web3 && !window.ethereum && option.mobile) {
          return (
            <Option
              active={option.connector && option.connector === connector}
              icon={option.icon}
              link={option.href}
              onClick={() => {
                option.connector !== connector && !option.href && tryActivation(option.connector)
              }}
              text={option.name}
            />
          )
        }
        return null
      }

      if (option.connector === injected) {
        if (!(window.web3 || window.ethereum)) {
          if (option.name === 'MetaMask') {
            return (
              <Option icon={MetamaskIcon} link={'https://metamask.io/'} text={'Install Metamask'} />
            )
          } else {
            return null //dont want to return install twice
          }
        } else if (option.name === 'MetaMask' && !isMetamask) {
          return null
        } else if (option.name === 'Injected' && isMetamask) {
          return null
        }
      }

      return (
        !isMobile &&
        !option.mobileOnly && (
          <Option
            active={option.connector === connector}
            icon={option.icon}
            link={option.href}
            onClick={() => {
              option.connector === connector
                ? setWalletView(WALLET_VIEWS.ACCOUNT)
                : !option.href && tryActivation(option.connector)
            }}
            text={option.name}
          />
        )
      )
    })
  }

  const networkError = error instanceof UnsupportedChainIdError || errorWrongNetwork
  const viewAccountTransactions = account && walletView === WALLET_VIEWS.ACCOUNT
  const connectingToWallet = walletView === WALLET_VIEWS.PENDING
  const title = networkError
    ? 'Wrong Network'
    : error && viewAccountTransactions
    ? ''
    : error
    ? 'Error connecting'
    : 'Connect to a wallet'
  const errorMessage =
    error instanceof UnsupportedChainIdError
      ? 'Please connect to the appropriate Ethereum network.'
      : errorWrongNetwork
      ? errorWrongNetwork
      : 'Error connecting. Try refreshing the page.'

  return (
    <Modal isOpen={walletModalOpen} onDismiss={toggleWalletModal} width={error ? 400 : undefined}>
      <ModalTitle onClose={toggleWalletModal} title={title} />
      <Content>
        {error && (
          <>
            <IconWrapper>
              <AlertIcon />
            </IconWrapper>
            <Text fontSize="18px" textAlign="center">
              {errorMessage}
            </Text>
          </>
        )}
        {!error && !connectingToWallet && (
          <>
            <OptionGrid>{getOptions()}</OptionGrid>{' '}
            <Blurb>
              <span>New to Ethereum? &nbsp;</span>{' '}
              <ExternalLink href="https://ethereum.org/use/#3-what-is-a-wallet-and-which-one-should-i-use">
                Learn more about wallets
              </ExternalLink>
            </Blurb>
          </>
        )}
        {!error && connectingToWallet && (
          <PendingView
            connector={pendingWallet}
            error={pendingError}
            setPendingError={setPendingError}
            size={220}
            tryActivation={tryActivation}
            uri={uri}
          />
        )}
        {!error && viewAccountTransactions && (
          <AccountDetails
            confirmedTransactions={confirmedTransactions}
            // eslint-disable-next-line
            ENSName={ENSName}
            openOptions={() => setWalletView(WALLET_VIEWS.OPTIONS)}
            pendingTransactions={pendingTransactions}
            toggleWalletModal={toggleWalletModal}
          />
        )}
      </Content>
    </Modal>
  )
}

export default WalletModal
