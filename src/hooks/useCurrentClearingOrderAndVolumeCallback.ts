import { useEffect, useState } from 'react'

import { ClearingPriceAndVolumeData } from '../api/AdditionalServicesApi'
import { useSwapState } from '../state/orderPlacement/hooks'
import { additionalServiceApi } from './../api'

export const useClearingPriceInfo = (): Maybe<ClearingPriceAndVolumeData> => {
  const { auctionId, chainId } = useSwapState()
  const [clearingInfo, setClearingPriceAndVolume] = useState<Maybe<ClearingPriceAndVolumeData>>(
    null,
  )

  useEffect(() => {
    setClearingPriceAndVolume(null)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [auctionId, chainId])

  useEffect(() => {
    let cancelled = false

    const fetchApiData = async () => {
      try {
        if (!chainId || !additionalServiceApi) {
          throw new Error('missing dependencies in useClearingPriceInfo callback')
        }
        const clearingOrderAndVolume = await additionalServiceApi.getClearingPriceOrderAndVolume({
          networkId: chainId,
          auctionId,
        })
        if (!cancelled) {
          setClearingPriceAndVolume(clearingOrderAndVolume)
        }
      } catch (error) {
        setClearingPriceAndVolume(null)
        console.error('Error getting clearing price info', error)
      }
    }
    fetchApiData()

    return (): void => {
      cancelled = true
    }
  }, [chainId, auctionId, setClearingPriceAndVolume])

  return clearingInfo
}
