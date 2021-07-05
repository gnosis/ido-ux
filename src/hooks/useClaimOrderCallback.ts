import { useCallback, useEffect, useMemo, useState } from 'react'
import { Token, TokenAmount } from 'uniswap-xdai-sdk'

import { BigNumber } from '@ethersproject/bignumber'
import { Contract } from '@ethersproject/contracts'

import { DerivedAuctionInfo } from '../state/orderPlacement/hooks'
import { AuctionIdentifier } from '../state/orderPlacement/reducer'
import { useHasPendingClaim, useTransactionAdder } from '../state/transactions/hooks'
import { ChainId, calculateGasMargin, getEasyAuctionContract } from '../utils'
import { getLogger } from '../utils/logger'
import { additionalServiceApi } from './../api'
import { Order, decodeOrder } from './Order'
import { useActiveWeb3React } from './index'
import { useAuctionDetails } from './useAuctionDetails'
import { useGasPrice } from './useGasPrice'

const logger = getLogger('useClaimOrderCallback')

export const queueStartElement =
  '0x0000000000000000000000000000000000000000000000000000000000000001'
export const queueLastElement = '0xffffffffffffffffffffffffffffffffffffffff000000000000000000000001'

export interface AuctionProceedings {
  claimableBiddingToken: Maybe<TokenAmount>
  claimableAuctioningToken: Maybe<TokenAmount>
}

export interface ClaimInformation {
  sellOrdersFormUser: string[]
}

export interface UseGetClaimInfoReturn {
  claimInfo: Maybe<ClaimInformation>
  loading: boolean
  error: Maybe<Error>
}

export enum ClaimState {
  UNKNOWN,
  NOT_APPLICABLE,
  NOT_CLAIMED,
  PENDING,
  CLAIMED,
}

