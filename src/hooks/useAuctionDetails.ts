import { useEffect, useState } from 'react'

import { additionalServiceApi } from '../api'
import { PricePoint } from '../api/AdditionalServicesApi'
import { useActiveWeb3React } from './index'

export interface AuctionInfoDetail {
  auctionId: number
  order: PricePoint
  symbolAuctioningToken: string
  symbolBiddingToken: string
  addressAuctioningToken: string
  addressBiddingToken: string
  decimalsAuctioningToken: number
  decimalsBiddingToken: number
  endTimeTimestamp: number
  startingTimestamp: number
  chainId: String
  minimumBiddingAmountPerOrder: string
  orderCancellationEndDate: number | undefined
  exactOrder: string
}

export const useAuctionDetails = (auctionId: number): Maybe<AuctionInfoDetail> => {
  const { chainId } = useActiveWeb3React()

  const [auctionInfo, setAuctionInfo] = useState<Maybe<AuctionInfoDetail>>(null)

  useEffect(() => {
    let cancelled = false

    const fetchApiData = async () => {
      try {
        if (!chainId) {
          throw new Error('missing dependencies in useAuctionDetails callback')
        }

        const params = {
          networkId: chainId,
          auctionId,
        }

        const auctionInfo = await additionalServiceApi.getAuctionDetails(params)
        if (!cancelled) {
          setAuctionInfo(auctionInfo)
        }
      } catch (error) {
        setAuctionInfo(null)
        console.error('Error getting auction details', error)
      }
    }
    fetchApiData()

    return (): void => {
      cancelled = true
    }
  }, [setAuctionInfo, auctionId, chainId])

  return auctionInfo
}
