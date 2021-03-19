import React from 'react'

import { useAuctionDetails } from './useAuctionDetails'
import { useSignature } from './useSignature'

const useIsAuctionAllowListed = (): { isAuctionAllowListed: Maybe<boolean>; loading: boolean } => {
  const { auctionDetails, auctionInfoLoading } = useAuctionDetails()
  const { loading: loadingSignature, signature } = useSignature()

  const [isAuctionAllowListed, setIsAuctionAllowListed] = React.useState<Maybe<boolean>>(true)

  React.useEffect(() => {
    if (auctionDetails && auctionDetails.isPrivateAuction && !auctionInfoLoading) {
      setIsAuctionAllowListed(auctionDetails.isPrivateAuction && !loadingSignature && !!signature)
    }
  }, [auctionDetails, auctionInfoLoading, signature, loadingSignature])

  return { isAuctionAllowListed, loading: auctionInfoLoading || loadingSignature }
}

export default useIsAuctionAllowListed
