import { JSBI, Percent } from 'uniswap-xdai-sdk'

import ArrowRightIcon from '../assets/images/arrow-right.svg'
import CoinbaseWalletIcon from '../assets/images/coinbaseWalletIcon.svg'
import FortmaticIcon from '../assets/images/fortmaticIcon.png'
import MetamaskIcon from '../assets/images/metamask.png'
import PortisIcon from '../assets/images/portisIcon.png'
import TrustWalletIcon from '../assets/images/trustWallet.png'
import WalletConnectIcon from '../assets/images/walletConnectIcon.png'
import { fortmatic, injected, portis, walletconnect, walletlink } from '../connectors'
import { ChainId } from '../utils'
import { CHAIN_ID } from './config'

export const chainNames = {
  1: 'mainnet',
  4: 'rinkeby',
  100: 'xdai',
}

export const EASY_AUCTION_NETWORKS: { [chainId in ChainId]: string } = {
  [ChainId.MAINNET]: '0xeefBa1e63905eF1D7ACbA5a8513c70307C1cE441',
  [ChainId.RINKEBY]: '0x307C1384EFeF241d6CBBFb1F85a04C54307Ac9F6',
  [ChainId.XDAI]: '0x9BacE46438b3f3e0c06d67f5C1743826EE8e87DA',
}
const MAINNET_WALLETS = {
  INJECTED: {
    connector: injected,
    name: 'Injected',
    icon: ArrowRightIcon,
    description: 'Injected web3 provider.',
    href: null,
    color: '#010101',
    primary: true,
  },
  METAMASK: {
    connector: injected,
    name: 'MetaMask',
    icon: MetamaskIcon,
    description: 'Easy-to-use browser extension.',
    href: null,
    color: '#E8831D',
  },
  WALLET_CONNECT: {
    connector: walletconnect,
    name: 'WalletConnect',
    icon: WalletConnectIcon,
    description: 'Connect to Trust Wallet, Rainbow Wallet and more...',
    href: null,
    color: '#4196FC',
  },
}
export const SUPPORTED_WALLETS =
  CHAIN_ID !== 1
    ? MAINNET_WALLETS
    : {
        ...MAINNET_WALLETS,
        ...{
          WALLET_LINK: {
            connector: walletlink,
            name: 'Coinbase Wallet',
            icon: CoinbaseWalletIcon,
            description: 'Use Coinbase Wallet app on mobile device',
            href: null,
            color: '#315CF5',
          },
          COINBASE_LINK: {
            name: 'Open in Coinbase Wallet',
            icon: CoinbaseWalletIcon,
            description: 'Open in Coinbase Wallet app.',
            href: 'https://go.cb-w.com/mtUDhEZPy1',
            color: '#315CF5',
            mobile: true,
            mobileOnly: true,
          },
          TRUST_WALLET_LINK: {
            name: 'Open in Trust Wallet',
            icon: TrustWalletIcon,
            description: 'iOS and Android app.',
            href:
              'https://link.trustwallet.com/open_url?coin_id=60&url=https://uniswap.exchange/swap',
            color: '#1C74CC',
            mobile: true,
            mobileOnly: true,
          },
          FORTMATIC: {
            connector: fortmatic,
            name: 'Fortmatic',
            icon: FortmaticIcon,
            description: 'Login using Fortmatic hosted wallet',
            href: null,
            color: '#6748FF',
            mobile: true,
          },
          Portis: {
            connector: portis,
            name: 'Portis',
            icon: PortisIcon,
            description: 'Login using Portis hosted wallet',
            href: null,
            color: '#4A6C9B',
            mobile: true,
          },
        },
      }

export const NetworkContextName = 'NETWORK'

// default allowed slippage, in bips
export const INITIAL_ALLOWED_SLIPPAGE = 50
// 20 minutes, denominated in seconds
export const DEFAULT_DEADLINE_FROM_NOW = 60 * 20

// one basis point
export const ONE_BIPS = new Percent(JSBI.BigInt(1), JSBI.BigInt(10000))
export const BIPS_BASE = JSBI.BigInt(10000)
// used for warning states
export const ALLOWED_PRICE_IMPACT_LOW: Percent = new Percent(JSBI.BigInt(100), BIPS_BASE) // 1%
export const ALLOWED_PRICE_IMPACT_MEDIUM: Percent = new Percent(JSBI.BigInt(500), BIPS_BASE) // 5%
export const ALLOWED_PRICE_IMPACT_HIGH: Percent = new Percent(JSBI.BigInt(1000), BIPS_BASE) // 10%

// if the price slippage exceeds this number, force the user to type 'confirm' to execute
export const PRICE_IMPACT_WITHOUT_FEE_CONFIRM_MIN: Percent = new Percent(
  JSBI.BigInt(2500),
  BIPS_BASE,
) // 25%

// used to ensure the user doesn't send so much ETH so they end up with <.01
export const MIN_ETH: JSBI = JSBI.exponentiate(JSBI.BigInt(10), JSBI.BigInt(16)) // .01 ETH
export const V1_TRADE_LINK_THRESHOLD = new Percent(JSBI.BigInt(75), JSBI.BigInt(10000))
