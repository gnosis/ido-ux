import { useEffect, useState } from 'react'

import { additionalServiceApi } from './../api'
import { AuctionInfo } from './useAllAuctionInfos'

export function useInterestingAuctionInfo(): Maybe<AuctionInfo[]> {
  const [auctionInfo, setMostInterestingAuctions] = useState<Maybe<AuctionInfo[]>>(null)

  useEffect(() => {
    let cancelled = false

    const fetchApiData = async (): Promise<void> => {
      try {
        if (!additionalServiceApi) {
          throw new Error('missing dependencies in useInterestingAuctionInfo callback')
        }
        const auctionInfo = await additionalServiceApi.getMostInterestingAuctionDetails()
        if (!cancelled) {
          setMostInterestingAuctions(auctionInfo)
        }
      } catch (error) {
        if (!cancelled) {
          setMostInterestingAuctions(null)
          console.error('Error getting clearing price info', error)
        }
      }
    }
    fetchApiData()

    return (): void => {
      cancelled = true
    }
  }, [setMostInterestingAuctions])

  return auctionInfo
}
