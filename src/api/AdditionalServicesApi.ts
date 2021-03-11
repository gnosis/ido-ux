import { BigNumber } from '@ethersproject/bignumber'

import { Order, decodeOrder, encodeOrder } from '../hooks/Order'
import { AuctionInfo } from '../hooks/useAllAuctionInfos'
import { AuctionInfoDetail } from '../hooks/useAuctionDetails'

export interface AdditionalServicesApi {
  getOrderBookUrl(params: OrderBookParams): string
  getOrderBookData(params: OrderBookParams): Promise<OrderBookData>
  getPreviousOrderUrl(params: PreviousOrderParams): string
  getPreviousOrder(params: PreviousOrderParams): Promise<string>
  getCurrentUserOrdersUrl(params: UserOrderParams): string
  getCurrentUserOrders(params: UserOrderParams): Promise<string[]>
  getAllUserOrdersUrl(params: UserOrderParams): string
  getAllUserOrders(params: UserOrderParams): Promise<string[]>
  getMostInterestingAuctionDetailsUrl(params: InterestingAuctionParams): string
  getMostInterestingAuctionDetails(): Promise<AuctionInfo[]>
  getAllAuctionDetailsUrl(networkId: number): string
  getAllAuctionDetails(): Promise<AuctionInfo[]>
  getClearingPriceOrderAndVolumeUrl(params: OrderBookParams): string
  getClearingPriceOrderAndVolume(params: OrderBookParams): Promise<ClearingPriceAndVolumeData>
  getAuctionDetails(params: AuctionDetailParams): Promise<AuctionInfoDetail>
}

interface OrderBookParams {
  networkId: number
  auctionId: number
}

interface InterestingAuctionParams {
  networkId: number
  numberOfAuctions: number
}

interface PreviousOrderParams {
  networkId: number
  auctionId: number
  order: Order
}

interface UserOrderParams {
  networkId: number
  auctionId: number
  user: string
}

interface AuctionDetailParams {
  networkId: number
  auctionId: number
}

/**
 * Price point as defined in the API
 * Both price and volume are numbers (floats)
 */
export interface PricePoint {
  price: number
  volume: number
}

/**
 * DATA returned from api as JSON
 */
export interface OrderBookData {
  asks: PricePoint[]
  bids: PricePoint[]
}

export interface ClearingPriceAndVolumeData {
  clearingOrder: Order
  volume: BigNumber
}
export interface AdditionalServicesEndpoint {
  networkId: number
  url_production: string
  url_develop?: string
}
function getAdditionalServiceUrl(baseUrl: string): string {
  return `${baseUrl}${baseUrl.endsWith('/') ? '' : '/'}api/v1/`
}

export type AdditionalServicesApiParams = AdditionalServicesEndpoint[]

export class AdditionalServicesApiImpl implements AdditionalServicesApi {
  private urlsByNetwork: { [networkId: number]: string } = {}

  public constructor(params: AdditionalServicesApiParams) {
    params.forEach((endpoint) => {
      if (endpoint.url_develop || endpoint.url_production) {
        this.urlsByNetwork[endpoint.networkId] = getAdditionalServiceUrl(
          process.env.PRICE_ESTIMATOR_URL === 'production'
            ? endpoint.url_production
            : endpoint.url_develop || endpoint.url_production, // fallback on required url_production
        )
      }
    })
  }
  public getOrderBookUrl(params: OrderBookParams): string {
    const { auctionId, networkId } = params

    const baseUrl = this._getBaseUrl(networkId)

    const url = `${baseUrl}get_order_book_display_data/${auctionId}`
    return url
  }

  public getClearingPriceOrderAndVolumeUrl(params: OrderBookParams): string {
    const { auctionId, networkId } = params

    const baseUrl = this._getBaseUrl(networkId)

    const url = `${baseUrl}get_clearing_order_and_volume/${auctionId}`
    return url
  }

  public getPreviousOrderUrl(params: PreviousOrderParams): string {
    const { auctionId, networkId, order } = params

    const baseUrl = this._getBaseUrl(networkId)

    const url = `${baseUrl}get_previous_order/${auctionId}/${encodeOrder(order)}`
    return url
  }

  public getAllUserOrdersUrl(params: UserOrderParams): string {
    const { auctionId, networkId, user } = params

    const baseUrl = this._getBaseUrl(networkId)

    const url = `${baseUrl}get_user_orders/${auctionId}/${user}`
    return url
  }

  public getMostInterestingAuctionDetailsUrl(params: InterestingAuctionParams): string {
    const { networkId, numberOfAuctions } = params

    const baseUrl = this._getBaseUrl(networkId)

    const url = `${baseUrl}get_details_of_most_interesting_auctions/${numberOfAuctions}`
    return url
  }

  public getAllAuctionDetailsUrl(networkId: number): string {
    const baseUrl = this._getBaseUrl(networkId)

    const url = `${baseUrl}get_all_auction_with_details/`
    return url
  }

  public getAuctionDetailsUrl(params: AuctionDetailParams): string {
    const { auctionId, networkId } = params
    const baseUrl = this._getBaseUrl(networkId)

    return `${baseUrl}get_auction_with_details/${auctionId}`
  }

  public getCurrentUserOrdersUrl(params: UserOrderParams): string {
    const { auctionId, networkId, user } = params

    const baseUrl = this._getBaseUrl(networkId)

    const url = `${baseUrl}get_user_orders_without_canceled_or_claimed/${auctionId}/${user}`
    return url
  }

