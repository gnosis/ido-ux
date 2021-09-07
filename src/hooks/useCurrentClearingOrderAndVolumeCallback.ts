import { useEffect, useState } from 'react'

import { ClearingPriceAndVolumeData } from '../api/AdditionalServicesApi'
import { AuctionIdentifier } from '../state/orderPlacement/reducer'
import { getLogger } from '../utils/logger'
import { additionalServiceApi } from './../api'

const logger = getLogger('useCurrentClearingOrderAndVolumeCallback')

export const useClearingPriceInfo = (
  auctionIdentifer: AuctionIdentifier,
): {
  clearingPriceInfo: Maybe<ClearingPriceAndVolumeData> | undefined
  loadingClearingPrice: boolean
} => {
  const { auctionId, chainId } = auctionIdentifer
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
        logger.error('Error getting clearing price info', error)
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
