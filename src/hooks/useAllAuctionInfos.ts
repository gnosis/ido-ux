import { useEffect, useState } from 'react'

import { additionalServiceApi } from '../api'
import { PricePoint } from '../api/AdditionalServicesApi'

export interface AuctionInfo {
  addressAuctioningToken: string
  addressBiddingToken: string
  allowListManager: string
  allowListSigner: string
  auctionId: number
  chainId: String
  currentClearingPrice: number
  decimalsAuctioningToken: number
  decimalsBiddingToken: number
  endTimeTimestamp: number
  exactOrder: string
  interestScore: number
  isPrivateAuction: boolean
  minFundingThreshold: string
  minimumBiddingAmountPerOrder: string
  order: PricePoint
  orderCancellationEndDate: number
  startingTimestamp: number
  symbolAuctioningToken: string
  symbolBiddingToken: string
  hasParticipation: boolean
}

export const useAllAuctionInfo = (): Maybe<AuctionInfo[]> => {
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
        console.error('Error getting useAllAuctionInfo info', error)

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

export const useAllAuctionInfoWithParticipation = (account: string): Maybe<AuctionInfo[]> => {
  const [auctionInfo, setAllAuctions] = useState<Maybe<AuctionInfo[]>>(null)

  useEffect(() => {
    let cancelled = false

    const fetchApiData = async (): Promise<void> => {
      try {
        if (!additionalServiceApi) {
          throw new Error('missing dependencies in useAllAuctionInfoWithParticipation callback')
        }
        const auctionInfo = await additionalServiceApi.getAllAuctionDetailsWithUserParticipation(
          account,
        )
        if (cancelled) return
        setAllAuctions(auctionInfo)
      } catch (error) {
        setAllAuctions(null)
        console.error('Error getting all auction with participation info', error)

        if (cancelled) return
      }
    }
    fetchApiData()

    return (): void => {
      cancelled = true
    }
  }, [account, setAllAuctions])

  return auctionInfo
}
