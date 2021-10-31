import { useEffect, useState } from 'react'

import { additionalServiceApi } from '../api'
import { PricePoint } from '../api/AdditionalServicesApi'
import { AuctionIdentifier } from '../state/orderPlacement/reducer'
import { getLogger } from '../utils/logger'

const logger = getLogger('useAuctionDetails')

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
  isAtomicClosureAllowed: boolean
  currentBiddingAmount: string
  minFundingThreshold: string
  allowListManager: string
  allowListSigner: string
}

export const useAuctionDetails = (
  auctionIdentifier: AuctionIdentifier,
): {
  auctionDetails: Maybe<AuctionInfoDetail>
  auctionInfoLoading: boolean
} => {
  const { auctionId, chainId } = auctionIdentifier
  const [auctionInfo, setAuctionInfo] = useState<Maybe<AuctionInfoDetail>>(null)
  const [auctionInfoLoading, setLoading] = useState<boolean>(true)

  useEffect(() => {
    let cancelled = false
    const fetchApiData = async () => {
      try {
        if (!chainId || !auctionId) {
          return
        }
        if (!cancelled) {
          setLoading(true)
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
        if (!cancelled) {
          setLoading(false)
          setAuctionInfo(null)
          logger.error('Error getting auction details', error)
        }
      }
    }
    fetchApiData()

    return (): void => {
      cancelled = true
    }
  }, [setAuctionInfo, auctionId, chainId])

  return { auctionDetails: auctionInfo, auctionInfoLoading }
}
