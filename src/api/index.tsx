import {
  API_URL_DEVELOP_GOERLI,
  API_URL_DEVELOP_MAINNET,
  API_URL_DEVELOP_POLYGON,
  API_URL_DEVELOP_XDAI,
  API_URL_PRODUCTION_GOERLI,
  API_URL_PRODUCTION_MAINNET,
  API_URL_PRODUCTION_POLYGON,
  API_URL_PRODUCTION_XDAI,
  GRAPH_API_URL_DEVELOP_GOERLI,
  GRAPH_API_URL_DEVELOP_MAINNET,
  GRAPH_API_URL_DEVELOP_POLYGON,
  GRAPH_API_URL_DEVELOP_XDAI,
  GRAPH_API_URL_PRODUCTION_GOERLI,
  GRAPH_API_URL_PRODUCTION_MAINNET,
  GRAPH_API_URL_PRODUCTION_POLYGON,
  GRAPH_API_URL_PRODUCTION_XDAI,
} from '../constants/config'
import {
  AdditionalServicesApi,
  AdditionalServicesApiImpl,
  AdditionalServicesEndpoint,
} from './AdditionalServicesApi'
import { TokenLogosServiceApi, TokenLogosServiceApiInterface } from './TokenLogosServiceApi'

function createAdditionalServiceApi(): AdditionalServicesApi {
  const config: AdditionalServicesEndpoint[] = [
    {
      networkId: 100,
      url_production: API_URL_PRODUCTION_XDAI,
      url_develop: API_URL_DEVELOP_XDAI,
      graph_url_production: GRAPH_API_URL_PRODUCTION_XDAI,
      graph_url_develop: GRAPH_API_URL_DEVELOP_XDAI,
    },
    {
      networkId: 1,
      url_production: API_URL_PRODUCTION_MAINNET,
      url_develop: API_URL_DEVELOP_MAINNET,
      graph_url_production: GRAPH_API_URL_PRODUCTION_MAINNET,
      graph_url_develop: GRAPH_API_URL_DEVELOP_MAINNET,
    },
    {
      networkId: 137,
      url_production: API_URL_PRODUCTION_POLYGON,
      url_develop: API_URL_DEVELOP_POLYGON,
      graph_url_production: GRAPH_API_URL_PRODUCTION_POLYGON,
      graph_url_develop: GRAPH_API_URL_DEVELOP_POLYGON,
    },
  ]
  if (API_URL_DEVELOP_GOERLI)
    config.push({
      networkId: 5,
      url_production: API_URL_PRODUCTION_GOERLI,
      url_develop: API_URL_DEVELOP_GOERLI,
      graph_url_production: GRAPH_API_URL_PRODUCTION_GOERLI,
      graph_url_develop: GRAPH_API_URL_DEVELOP_GOERLI,
    })
  const dexPriceEstimatorApi = new AdditionalServicesApiImpl(config)

  window['dexPriceEstimatorApi'] = dexPriceEstimatorApi
  return dexPriceEstimatorApi
}

// Build APIs
export const additionalServiceApi: AdditionalServicesApi = createAdditionalServiceApi()
export const tokenLogosServiceApi: TokenLogosServiceApiInterface = new TokenLogosServiceApi()
