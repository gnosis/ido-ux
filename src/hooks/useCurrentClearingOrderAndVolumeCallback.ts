import { useEffect, useMemo, useState } from 'react'

import { ClearingPriceAndVolumeData } from '../api/AdditionalServicesApi'
import { useSwapState } from '../state/orderPlacement/hooks'
import { additionalServiceApi } from './../api'

export function useClearingPriceInfo(): Maybe<ClearingPriceAndVolumeData> {
  const { auctionId, chainId } = useSwapState()
  const [clearingInfo, setClearingPriceAndVolume] = useState<Maybe<ClearingPriceAndVolumeData>>(
    null,
  )
  const [error, setError] = useState<Maybe<Error>>(null)

  useMemo(() => {
    setClearingPriceAndVolume(null)
    setError(null)
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
        if (cancelled) return
        console.error('Error getting clearing price info', error)
        setError(error)
      }
    }
    fetchApiData()

    return (): void => {
      cancelled = true
    }
  }, [chainId, auctionId, setClearingPriceAndVolume])

  if (error) {
    console.error('error while fetching price info', error)
    return null
  }

  return clearingInfo
}
