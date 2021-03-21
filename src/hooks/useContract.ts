import { useMemo } from 'react'

import { Contract } from '@ethersproject/contracts'
import { abi as IUniswapV2PairABI } from '@uniswap/v2-core/build/IUniswapV2Pair.json'

import ERC20_ABI from '../constants/abis/erc20.json'
import { MULTICALL_ABI, MULTICALL_NETWORKS } from '../constants/multicall'
import { V1_EXCHANGE_ABI, V1_FACTORY_ABI, V1_FACTORY_ADDRESS } from '../constants/v1'
import { ChainId, getContract } from '../utils'
import { useActiveWeb3React } from './index'

// returns null on errors
export function useContract(
  address?: string,
  ABI?: any,
  withSignerIfPossible = true,
): Maybe<Contract> {
  const { account, library } = useActiveWeb3React()

  return useMemo(() => {
    if (!address || !ABI || !library) return null
    try {
      return getContract(
        address,
        ABI,
        library,
        withSignerIfPossible && account ? account : undefined,
      )
    } catch (error) {
      console.error('Failed to get contract', error)
      return null
    }
  }, [address, ABI, library, withSignerIfPossible, account])
}

export function useV1FactoryContract(): Maybe<Contract> {
  const { chainId } = useActiveWeb3React()
  return useContract(chainId === 1 ? V1_FACTORY_ADDRESS : undefined, V1_FACTORY_ABI, false)
}

export function useV1ExchangeContract(address: string): Maybe<Contract> {
  return useContract(address, V1_EXCHANGE_ABI, false)
}

export function useTokenContract(
  tokenAddress?: string,
  withSignerIfPossible = true,
): Maybe<Contract> {
  return useContract(tokenAddress, ERC20_ABI, withSignerIfPossible)
}

export function usePairContract(
  pairAddress?: string,
  withSignerIfPossible = true,
): Maybe<Contract> {
  return useContract(pairAddress, IUniswapV2PairABI, withSignerIfPossible)
}

export function useMulticallContract(): Maybe<Contract> {
  const { chainId } = useActiveWeb3React()
  return useContract(MULTICALL_NETWORKS[chainId as ChainId], MULTICALL_ABI, false)
}
