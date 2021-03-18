import React from 'react'

import { useAuctionDetails } from './useAuctionDetails'
import { useSignature } from './useSignature'

const useIsAuctionAllowListed = (): { isAuctionAllowListed: Maybe<boolean>; loading: boolean } => {
  const { auctionDetails, auctionInfoLoading } = useAuctionDetails()
  const { hasSignature, loading: loadingSignature } = useSignature()

  const [isAuctionAllowListed, setIsAuctionAllowListed] = React.useState<Maybe<boolean>>(true)

  React.useEffect(() => {
    if (auctionDetails && auctionDetails.isPrivateAuction && !auctionInfoLoading) {
      setIsAuctionAllowListed(auctionDetails.isPrivateAuction && !loadingSignature && hasSignature)
    }
  }, [auctionDetails, auctionInfoLoading, hasSignature, loadingSignature])

  return { isAuctionAllowListed, loading: auctionInfoLoading || loadingSignature }
}

export default useIsAuctionAllowListed
