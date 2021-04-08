import { useEffect, useMemo, useState } from 'react'
import { TokenAmount } from 'uniswap-xdai-sdk'

import { BigNumber } from '@ethersproject/bignumber'
import { Contract } from '@ethersproject/contracts'

import { DerivedAuctionInfo } from '../state/orderPlacement/hooks'
import { AuctionIdentifier } from '../state/orderPlacement/reducer'
import { useTransactionAdder } from '../state/transactions/hooks'
import { ChainId, calculateGasMargin, getEasyAuctionContract } from '../utils'
import { getLogger } from '../utils/logger'
import { additionalServiceApi } from './../api'
import { decodeOrder, encodeOrder } from './Order'
import { useActiveWeb3React } from './index'
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

export function useGetClaimInfo(auctionIdentifier: AuctionIdentifier): Maybe<ClaimInformation> {
  const { account, chainId, library } = useActiveWeb3React()
  const [claimInfo, setClaimInfo] = useState<Maybe<ClaimInformation>>(null)
  const { auctionId } = auctionIdentifier

  useMemo(() => {
    setClaimInfo(null)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [auctionId, chainId])
  useEffect(() => {
    let cancelled = false

    const fetchApiData = async (): Promise<void> => {
      try {
        if (!chainId || !library || !account || !additionalServiceApi) {
          throw new Error('missing dependencies in useGetClaimInfo callback')
        }
        const sellOrdersFormUser = await additionalServiceApi.getAllUserOrders({
          networkId: chainId,
          auctionId,
          user: account,
        })
        if (cancelled) return
        setClaimInfo({ sellOrdersFormUser })
      } catch (error) {
        if (cancelled) return
        logger.error('Error getting withdraw info', error)
        setClaimInfo({
          sellOrdersFormUser: [
            encodeOrder({
              sellAmount: BigNumber.from(0),
              buyAmount: BigNumber.from(0),
              userId: BigNumber.from(0),
            }),
          ],
        })
      }
    }
    fetchApiData()

    return (): void => {
      cancelled = true
    }
  }, [account, chainId, library, auctionId, setClaimInfo])

  return claimInfo
}
export function useGetAuctionProceeds(
  auctionIdentifier: AuctionIdentifier,
  derivedAuctionInfo: DerivedAuctionInfo,
): AuctionProceedings {
  const claimInfo = useGetClaimInfo(auctionIdentifier)

  if (
    !claimInfo ||
    !derivedAuctionInfo?.biddingToken ||
    !derivedAuctionInfo?.auctioningToken ||
    !derivedAuctionInfo?.clearingPriceSellOrder ||
    !derivedAuctionInfo?.clearingPriceOrder ||
    !derivedAuctionInfo?.clearingPriceVolume
  ) {
    return {
      claimableBiddingToken: null,
      claimableAuctioningToken: null,
    }
  }
  let claimableAuctioningToken = new TokenAmount(derivedAuctionInfo?.auctioningToken, '0')
  let claimableBiddingToken = new TokenAmount(derivedAuctionInfo?.biddingToken, '0')
  for (const order of claimInfo.sellOrdersFormUser) {
    const decodedOrder = decodeOrder(order)
    if (JSON.stringify(decodedOrder) == JSON.stringify(derivedAuctionInfo?.clearingPriceOrder)) {
      claimableBiddingToken = claimableBiddingToken.add(
        new TokenAmount(
          derivedAuctionInfo?.biddingToken,
          decodedOrder.sellAmount.sub(derivedAuctionInfo?.clearingPriceVolume).toString(),
        ),
      )
      claimableAuctioningToken = claimableAuctioningToken.add(
        new TokenAmount(
          derivedAuctionInfo?.auctioningToken,
          derivedAuctionInfo?.clearingPriceVolume
            .mul(derivedAuctionInfo?.clearingPriceOrder.buyAmount)
            .div(derivedAuctionInfo?.clearingPriceOrder.sellAmount)
            .toString(),
        ),
      )
    } else if (
      derivedAuctionInfo?.clearingPriceOrder.buyAmount
        .mul(decodedOrder.sellAmount)
        .lt(decodedOrder.buyAmount.mul(derivedAuctionInfo?.clearingPriceOrder.sellAmount))
    ) {
      claimableBiddingToken = claimableBiddingToken.add(
        new TokenAmount(derivedAuctionInfo?.biddingToken, decodedOrder.sellAmount.toString()),
      )
    } else {
      if (derivedAuctionInfo?.clearingPriceOrder.sellAmount.gt(BigNumber.from('0'))) {
        claimableAuctioningToken = claimableAuctioningToken.add(
          new TokenAmount(
            derivedAuctionInfo?.auctioningToken,
            decodedOrder.sellAmount
              .mul(derivedAuctionInfo?.clearingPriceOrder.buyAmount)
              .div(derivedAuctionInfo?.clearingPriceOrder.sellAmount)
              .toString(),
          ),
        )
      }
    }
  }
  return {
    claimableBiddingToken,
    claimableAuctioningToken,
  }
}

export function useClaimOrderCallback(
  auctionIdentifier: AuctionIdentifier,
): null | (() => Promise<string>) {
  const { account, chainId, library } = useActiveWeb3React()
  const addTransaction = useTransactionAdder()
  const gasPrice = useGasPrice()

  const { auctionId } = auctionIdentifier
  const claimInfo = useGetClaimInfo(auctionIdentifier)

  return useMemo(() => {
    return async function onClaimOrder() {
      if (!chainId || !library || !account || !claimInfo) {
        throw new Error('missing dependencies in onPlaceOrder callback')
      }
      const easyAuctionContract: Contract = getEasyAuctionContract(
        chainId as ChainId,
        library,
        account,
      )
      let estimate,
        method: Function,
        args: Array<string | string[] | number>,
        value: Maybe<BigNumber>
      {
        estimate = easyAuctionContract.estimateGas.claimFromParticipantOrder
        method = easyAuctionContract.claimFromParticipantOrder
        args = [auctionId, claimInfo?.sellOrdersFormUser]
        value = null
      }

      return estimate(...args, value ? { value } : {})
        .then((estimatedGasLimit) =>
          method(...args, {
            ...(value ? { value } : {}),
            gasPrice,
            gasLimit: calculateGasMargin(estimatedGasLimit),
          }),
        )
        .then((response) => {
          addTransaction(response, {
            summary: 'Claiming tokens',
          })

          return response.hash
        })
        .catch((error) => {
          logger.error(`Claiming or gas estimate failed`, error)
          throw error
        })
    }
  }, [chainId, library, account, claimInfo, auctionId, gasPrice, addTransaction])
}