  public async getAllAuctionDetails(): Promise<Maybe<AuctionInfo[]>> {
    try {
      const promises: Promise<Response>[] = []
      for (const networkId in this.urlsByNetwork) {
        const url = await this.getAllAuctionDetailsUrl(Number(networkId))

        promises.push(fetch(url))
      }
      const results = await Promise.all(promises)
      const allAuctions = []
      for (const res of results) {
        if (!res.ok) {
          // backend returns {"message":"invalid url query"}
          // for bad requests
          throw await res.json()
        }
        allAuctions.push(await res.json())
      }
      return allAuctions.flat()
    } catch (error) {
      console.error(error)

      throw new Error(`Failed to query all auctions: ${error.message}`)
    }
  }

  public async getAuctionDetails(params: AuctionDetailParams): Promise<AuctionInfoDetail> {
    try {
      const url = await this.getAuctionDetailsUrl(params)

      const res = await fetch(url)
      if (!res.ok) {
        // backend returns {"message":"invalid url query"}
        // for bad requests
        throw await res.json()
      }
      return res.json()
    } catch (error) {
      console.error(error)

      const { auctionId } = params

      throw new Error(
        `Failed to query auction details for auction  id ${auctionId} : ${error.message}`,
      )
    }
  }

  public async getMostInterestingAuctionDetails(): Promise<Maybe<AuctionInfo[]>> {
    try {
      const promises: Promise<Response>[] = []
      for (const networkId in this.urlsByNetwork) {
        const url = await this.getMostInterestingAuctionDetailsUrl({
          networkId: Number(networkId),
          numberOfAuctions: 3,
        })

        promises.push(fetch(url))
      }
      const results = await Promise.all(promises)
      const allInterestingAuctions = []
      for (const res of results) {
        if (!res.ok) {
          // backend returns {"message":"invalid url query"}
          // for bad requests
          throw await res.json()
        }
        allInterestingAuctions.push(await res.json())
      }

      const allInterestingAuctionsOrdered = allInterestingAuctions.sort(
        (auctionA, auctionB) => auctionB.interestScore - auctionA.interestScore,
      )
      return allInterestingAuctionsOrdered.flat()
    } catch (error) {
      console.error(error)
      throw new Error(`Failed to query interesting auctions: ${error.message}`)
    }
  }

  public async getPreviousOrder(params: PreviousOrderParams): Promise<string> {
    try {
      const url = await this.getPreviousOrderUrl(params)

      const res = await fetch(url)
      if (!res.ok) {
        // backend returns {"message":"invalid url query"}
        // for bad requests
        throw await res.json()
      }
      return await res.json()
    } catch (error) {
      console.error(error)

      const { auctionId, order } = params

      throw new Error(
        `Failed to query previous order for auction id ${auctionId} and order ${encodeOrder(
          order,
        )}: ${error.message}`,
      )
    }
  }

  public async getAllUserOrders(params: UserOrderParams): Promise<string[]> {
    try {
      const url = await this.getAllUserOrdersUrl(params)

      const res = await fetch(url)
      if (!res.ok) {
        // backend returns {"message":"invalid url query"}
        // for bad requests
        throw await res.json()
      }
      return await res.json()
    } catch (error) {
      console.error(error)

      const { auctionId, user } = params

      throw new Error(
        `Failed to query previous order for auction id ${auctionId} and order ${user}: ${error.message}`,
      )
    }
  }
  public async getCurrentUserOrders(params: UserOrderParams): Promise<string[]> {
    try {
      const url = await this.getCurrentUserOrdersUrl(params)

      const res = await fetch(url)
      if (!res.ok) {
        // backend returns {"message":"invalid url query"}
        // for bad requests
        throw await res.json()
      }
      return await res.json()
    } catch (error) {
      console.error(error)

      const { auctionId, user } = params

      throw new Error(
        `Failed to query previous order for auction id ${auctionId} and order ${user}: ${error.message}`,
      )
    }
  }

  public async getClearingPriceOrderAndVolume(
    params: OrderBookParams,
  ): Promise<ClearingPriceAndVolumeData> {
    try {
      const url = await this.getClearingPriceOrderAndVolumeUrl(params)

      const res = await fetch(url)
      if (!res.ok) {
        // backend returns {"message":"invalid url query"}
        // for bad requests
        throw await res.json()
      }
      const result = await res.json()
      return {
        clearingOrder: decodeOrder(result[0]),
        volume: BigNumber.from(result[1]),
      }
    } catch (error) {
      console.error(error)

      const { auctionId } = params

      throw new Error(
        `Failed to query clearing price order for auction  id ${auctionId} : ${error.message}`,
      )
    }
  }

  public async getOrderBookData(params: OrderBookParams): Promise<OrderBookData> {
    try {
      const url = await this.getOrderBookUrl(params)

      const res = await fetch(url)
      if (!res.ok) {
        // backend returns {"message":"invalid url query"}
        // for bad requests
        throw await res.json()
      }
      return await res.json()
    } catch (error) {
      console.error(error)

      const { auctionId } = params

      throw new Error(
        `Failed to query orderbook data for auction  id ${auctionId} : ${error.message}`,
      )
    }
  }

  private async query<T>(networkId: number, queryString: string): Promise<Maybe<T>> {
    const baseUrl = this._getBaseUrl(networkId)

    const url = baseUrl + queryString

    const response = await fetch(url)

    if (!response.ok) {
      throw new Error(`Request failed: [${response.status}] ${response.body}`)
    }

    const body = await response.text()

    if (!body) {
      return null
    }

    return JSON.parse(body)
  }

  private _getBaseUrl(networkId: number): string {
    const baseUrl = this.urlsByNetwork[networkId]
    if (typeof baseUrl === 'undefined') {
      throw new Error(
        `REACT_APP_ADDITIONAL_SERVICES_API_URL must be a defined environment variable for network ${networkId}`,
      )
    }

    return baseUrl
  }
}
