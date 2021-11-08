import { WalletConnectConnector } from '@anxolin/walletconnect-connector'
import { InjectedConnector } from '@web3-react/injected-connector'
import { NetworkConnector } from '@web3-react/network-connector'
import { PortisConnector } from '@web3-react/portis-connector'
import { WalletLinkConnector } from '@web3-react/walletlink-connector'

import { NETWORK_URL_MAINNET, PORTIS_ID } from '../constants/config'
import { ChainId, NETWORK_CONFIGS } from './../utils/index'

const POLLING_INTERVAL = 10000

const urls: string[] = []

// TOOD Try to use reduce to improve types
const rpcs: any = {}

const chainIds = Object.keys(NETWORK_CONFIGS).map(Number)
chainIds.forEach((chainId: ChainId) => {
  if (NETWORK_CONFIGS[chainId].rpc) {
    urls[chainId] = NETWORK_CONFIGS[chainId].rpc
    rpcs[chainId] = NETWORK_CONFIGS[chainId].rpc
  }
})

// TODO Throw error if no defaultChainId is found
const defaultChainId = urls.findIndex((chainId) => !!chainId)

export const network = new NetworkConnector({ urls, defaultChainId })

export const injected = new InjectedConnector({
  supportedChainIds: chainIds,
})

export const walletconnect = {
  1: new WalletConnectConnector({
    rpc: { 1: NETWORK_CONFIGS[1].rpc },
    bridge: 'https://safe-walletconnect.gnosis.io',
    qrcode: true,
    pollingInterval: POLLING_INTERVAL,
  }),
  100: new WalletConnectConnector({
    rpc: { 100: NETWORK_CONFIGS[100].rpc },
    bridge: 'https://safe-walletconnect.gnosis.io',
    qrcode: true,
    pollingInterval: POLLING_INTERVAL,
  }),
  4: new WalletConnectConnector({
    rpc: { 4: NETWORK_CONFIGS[4].rpc },
    bridge: 'https://safe-walletconnect.gnosis.io',
    qrcode: true,
    pollingInterval: POLLING_INTERVAL,
  }),
  // if no network is defined, we look whether wallet connect supports all possible chains
  // this might cause issues on the auction overview page.
  // A solution for this usecase should be a network selector
  undefined: new WalletConnectConnector({
    rpc: rpcs,
    bridge: 'https://safe-walletconnect.gnosis.io',
    qrcode: true,
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
