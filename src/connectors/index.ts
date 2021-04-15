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

const rpcForWalletConnect: {
  [chainId: number]: string
} = { 4: NETWORK_URL_RINKEBY, 100: NETWORK_URL_XDAI, 1: NETWORK_URL_MAINNET }

export const walletconnect = new WalletConnectConnector({
  rpc: rpcForWalletConnect,
  bridge: 'https://safe-walletconnect.gnosis.io',
  qrcode: false,
  pollingInterval: POLLING_INTERVAL,
})

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
