import { WalletConnectConnector } from '@anxolin/walletconnect-connector'
import { InjectedConnector } from '@web3-react/injected-connector'
import { NetworkConnector } from '@web3-react/network-connector'
import { PortisConnector } from '@web3-react/portis-connector'
import { WalletLinkConnector } from '@web3-react/walletlink-connector'

import {
  CHAIN_ID,
  FORTMATIC_KEY,
  NETWORK_URL_MAINNET,
  NETWORK_URL_RINKEBY,
  NETWORK_URL_XDAI,
  PORTIS_ID,
} from '../constants/config'
import { FortmaticConnector } from './Fortmatic'

interface NetworkConnectorArguments {
  urls: { [chainId: number]: string }
  defaultChainId?: number
}

const POLLING_INTERVAL = 10000

const networkConnectorArguments: NetworkConnectorArguments = {
  urls: [],
  defaultChainId: CHAIN_ID,
}

if (NETWORK_URL_MAINNET) networkConnectorArguments.urls[1] = NETWORK_URL_MAINNET
if (NETWORK_URL_RINKEBY) networkConnectorArguments.urls[4] = NETWORK_URL_RINKEBY
if (NETWORK_URL_XDAI) networkConnectorArguments.urls[100] = NETWORK_URL_XDAI

export const network = new NetworkConnector(networkConnectorArguments)

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
    qrcode: false,
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
export const fortmatic = new FortmaticConnector({
  apiKey: FORTMATIC_KEY,
  chainId: 1,
})

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
