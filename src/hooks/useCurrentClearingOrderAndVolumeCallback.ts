import { useEffect, useMemo, useState } from 'react'

import { ClearingPriceAndVolumeData } from '../api/AdditionalServicesApi'
import { useSwapState } from '../state/orderPlacement/hooks'
import { additionalServiceApi } from './../api'

export function useClearingPriceInfo(): Maybe<ClearingPriceAndVolumeData> {
  const { auctionId, chainId } = useSwapState()
  const [clearingInfo, setClearingPriceAndVolume] = useState<Maybe<ClearingPriceAndVolumeData>>(
    null,
  )

  useMemo(() => {
    setClearingPriceAndVolume(null)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [auctionId, chainId])

  useEffect(() => {
    let cancelled = false

    const fetchApiData = async (): Promise<void> => {
      try {
        if (!chainId || !additionalServiceApi) {
          throw new Error('missing dependencies in useClearingPriceInfo callback')
        }
        const clearingOrderAndVolume = await additionalServiceApi.getClearingPriceOrderAndVolume({
          networkId: chainId,
          auctionId,
        })
        if (cancelled) return
        setClearingPriceAndVolume(clearingOrderAndVolume)
      } catch (error) {
        setClearingPriceAndVolume(null)
        console.error('Error getting clearing price info', error)

        if (cancelled) return
      }
    }
    fetchApiData()

    return (): void => {
      cancelled = true
    }
  }, [chainId, auctionId, setClearingPriceAndVolume])

  return clearingInfo
}
