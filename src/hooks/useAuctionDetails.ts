import { useEffect, useState } from 'react'

import { additionalServiceApi } from '../api'
import { PricePoint } from '../api/AdditionalServicesApi'
import { useSwapState } from '../state/orderPlacement/hooks'

export interface AuctionInfoDetail {
  auctionId: number
  order: PricePoint
  symbolAuctioningToken: string
  symbolBiddingToken: string
  addressAuctioningToken: string
  addressBiddingToken: string
  decimalsAuctioningToken: string
  decimalsBiddingToken: string
  endTimeTimestamp: number
  startingTimestamp: number
  chainId: String
  minimumBiddingAmountPerOrder: string
  orderCancellationEndDate: number | undefined
  exactOrder: string
  isPrivateAuction: boolean
}

export const useAuctionDetails = (): {
  auctionDetails: Maybe<AuctionInfoDetail>
  auctionInfoLoading: boolean
} => {
  const { auctionId, chainId } = useSwapState()
  const [auctionInfo, setAuctionInfo] = useState<Maybe<AuctionInfoDetail>>(null)
  const [auctionInfoLoading, setLoading] = useState<boolean>(true)

  useEffect(() => {
    let cancelled = false
    setLoading(true)
    const fetchApiData = async () => {
      try {
        if (!chainId || !auctionId) {
          return
        }

        const params = {
          networkId: chainId,
          auctionId,
        }

        const auctionInfo = await additionalServiceApi.getAuctionDetails(params)
        if (!cancelled) {
          setLoading(false)

          setAuctionInfo(auctionInfo)
        }
      } catch (error) {
        if (cancelled) return
        setLoading(false)
        setAuctionInfo(null)
        console.error('Error getting auction details', error)
      }
    }
    fetchApiData()

    return (): void => {
      cancelled = true
    }
  }, [setAuctionInfo, auctionId, chainId])

  return { auctionDetails: auctionInfo, auctionInfoLoading }
}
