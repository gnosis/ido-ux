import { ChainId, JSBI, Percent, Token, WETH } from "@uniswap/sdk";
import {
  fortmatic,
  injected,
  portis,
  walletconnect,
  walletlink,
} from "../connectors";

import ArrowRightIcon from "../assets/images/arrow-right.svg";
import MetamaskIcon from "../assets/images/metamask.png";
import WalletConnectIcon from "../assets/images/walletConnectIcon.png";
import CoinbaseWalletIcon from "../assets/images/coinbaseWalletIcon.svg";
import TrustWalletIcon from "../assets/images/trustWallet.png";
import FortmaticIcon from "../assets/images/fortmaticIcon.png";
import PortisIcon from "../assets/images/portisIcon.png";

export const ROUTER_ADDRESS = "0xf164fC0Ec4E93095b804a4795bBe1e041497b92a";
export const EASY_AUCTION_NETWORKS: { [chainId in ChainId]: string } = {
  [ChainId.MAINNET]: "0xeefBa1e63905eF1D7ACbA5a8513c70307C1cE441",
  [ChainId.ROPSTEN]: "0x53C43764255c17BD724F74c4eF150724AC50a3ed",
  [ChainId.KOVAN]: "0x2cc8688C5f75E365aaEEb4ea8D6a480405A48D2A",
  [ChainId.RINKEBY]: "0xdC5f67d34aB3489b5bfD34645B7271615FAcdfA2",
  [ChainId.GÖRLI]: "0x732ed4E98f7906B81eb8ECD5269952DCEd966A0f",
};
// used for display in the default list when adding liquidity
export const COMMON_BASES = {
  [ChainId.MAINNET]: [
    WETH[ChainId.MAINNET],
    new Token(
      ChainId.MAINNET,
      "0x6B175474E89094C44Da98b954EedeAC495271d0F",
      18,
      "DAI",
      "Dai Stablecoin",
    ),
    new Token(
      ChainId.MAINNET,
      "0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48",
      6,
      "USDC",
      "USD//C",
    ),
  ],
  [ChainId.ROPSTEN]: [WETH[ChainId.ROPSTEN]],
  [ChainId.RINKEBY]: [
    WETH[ChainId.RINKEBY],
    new Token(
      ChainId.RINKEBY,
      "0xc7AD46e0b8a400Bb3C915120d284AafbA8fc4735",
      18,
      "DAI",
      "Dai Stablecoin",
    ),
  ],
  [ChainId.GÖRLI]: [WETH[ChainId.GÖRLI]],
  [ChainId.KOVAN]: [WETH[ChainId.KOVAN]],
};

const MAINNET_WALLETS = {
  INJECTED: {
    connector: injected,
    name: "Injected",
    icon: ArrowRightIcon,
    description: "Injected web3 provider.",
    href: null,
    color: "#010101",
    primary: true,
  },
  METAMASK: {
    connector: injected,
    name: "MetaMask",
    icon: MetamaskIcon,
    description: "Easy-to-use browser extension.",
    href: null,
    color: "#E8831D",
  },
  WALLET_CONNECT: {
    connector: walletconnect,
    name: "WalletConnect",
    icon: WalletConnectIcon,
    description: "Connect to Trust Wallet, Rainbow Wallet and more...",
    href: null,
    color: "#4196FC",
  },
};

export const SUPPORTED_WALLETS =
  process.env.REACT_APP_CHAIN_ID !== "1"
    ? MAINNET_WALLETS
    : {
        ...MAINNET_WALLETS,
        ...{
          WALLET_LINK: {
            connector: walletlink,
            name: "Coinbase Wallet",
            icon: CoinbaseWalletIcon,
            description: "Use Coinbase Wallet app on mobile device",
            href: null,
            color: "#315CF5",
          },
          COINBASE_LINK: {
            name: "Open in Coinbase Wallet",
            icon: CoinbaseWalletIcon,
            description: "Open in Coinbase Wallet app.",
            href: "https://go.cb-w.com/mtUDhEZPy1",
            color: "#315CF5",
            mobile: true,
            mobileOnly: true,
          },
          TRUST_WALLET_LINK: {
            name: "Open in Trust Wallet",
            icon: TrustWalletIcon,
            description: "iOS and Android app.",
            href:
              "https://link.trustwallet.com/open_url?coin_id=60&url=https://uniswap.exchange/swap",
            color: "#1C74CC",
            mobile: true,
            mobileOnly: true,
          },
          FORTMATIC: {
            connector: fortmatic,
            name: "Fortmatic",
            icon: FortmaticIcon,
            description: "Login using Fortmatic hosted wallet",
            href: null,
            color: "#6748FF",
            mobile: true,
          },
          Portis: {
            connector: portis,
            name: "Portis",
            icon: PortisIcon,
            description: "Login using Portis hosted wallet",
            href: null,
            color: "#4A6C9B",
            mobile: true,
          },
        },
      };

export const NetworkContextName = "NETWORK";

// default allowed slippage, in bips
export const INITIAL_ALLOWED_SLIPPAGE = 50;
// 20 minutes, denominated in seconds
export const DEFAULT_DEADLINE_FROM_NOW = 60 * 20;

// one basis point
export const ONE_BIPS = new Percent(JSBI.BigInt(1), JSBI.BigInt(10000));
export const BIPS_BASE = JSBI.BigInt(10000);
// used for warning states
export const ALLOWED_PRICE_IMPACT_LOW: Percent = new Percent(
  JSBI.BigInt(100),
  BIPS_BASE,
); // 1%
export const ALLOWED_PRICE_IMPACT_MEDIUM: Percent = new Percent(
  JSBI.BigInt(500),
  BIPS_BASE,
); // 5%
export const ALLOWED_PRICE_IMPACT_HIGH: Percent = new Percent(
  JSBI.BigInt(1000),
  BIPS_BASE,
); // 10%

// if the price slippage exceeds this number, force the user to type 'confirm' to execute
export const PRICE_IMPACT_WITHOUT_FEE_CONFIRM_MIN: Percent = new Percent(
  JSBI.BigInt(2500),
  BIPS_BASE,
); // 25%

// used to ensure the user doesn't send so much ETH so they end up with <.01
export const MIN_ETH: JSBI = JSBI.exponentiate(
  JSBI.BigInt(10),
  JSBI.BigInt(16),
); // .01 ETH
export const V1_TRADE_LINK_THRESHOLD = new Percent(
  JSBI.BigInt(75),
  JSBI.BigInt(10000),
);
