import { useEffect, useState } from 'react'

import { additionalServiceApi } from '../api'
import { useSwapState } from '../state/orderPlacement/hooks'
import { useActiveWeb3React } from './index'

export const useSignature = (): {
  signature: Maybe<string>
  loading: boolean
} => {
  const { auctionId, chainId } = useSwapState()
  const [signature, setSignature] = useState<Maybe<string>>(null)
  const [loading, setLoading] = useState(false)

  const { account } = useActiveWeb3React()

  useEffect(() => {
    const fetchApiData = async () => {
      try {
        if (!chainId || !auctionId || !account) {
          return
        }
        setLoading(true)

        const params = {
          networkId: chainId,
          auctionId: auctionId,
          address: account,
        }
        const signature = await additionalServiceApi.getSignature(params)
        setSignature(signature)
        setLoading(false)
      } catch (error) {
        setSignature(null)
        console.error('Error getting auction details', error)
      }
    }
    fetchApiData()
  }, [account, setSignature, auctionId, chainId])

  return { signature, loading }
}
