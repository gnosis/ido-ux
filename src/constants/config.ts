// Export env vars
export const PUBLIC_URL = process.env.PUBLIC_URL

// API endpoints for several environments
export const API_URL_DEVELOP_RINKEBY = process.env.REACT_APP_ADDITIONAL_SERVICES_API_URL_RINKEBY
export const API_URL_PRODUCTION_RINKEBY =
  process.env.REACT_APP_ADDITIONAL_SERVICES_API_URL_PROD_RINKEBY
export const API_URL_DEVELOP_MAINNET = process.env.REACT_APP_ADDITIONAL_SERVICES_API_URL_MAINNET
export const API_URL_PRODUCTION_MAINNET =
  process.env.REACT_APP_ADDITIONAL_SERVICES_API_URL_PROD_MAINNET
export const API_URL_DEVELOP_XDAI = process.env.REACT_APP_ADDITIONAL_SERVICES_API_URL_XDAI
export const API_URL_PRODUCTION_XDAI = process.env.REACT_APP_ADDITIONAL_SERVICES_API_URL_PROD_XDAI

// Infura bridges like 'https://mainnet.infura.io/v3/...'
export const NETWORK_URL_RINKEBY = process.env.REACT_APP_NETWORK_URL_RINKEBY || ''
export const NETWORK_URL_MAINNET = process.env.REACT_APP_NETWORK_URL_MAINNET || ''
export const NETWORK_URL_XDAI =
  process.env.REACT_APP_NETWORK_URL_XDAI || 'https://rpc.xdaichain.com/'

// Wallet connect keys
export const FORTMATIC_KEY = process.env.REACT_APP_FORTMATIC_KEY || ''
export const PORTIS_ID = process.env.REACT_APP_PORTIS_ID || ''

// Other stuff
export const GOOGLE_ANALYTICS_ID = process.env.REACT_APP_GOOGLE_ANALYTICS_ID || ''
export const GIT_COMMIT_HASH = process.env.REACT_APP_GIT_COMMIT_HASH || ''

export const MAX_DECIMALS_PRICE_FORMAT = 12
export const NUMBER_OF_DIGITS_FOR_INVERSION = 6

export const STABLE_TOKENS_FOR_INVERTED_CHARTS = [
  '0x6B175474E89094C44Da98b954EedeAC495271d0F',
  '0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48',
  '0xdAC17F958D2ee523a2206206994597C13D831ec7',
  '0x5592EC0cfb4dbc12D3aB100b257153436a1f0FEa',
]
