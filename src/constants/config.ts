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

// Network default
export const CHAIN_ID = Number(process.env.REACT_APP_CHAIN_ID || 1)

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
