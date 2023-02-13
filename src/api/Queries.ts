export const GET_DETAILS_OF_MOST_INTERESTING_AUCTIONS = `
query DetailsOfMostInterestingAuctions($currentTimeStamp: BigInt, $count: Int) {
    auctionDetails(
    first: $count
    where: {endTimeTimestamp_gt: $currentTimeStamp}
    orderBy: interestScore
    ) {
        id
        chainId
        addressAuctioningToken
        addressBiddingToken
        allowListManger
        allowListSigner
        auctionId
        decimalsBiddingToken
        endTimeTimestamp
        decimalsAuctioningToken
        currentClearingPrice
        currentBiddingAmount
        interestScore
        isAtomicClosureAllowed
        minFundingThreshold
        isPrivateAuction
        minimumBiddingAmountPerOrder
        order {
            price
            volume
        }
        orderCancellationEndDate
        symbolAuctioningToken
        startingTimeStamp
        usdAmountTraded
        symbolBiddingToken
    }
}
`

export const GET_DETAILS_OF_MOST_INTERESTING_CLOSED_AUCTIONS = `
query DetailsOfMostInterestingClosedAuctions($currentTimeStamp: BigInt, $count: Int) {
    auctionDetails(
      first: $count
      where: {endTimeTimestamp_lt: $currentTimeStamp}
      orderBy: interestScore
      orderDirection: asc
    ) {
      id
      chainId
      addressAuctioningToken
      addressBiddingToken
      allowListManger
      allowListSigner
      auctionId
      decimalsBiddingToken
      endTimeTimestamp
      decimalsAuctioningToken
      currentClearingPrice
      currentBiddingAmount
      interestScore
      isAtomicClosureAllowed
      minFundingThreshold
      isPrivateAuction
      minimumBiddingAmountPerOrder
      order {
        price
        volume
      }
      orderCancellationEndDate
      symbolAuctioningToken
      startingTimeStamp
      usdAmountTraded
      symbolBiddingToken
    }
  }  
`

export const GET_ALL_AUCTION_DETAILS = `
query AllAuctionDetails {
    auctionDetails(orderBy: auctionId) {
      id
      chainId
      addressAuctioningToken
      addressBiddingToken
      allowListManger
      allowListSigner
      auctionId
      decimalsBiddingToken
      endTimeTimestamp
      decimalsAuctioningToken
      currentClearingPrice
      currentBiddingAmount
      interestScore
      isAtomicClosureAllowed
      minFundingThreshold
      isPrivateAuction
      minimumBiddingAmountPerOrder
      order {
        price
        volume
      }
      orderCancellationEndDate
      symbolAuctioningToken
      startingTimeStamp
      usdAmountTraded
      symbolBiddingToken
    }
  }
`
