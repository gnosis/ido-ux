export interface AdditionalServicesApi {
  getOrderBookUrl(params: OrderBookParams): string;
  getOrderBookData(params: OrderBookParams): Promise<OrderBookData>;
}

interface OrderBookParams {
  networkId: number;
  auctionId: number;
}

/**
 * Price point as defined in the API
 * Both price and volume are numbers (floats)
 */
export interface PricePoint {
  price: number;
  volume: number;
}

/**
 * DATA returned from api as JSON
 */
export interface OrderBookData {
  asks: PricePoint[];
  bids: PricePoint[];
}
export interface AdditionalServicesEndpoint {
  networkId: number;
  url_production: string;
  url_develop?: string;
}
function getAdditionalServiceUrl(baseUlr: string): string {
  return `${baseUlr}${baseUlr.endsWith("/") ? "" : "/"}api/v1/`;
}

export type AdditionalServicesApiParams = AdditionalServicesEndpoint[];

export class AdditionalServicesApiImpl implements AdditionalServicesApi {
  private urlsByNetwork: { [networkId: number]: string } = {};

  public constructor(params: AdditionalServicesApiParams) {
    params.forEach((endpoint) => {
      this.urlsByNetwork[endpoint.networkId] = getAdditionalServiceUrl(
        process.env.PRICE_ESTIMATOR_URL === "production"
          ? endpoint.url_production
          : endpoint.url_develop || endpoint.url_production, // fallback on required url_production
      );
    });
  }
  public getOrderBookUrl(params: OrderBookParams): string {
    const { networkId, auctionId } = params;

    const baseUrl = this._getBaseUrl(networkId);

    const url = `${baseUrl}get_order_book_display_data/${auctionId}`;
    return url;
  }

  public async getOrderBookData(
    params: OrderBookParams,
  ): Promise<OrderBookData> {
    try {
      const url = await this.getOrderBookUrl(params);

      const res = await fetch(url);
      if (!res.ok) {
        // backend returns {"message":"invalid url query"}
        // for bad requests
        throw await res.json();
      }
      return await res.json();
    } catch (error) {
      console.error(error);

      const { auctionId } = params;

      throw new Error(
        `Failed to query orderbook data for auction  id ${auctionId} : ${error.message}`,
      );
    }
  }

  private async query<T>(
    networkId: number,
    queryString: string,
  ): Promise<T | null> {
    const baseUrl = this._getBaseUrl(networkId);

    const url = baseUrl + queryString;

    const response = await fetch(url);

    if (!response.ok) {
      throw new Error(`Request failed: [${response.status}] ${response.body}`);
    }

    const body = await response.text();

    if (!body) {
      return null;
    }

    return JSON.parse(body);
  }

  private _getBaseUrl(networkId: number): string {
    const baseUrl = this.urlsByNetwork[networkId];
    if (typeof baseUrl === "undefined") {
      throw new Error(
        `REACT_APP_ADDITIONAL_SERVICES_API_URL must be a defined environment variable`,
      );
    }

    return baseUrl;
  }
}
