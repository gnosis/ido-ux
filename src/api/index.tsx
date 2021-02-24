import {
  AdditionalServicesApi,
  AdditionalServicesApiImpl,
  AdditionalServicesEndpoint,
} from './AdditionalServicesApi'

function createAdditionalServiceApi(): AdditionalServicesApi {
  const url_develop_rinkeby = process.env.REACT_APP_ADDITIONAL_SERVICES_API_URL_RINKEBY
  const url_production_rinkeby = process.env.REACT_APP_ADDITIONAL_SERVICES_API_URL_PROD_RINKEBY

  const url_develop_mainnet = process.env.REACT_APP_ADDITIONAL_SERVICES_API_URL_MAINNET
  const url_production_mainnet = process.env.REACT_APP_ADDITIONAL_SERVICES_API_URL_PROD_MAINNET

  const url_develop_xdai = process.env.REACT_APP_ADDITIONAL_SERVICES_API_URL_XDAI
  const url_production_xdai = process.env.REACT_APP_ADDITIONAL_SERVICES_API_URL_PROD_XDAI
  const config: AdditionalServicesEndpoint[] = [
    {
      networkId: 4,
      url_production: url_production_rinkeby,
      url_develop: url_develop_rinkeby,
    },
    {
      networkId: 100,
      url_production: url_production_xdai,
      url_develop: url_develop_xdai,
    },
    {
      networkId: 1,
      url_production: url_production_mainnet,
      url_develop: url_develop_mainnet,
    },
  ]
  const dexPriceEstimatorApi = new AdditionalServicesApiImpl(config)

  window['dexPriceEstimatorApi'] = dexPriceEstimatorApi
  return dexPriceEstimatorApi
}

// Build APIs
export const additionalServiceApi: AdditionalServicesApi = createAdditionalServiceApi()