// returns the coded orders that participated in the auction for the current account
export const useGetClaimInfo = (auctionIdentifier: AuctionIdentifier): UseGetClaimInfoReturn => {
  const { account, library } = useActiveWeb3React()
  const [claimInfo, setClaimInfo] = useState<ClaimInformation>({ sellOrdersFormUser: [] })
  const [error, setError] = useState<Maybe<Error>>(null)
  const [loading, setLoading] = useState<boolean>(false)
  const { auctionId, chainId } = auctionIdentifier

  useEffect(() => {
    setClaimInfo({ sellOrdersFormUser: [] })
    setError(null)
    setLoading(false)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [auctionId, chainId])

  useEffect(() => {
    let cancelled = false

    const fetchApiData = async (): Promise<void> => {
      try {
        if (!chainId || !library || !account || !auctionId || !additionalServiceApi) return

        if (!cancelled) {
          setLoading(true)
        }

        const sellOrdersFormUser = await additionalServiceApi.getAllUserOrders({
          networkId: chainId,
          auctionId,
          user: account,
        })

        if (!cancelled) {
          setClaimInfo({ sellOrdersFormUser })
          setLoading(false)
        }
      } catch (error) {
        if (cancelled) return
        setError(error)
      }
    }
    fetchApiData()

    return (): void => {
      cancelled = true
    }
  }, [account, chainId, library, auctionId, setClaimInfo])

  return {
    claimInfo,
    loading,
    error,
  }
}

interface getClaimableDataProps {
  auctioningToken: Token
  biddingToken: Token
  clearingPriceOrder: Order
  ordersFromUser: string[]
  minFundingThresholdNotReached: boolean
  clearingPriceVolume: BigNumber
}
export const getClaimableData = ({
  auctioningToken,
  biddingToken,
  clearingPriceOrder,
  clearingPriceVolume,
  minFundingThresholdNotReached,
  ordersFromUser,
}: getClaimableDataProps): Required<AuctionProceedings> => {
  let claimableAuctioningToken = new TokenAmount(auctioningToken, '0')
  let claimableBiddingToken = new TokenAmount(biddingToken, '0')

  // For each order from user add to claimable amounts (bidding or auctioning).
  for (const order of ordersFromUser) {
    const decodedOrder = decodeOrder(order)
    const { buyAmount, sellAmount } = decodedOrder

    if (minFundingThresholdNotReached) {
      claimableBiddingToken = claimableBiddingToken.add(
        new TokenAmount(biddingToken, sellAmount.toString()),
      )
      // Order from the same user, buyAmount and sellAmount
    } else {
      if (JSON.stringify(decodedOrder) === JSON.stringify(clearingPriceOrder)) {
        claimableBiddingToken = claimableBiddingToken.add(
          new TokenAmount(biddingToken, sellAmount.sub(clearingPriceVolume).toString()),
        )
        claimableAuctioningToken = claimableAuctioningToken.add(
          new TokenAmount(
            auctioningToken,
            clearingPriceVolume
              .mul(clearingPriceOrder.buyAmount)
              .div(clearingPriceOrder.sellAmount)
              .toString(),
          ),
        )
      } else if (
        clearingPriceOrder.buyAmount
          .mul(sellAmount)
          .lt(buyAmount.mul(clearingPriceOrder.sellAmount))
      ) {
        claimableBiddingToken = claimableBiddingToken.add(
          new TokenAmount(biddingToken, sellAmount.toString()),
        )
      } else {
        // (orders[i].smallerThan(auction.clearingPriceOrder)
        if (clearingPriceOrder.sellAmount.gt(BigNumber.from('0'))) {
          claimableAuctioningToken = claimableAuctioningToken.add(
            new TokenAmount(
              auctioningToken,
              sellAmount
                .mul(clearingPriceOrder.buyAmount)
                .div(clearingPriceOrder.sellAmount)
                .toString(),
            ),
          )
        }
      }
    }
  }

  return {
    claimableBiddingToken,
    claimableAuctioningToken,
  }
}

export const isMinFundingReached = (
  biddingToken: Token,
  currentBidding: string,
  minFundingThreshold: string,
) => {
  const minFundingThresholdAmount = new TokenAmount(biddingToken, minFundingThreshold)
  const currentBiddingAmount = new TokenAmount(
    biddingToken,
    BigNumber.from(currentBidding).mul(BigNumber.from(10).pow(biddingToken.decimals)).toString(),
  )

  return minFundingThresholdAmount.lessThan(currentBiddingAmount)
}

export function useGetAuctionProceeds(
  auctionIdentifier: AuctionIdentifier,
  derivedAuctionInfo: DerivedAuctionInfo,
): AuctionProceedings {
  const { auctionDetails, auctionInfoLoading } = useAuctionDetails(auctionIdentifier)
  const { claimInfo } = useGetClaimInfo(auctionIdentifier)
  const {
    auctioningToken,
    biddingToken,
    clearingPriceOrder,
    clearingPriceSellOrder,
    clearingPriceVolume,
  } = derivedAuctionInfo

  return useMemo(() => {
    if (
      !claimInfo ||
      !biddingToken ||
      !auctioningToken ||
      !clearingPriceSellOrder ||
      !clearingPriceOrder ||
      !clearingPriceVolume ||
      auctionInfoLoading ||
      !auctionDetails
    ) {
      return {
        claimableBiddingToken: null,
        claimableAuctioningToken: null,
      }
    } else {
      return getClaimableData({
        auctioningToken,
        biddingToken,
        clearingPriceOrder,
        clearingPriceVolume,
        minFundingThresholdNotReached: !isMinFundingReached(
          biddingToken,
          auctionDetails.currentBiddingAmount,
          auctionDetails.minFundingThreshold,
        ),
        ordersFromUser: claimInfo.sellOrdersFormUser,
      })
    }
  }, [
    auctionDetails,
    auctionInfoLoading,
    auctioningToken,
    biddingToken,
    claimInfo,
    clearingPriceOrder,
    clearingPriceSellOrder,
    clearingPriceVolume,
  ])
}

export const useClaimOrderCallback = (
  auctionIdentifier: AuctionIdentifier,
): [ClaimState, () => Promise<Maybe<string>>] => {
  const { account, library } = useActiveWeb3React()
  const addTransaction = useTransactionAdder()

  const { auctionId, chainId } = auctionIdentifier
  const { claimInfo, error } = useGetClaimInfo(auctionIdentifier)
  const gasPrice = useGasPrice(chainId)

  const claimCallback = useCallback(async (): Promise<Maybe<string>> => {
    if (!chainId || !library || !account || error || !claimInfo) {
      throw new Error('missing dependencies in onPlaceOrder callback')
    }

    const easyAuctionContract: Contract = getEasyAuctionContract(
      chainId as ChainId,
      library,
      account,
    )

    const estimate = easyAuctionContract.estimateGas.claimFromParticipantOrder
    const method: Function = easyAuctionContract.claimFromParticipantOrder
    const args: Array<string | string[] | number> = [auctionId, claimInfo?.sellOrdersFormUser]
    const value: Maybe<BigNumber> = null

    const estimatedGasLimit = await estimate(...args, value ? { value } : {})
    const response = await method(...args, {
      ...(value ? { value } : {}),
      gasPrice,
      gasLimit: calculateGasMargin(estimatedGasLimit),
    })

    addTransaction(response, {
      summary: `Claiming tokens auction-${auctionId}`,
    })
    return response.hash
  }, [account, addTransaction, chainId, error, gasPrice, library, auctionId, claimInfo])

  const claimableOrders = claimInfo?.sellOrdersFormUser
  const pendingClaim = useHasPendingClaim(auctionIdentifier.auctionId, account)
  const claimStatus = useGetClaimState(auctionIdentifier, claimableOrders, pendingClaim)

  return [claimStatus, claimCallback]
}

export function useGetClaimState(
  auctionIdentifier: AuctionIdentifier,
  claimableOrders?: string[],
  pendingClaim?: Boolean,
): ClaimState {
  const [claimStatus, setClaimStatus] = useState<ClaimState>(ClaimState.UNKNOWN)
  const { account, library } = useActiveWeb3React()
  const { auctionId, chainId } = auctionIdentifier

  useEffect(() => {
    setClaimStatus(ClaimState.UNKNOWN)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [auctionId, chainId, account])

  useEffect(() => {
    let cancelled = false

    if (!claimableOrders) return

    if (claimableOrders.length === 0) {
      setClaimStatus(ClaimState.NOT_APPLICABLE)
      return
    }

    async function userHasAvailableClaim() {
      try {
        if (!library || !account || !claimableOrders) return

        const easyAuctionContract: Contract = getEasyAuctionContract(
          chainId as ChainId,
          library,
          account,
        )

        const method: Function = easyAuctionContract.containsOrder
        const args: Array<number | string> = [auctionId, claimableOrders[0]]

        const hasAvailableClaim = await method(...args)

        if (!cancelled) {
          setClaimStatus(
            hasAvailableClaim
              ? pendingClaim
                ? ClaimState.PENDING
                : ClaimState.NOT_CLAIMED
              : ClaimState.CLAIMED,
          )
        }
      } catch (error) {
        if (cancelled) return
        logger.error(error)
      }
    }
    userHasAvailableClaim()

    return (): void => {
      cancelled = true
    }
  }, [account, auctionId, chainId, claimableOrders, library, pendingClaim])

  return claimStatus
}
