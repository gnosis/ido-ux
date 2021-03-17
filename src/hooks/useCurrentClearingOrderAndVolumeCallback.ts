import { useEffect, useState } from 'react'

import { ClearingPriceAndVolumeData } from '../api/AdditionalServicesApi'
import { useSwapState } from '../state/orderPlacement/hooks'
import { additionalServiceApi } from './../api'

export const useClearingPriceInfo = (): {
  clearingPriceInfo: Maybe<ClearingPriceAndVolumeData>
  loadingClearingPrice: boolean
} => {
  const { auctionId, chainId } = useSwapState()
  const [clearingInfo, setClearingPriceAndVolume] = useState<Maybe<ClearingPriceAndVolumeData>>(
    null,
  )
  const [loading, setLoading] = useState<boolean>(true)

  useEffect(() => {
    setClearingPriceAndVolume(null)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [auctionId, chainId])

  useEffect(() => {
    let cancelled = false
    setLoading(true)
    const fetchApiData = async () => {
      try {
        if (!chainId || !auctionId || !additionalServiceApi) {
          return
        }
        const clearingOrderAndVolume = await additionalServiceApi.getClearingPriceOrderAndVolume({
          networkId: chainId,
          auctionId,
        })
        if (!cancelled) {
          setLoading(false)
          setClearingPriceAndVolume(clearingOrderAndVolume)
        }
      } catch (error) {
        setLoading(false)
        setClearingPriceAndVolume(null)
        console.error('Error getting clearing price info', error)
      }
    }
    fetchApiData()

    return (): void => {
      cancelled = true
    }
  }, [chainId, auctionId, setClearingPriceAndVolume])

  return {
    clearingPriceInfo: clearingInfo,
    loadingClearingPrice: loading,
  }
}
