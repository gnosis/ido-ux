import { useEffect, useState } from 'react'

import { additionalServiceApi } from '../api'
import { PricePoint } from '../api/AdditionalServicesApi'
import { CHAIN_ID } from '../constants/config'
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
  auctionInfo: Maybe<AuctionInfoDetail>
  loading: boolean
} => {
  const { auctionId, chainId = CHAIN_ID } = useSwapState()
  const [auctionInfo, setAuctionInfo] = useState<Maybe<AuctionInfoDetail>>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchApiData = async () => {
      try {
        if (!chainId || !auctionId) {
          return
        }
        setLoading(true)
        const params = {
          networkId: chainId,
          auctionId,
        }

        const auctionInfo = await additionalServiceApi.getAuctionDetails(params)
        setAuctionInfo(auctionInfo)
      } catch (error) {
        setAuctionInfo(null)
        console.error('Error getting auction details', error)
      }
      setLoading(false)
    }
    fetchApiData()
  }, [setAuctionInfo, auctionId, chainId])

  return { auctionInfo, loading }
}
