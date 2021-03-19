import React, { useEffect, useState } from 'react'
import styled from 'styled-components'

import { UnsupportedChainIdError, useWeb3React } from '@web3-react/core'
import { URI_AVAILABLE } from '@web3-react/walletconnect-connector'
import { isMobile } from 'react-device-detect'
import ReactGA from 'react-ga'

import MetamaskIcon from '../../../assets/images/metamask.png'
import { ReactComponent as Close } from '../../../assets/images/x.svg'
import { fortmatic, injected, portis, walletconnect } from '../../../connectors'
import { OVERLAY_READY } from '../../../connectors/Fortmatic'
import { SUPPORTED_WALLETS } from '../../../constants'
import usePrevious from '../../../hooks/usePrevious'
import { useWalletModalOpen, useWalletModalToggle } from '../../../state/application/hooks'
import { ExternalLink } from '../../../theme'
import AccountDetails from '../../AccountDetails'
import { useNetworkCheck } from '../../Web3Status'
import Modal from '../Modal'
import { ModalTitle } from '../common/ModalTitle'
import Option from './Option'
import PendingView from './PendingView'

const CloseIcon = styled.div``

const CloseColor = styled(Close)``

const HeaderRow = styled.div``

const ContentWrapper = styled.div``

const UpperSection = styled.div``

const Blurb = styled.div``

const OptionGrid = styled.div``

const HoverText = styled.div``

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
              color={option.color}
              header={option.name}
              icon={option.icon}
              id={`connect-${key}`}
              key={key}
              link={option.href}
              onClick={() => {
                option.connector !== connector && !option.href && tryActivation(option.connector)
              }}
              subheader={null}
            />
          )
        }
        return null
      }

      if (option.connector === injected) {
        if (!(window.web3 || window.ethereum)) {
          if (option.name === 'MetaMask') {
            return (
              <Option
                color={'#E8831D'}
                header={'Install Metamask'}
                icon={MetamaskIcon}
                id={`connect-${key}`}
                key={key}
                link={'https://metamask.io/'}
                subheader={null}
              />
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
            color={option.color}
            header={option.name}
            icon={option.icon}
            id={`connect-${key}`}
            key={key}
            link={option.href}
            onClick={() => {
              option.connector === connector
                ? setWalletView(WALLET_VIEWS.ACCOUNT)
                : !option.href && tryActivation(option.connector)
            }} //use option.description to bring back multi-line
            subheader={null}
          />
        )
      )
    })
  }

  const generalError = error || errorWrongNetwork
  const showWalletDetails = account && walletView === WALLET_VIEWS.ACCOUNT

  return (
    <Modal isOpen={walletModalOpen} onDismiss={toggleWalletModal}>
      {generalError && (
        <UpperSection>
          <CloseIcon onClick={toggleWalletModal}>
            <CloseColor />
          </CloseIcon>
          <HeaderRow>
            {error instanceof UnsupportedChainIdError || errorWrongNetwork
              ? 'Wrong Network'
              : 'Error connecting'}
          </HeaderRow>
          <ContentWrapper>
            {error instanceof UnsupportedChainIdError ? (
              <h5>Please connect to the appropriate Ethereum network.</h5>
            ) : errorWrongNetwork ? (
              errorWrongNetwork
            ) : (
              'Error connecting. Try refreshing the page.'
            )}
          </ContentWrapper>
        </UpperSection>
      )}
      {showWalletDetails && account && walletView === WALLET_VIEWS.ACCOUNT && (
        <AccountDetails
          confirmedTransactions={confirmedTransactions}
          // eslint-disable-next-line
          ENSName={ENSName}
          openOptions={() => setWalletView(WALLET_VIEWS.OPTIONS)}
          pendingTransactions={pendingTransactions}
          toggleWalletModal={toggleWalletModal}
        />
      )}
      {generalError && showWalletDetails && (
        <CloseIcon onClick={toggleWalletModal}>
          <CloseColor />
        </CloseIcon>
      )}
      {walletView !== WALLET_VIEWS.ACCOUNT && (
        <HeaderRow color="blue">
          <HoverText
            onClick={() => {
              setPendingError(false)
              setWalletView(WALLET_VIEWS.ACCOUNT)
            }}
          >
            Back
          </HoverText>
        </HeaderRow>
      )}
      {!generalError && !showWalletDetails && (
        <ModalTitle onClose={toggleWalletModal} title="Connect to a wallet" />
      )}
      <ContentWrapper>
        {walletView === WALLET_VIEWS.PENDING ? (
          <PendingView
            connector={pendingWallet}
            error={pendingError}
            setPendingError={setPendingError}
            size={220}
            tryActivation={tryActivation}
            uri={uri}
          />
        ) : (
          <OptionGrid>{getOptions()}</OptionGrid>
        )}
        {walletView !== WALLET_VIEWS.PENDING && (
          <Blurb>
            <span>New to Ethereum? &nbsp;</span>{' '}
            <ExternalLink href="https://ethereum.org/use/#3-what-is-a-wallet-and-which-one-should-i-use">
              Learn more about wallets
            </ExternalLink>
          </Blurb>
        )}
      </ContentWrapper>
    </Modal>
  )
}

export default WalletModal
