import { InjectedConnector } from "@web3-react/injected-connector";
import { WalletConnectConnector } from "@web3-react/walletconnect-connector";
import { WalletLinkConnector } from "@web3-react/walletlink-connector";
import { PortisConnector } from "@web3-react/portis-connector";
import { NetworkConnectorArguments } from "./NetworkConnector";
import { FortmaticConnector } from "./Fortmatic";
import { NetworkConnector } from "./NetworkConnector";

const POLLING_INTERVAL = 10000;
const NETWORK_URL_RINKEBY = process.env.REACT_APP_NETWORK_URL_RINKEBY;
const NETWORK_URL_MAINNET = process.env.REACT_APP_NETWORK_URL_MAINNET;
const NETWORK_URL_XDAI = process.env.REACT_APP_NETWORK_URL_XDAI;

const FORMATIC_KEY = process.env.REACT_APP_FORTMATIC_KEY;
const PORTIS_ID = process.env.REACT_APP_PORTIS_ID;

if (typeof NETWORK_URL_MAINNET === "undefined") {
  throw new Error(
    `REACT_APP_NETWORK_URL_MAINNET must be a defined environment variable`,
  );
}

const networkConnectorArguments: NetworkConnectorArguments = {
  urls: [],
  defaultChainId: 1,
};
networkConnectorArguments.urls[1] = NETWORK_URL_MAINNET;
if (NETWORK_URL_RINKEBY)
  networkConnectorArguments.urls[Number(4)] = NETWORK_URL_RINKEBY;
if (NETWORK_URL_XDAI) networkConnectorArguments.urls[100] = NETWORK_URL_XDAI;

export const network = new NetworkConnector(networkConnectorArguments);

export const injected = new InjectedConnector({
  supportedChainIds: [1, 3, 4, 5, 42, 100, 5777],
});

// mainnet only
export const walletconnect = new WalletConnectConnector({
  rpc: { 1: NETWORK_URL_MAINNET },
  bridge: "https://bridge.walletconnect.org",
  qrcode: false,
  pollingInterval: POLLING_INTERVAL,
});

// mainnet only
export const fortmatic = new FortmaticConnector({
  apiKey: FORMATIC_KEY ?? "",
  chainId: 1,
});

// mainnet only
export const portis = new PortisConnector({
  dAppId: PORTIS_ID ?? "",
  networks: [1],
});

// mainnet only
export const walletlink = new WalletLinkConnector({
  url: NETWORK_URL_MAINNET,
  appName: "Uniswap",
  appLogoUrl:
    "https://mpng.pngfly.com/20181202/bex/kisspng-emoji-domain-unicorn-pin-badges-sticker-unicorn-tumblr-emoji-unicorn-iphoneemoji-5c046729264a77.5671679315437924251569.jpg",
});
