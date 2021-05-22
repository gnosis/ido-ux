import { InjectedConnector } from '@web3-react/injected-connector'
import { NetworkConnector } from '@web3-react/network-connector'
import { PortisConnector } from '@web3-react/portis-connector'
import { WalletConnectConnector } from '@web3-react/walletconnect-connector'
import { WalletLinkConnector } from '@web3-react/walletlink-connector'

import {
  NETWORK_URL_MAINNET,
  NETWORK_URL_RINKEBY,
  NETWORK_URL_XDAI,
  PORTIS_ID,
} from '../constants/config'

const POLLING_INTERVAL = 10000

const urls = []
if (NETWORK_URL_MAINNET) urls[1] = NETWORK_URL_MAINNET
if (NETWORK_URL_RINKEBY) urls[4] = NETWORK_URL_RINKEBY
if (NETWORK_URL_XDAI) urls[100] = NETWORK_URL_XDAI

const defaultChainId = urls.findIndex((chainId) => !!chainId)

export const network = new NetworkConnector({ urls, defaultChainId })

export const injected = new InjectedConnector({
  supportedChainIds: [1, 4, 100],
})

export const walletconnect = {
  1: new WalletConnectConnector({
    rpc: { 1: NETWORK_URL_MAINNET },
    bridge: 'https://safe-walletconnect.gnosis.io',
    qrcode: false,
    pollingInterval: POLLING_INTERVAL,
  }),
  100: new WalletConnectConnector({
    rpc: { 100: NETWORK_URL_XDAI },
    bridge: 'https://safe-walletconnect.gnosis.io',
    qrcode: false,
    pollingInterval: POLLING_INTERVAL,
  }),
  4: new WalletConnectConnector({
    rpc: { 4: NETWORK_URL_RINKEBY },
    bridge: 'https://safe-walletconnect.gnosis.io',
    qrcode: true,
    pollingInterval: POLLING_INTERVAL,
  }),
  // if no network is defined, we look whether wallet connect supports all possible chains
  // this might cause issues on the auction overview page.
  // A solution for this usecase should be a network selector
  undefined: new WalletConnectConnector({
    rpc: { 4: NETWORK_URL_RINKEBY, 100: NETWORK_URL_XDAI, 1: NETWORK_URL_MAINNET },
    bridge: 'https://safe-walletconnect.gnosis.io',
    qrcode: false,
    pollingInterval: POLLING_INTERVAL,
  }),
}

// mainnet only
export const portis = new PortisConnector({
  dAppId: PORTIS_ID,
  networks: [1],
})

// mainnet only
export const walletlink = new WalletLinkConnector({
  url: NETWORK_URL_MAINNET,
  appName: 'GnosisAuction',
  appLogoUrl:
    'https://mpng.pngfly.com/20181202/bex/kisspng-emoji-domain-unicorn-pin-badges-sticker-unicorn-tumblr-emoji-unicorn-iphoneemoji-5c046729264a77.5671679315437924251569.jpg',
})
