import { useEffect, useState } from 'react'

import { additionalServiceApi } from '../api'
import { AuctionIdentifier } from '../state/orderPlacement/reducer'
import { getLogger } from '../utils/logger'

const logger = getLogger('useSignature')

export const useSignature = (
  auctionIdentifier: AuctionIdentifier,
  account: string | null | undefined,
): {
  signature: Maybe<string>
} => {
  const { auctionId, chainId } = auctionIdentifier
  const [signature, setSignature] = useState<Maybe<string>>(null)

  useEffect(() => {
    let cancelled = false
    const fetchApiData = async () => {
      if (!chainId || !auctionId || !account) {
        return
      }
      const params = {
        networkId: chainId,
        auctionId: auctionId,
        address: account,
      }
      try {
        const signature = await additionalServiceApi.getSignature(params)

        if (cancelled) return
        setSignature(signature)
      } catch (error) {
        if (!cancelled) return
        setSignature(null)
        logger.error('Error getting auction details', error)
      }
    }
    fetchApiData()

    return (): void => {
      cancelled = true
    }
  }, [account, setSignature, auctionId, chainId])

  return { signature }
}
