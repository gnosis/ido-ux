import { useEffect, useState } from 'react'

import { additionalServiceApi } from '../api'
import { AuctionIdentifier } from '../state/orderPlacement/reducer'

export const useSignature = (
  auctionIdentifier: AuctionIdentifier,
  account: string | null | undefined,
): {
  signature: Maybe<string>
  loading: boolean
} => {
  const { auctionId, chainId } = auctionIdentifier
  const [signature, setSignature] = useState<Maybe<string>>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let cancelled = false
    const fetchApiData = async () => {
      if (!chainId || !auctionId || !account) {
        return
      }
      setLoading(true)
      const params = {
        networkId: chainId,
        auctionId: auctionId,
        address: account,
      }
      try {
        console.log('making api requet')
        const signature = await additionalServiceApi.getSignature(params)
        console.log('processing answer', signature)

        if (cancelled) return
        setLoading(false)
        setSignature(signature)
      } catch (error) {
        if (!cancelled) return
        setSignature(null)
        console.error('Error getting auction details', error)
        setLoading(false)
      }
    }
    fetchApiData()

    return (): void => {
      cancelled = true
    }
  }, [account, setSignature, auctionId, chainId])

  return { signature, loading }
}
