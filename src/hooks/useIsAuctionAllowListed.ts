import React from 'react'

import { useAuctionDetails } from './useAuctionDetails'
import { useSignature } from './useSignature'

const useIsAuctionAllowListed = (): { isAuctionAllowListed: Maybe<boolean>; loading: boolean } => {
  const { auctionInfo, loading: loadingAuctionDetails } = useAuctionDetails()
  const { hasSignature, loading: loadingSignature } = useSignature()

  const [isAuctionAllowListed, setIsAuctionAllowListed] = React.useState<Maybe<boolean>>(true)

  React.useEffect(() => {
    if (auctionInfo && auctionInfo.isPrivateAuction && !loadingAuctionDetails) {
      setIsAuctionAllowListed(auctionInfo.isPrivateAuction && !loadingSignature && hasSignature)
    }
  }, [auctionInfo, loadingAuctionDetails, hasSignature, loadingSignature])

  return { isAuctionAllowListed, loading: loadingAuctionDetails || loadingSignature }
}

export default useIsAuctionAllowListed
