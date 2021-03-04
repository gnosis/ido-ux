import { useEffect, useState } from 'react'

import { additionalServiceApi } from '../api'
import { PricePoint } from '../api/AdditionalServicesApi'

export interface AuctionInfo {
  auctionId: number
  order: PricePoint
  symbolAuctioningToken: string
  symbolBiddingToken: string
  addressAuctioningToken: string
  addressBiddingToken: string
  decimalsAuctioningToken: number
  decimalsBiddingToken: number
  endTimeTimestamp: number
  chainId: String
}

export function useAllAuctionInfo(): Maybe<AuctionInfo[]> {
  const [auctionInfo, setAllAuctions] = useState<Maybe<AuctionInfo[]>>(null)

  useEffect(() => {
    let cancelled = false

    const fetchApiData = async (): Promise<void> => {
      try {
        if (!additionalServiceApi) {
          throw new Error('missing dependencies in useAllAuctionInfo callback')
        }
        const auctionInfo = await additionalServiceApi.getAllAuctionDetails()
        if (cancelled) return
        setAllAuctions(auctionInfo)
      } catch (error) {
        setAllAuctions(null)
        console.error('Error getting clearing price info', error)

        if (cancelled) return
      }
    }
    fetchApiData()

    return (): void => {
      cancelled = true
    }
  }, [setAllAuctions])

  return auctionInfo
}
