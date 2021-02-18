import {
  AdditionalServicesApi,
  AdditionalServicesApiImpl,
  AdditionalServicesEndpoint,
} from './AdditionalServicesApi'

function createAdditionalServiceApi(): AdditionalServicesApi {
  const url_develop = process.env.REACT_APP_ADDITIONAL_SERVICES_API_URL
  const url_production = process.env.REACT_APP_ADDITIONAL_SERVICES_API_URL_PROD
  const config: AdditionalServicesEndpoint[] = [
    {
      networkId: 4,
      url_production,
      url_develop,
    },
  ]
  const dexPriceEstimatorApi = new AdditionalServicesApiImpl(config)

  window['dexPriceEstimatorApi'] = dexPriceEstimatorApi
  return dexPriceEstimatorApi
}

// Build APIs
export const additionalServiceApi: AdditionalServicesApi = createAdditionalServiceApi()
