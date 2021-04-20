import { useEffect, useState } from 'react'

import { BigNumber } from '@ethersproject/bignumber'

import { ChainId } from '../utils'
import { getLogger } from '../utils/logger'
import { useActiveWeb3React } from './index'
const logger = getLogger('useGasPrice')

export const useGasPrice = (chainId?: ChainId): BigNumber => {
  const [gasPrice, setGasPrice] = useState<BigNumber>(BigNumber.from(20000000000)) // 20 gwei
  const { library } = useActiveWeb3React()

  useEffect(() => {
    let cancelled = false

    if (!library || !chainId) return

    const getGasPrice = async (): Promise<void> => {
      try {
        if (ChainId.XDAI === chainId) {
          setGasPrice(BigNumber.from(1000000000)) // 1 gwei
        } else {
          // get gas price from web3 provider.
          const providerGasPrice: BigNumber = await library?.getGasPrice()

          if (cancelled) return
          setGasPrice(providerGasPrice)
        }
      } catch (error) {
        logger.error('Error trying to get gas price: ', error)

        if (cancelled) return
      }
    }

    getGasPrice()

    return (): void => {
      cancelled = true
    }
  }, [chainId, library])

  return gasPrice
}
