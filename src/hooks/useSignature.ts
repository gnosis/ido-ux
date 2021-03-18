import { useEffect, useState } from 'react'

import { additionalServiceApi } from '../api'
import { CHAIN_ID } from '../constants/config'
import { useSwapState } from '../state/orderPlacement/hooks'
import { useActiveWeb3React } from './index'

export const useSignature = (): {
  hasSignature: Maybe<boolean>
  loading: boolean
} => {
  const { auctionId, chainId = CHAIN_ID } = useSwapState()
  const [hasSignature, setHasSignature] = useState<Maybe<boolean>>(null)
  const [loading, setLoading] = useState(true)

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

        const hasSignature = await additionalServiceApi.getSignature(params)
        setHasSignature(hasSignature)
      } catch (error) {
        setHasSignature(false)
        console.error('Error getting auction details', error)
      }
      setLoading(false)
    }
    fetchApiData()
  }, [account, setHasSignature, auctionId, chainId])

  return { hasSignature, loading }
}
