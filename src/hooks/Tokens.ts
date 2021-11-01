import { useEffect, useMemo, useState } from 'react'

import { Token, WETH } from '@josojo/honeyswap-sdk'

import { ALL_TOKENS } from '../constants/tokens'
import { useAddUserToken, useFetchTokenByAddress, useUserAddedTokens } from '../state/user/hooks'
import { ChainId, isAddress } from '../utils'
import { useActiveWeb3React } from './index'

export function useAllTokens(): { [address: string]: Token } {
  const { chainId } = useActiveWeb3React()
  const userAddedTokens = useUserAddedTokens()

  return useMemo(() => {
    if (!chainId) return {}
    const tokens = userAddedTokens
      // reduce into all ALL_TOKENS filtered by the current chain
      .reduce<{ [address: string]: Token }>(
        (tokenMap, token) => {
          tokenMap[token.address] = token
          return tokenMap
        },
        // must make a copy because reduce modifies the map, and we do not
        // want to make a copy in every iteration
        { ...ALL_TOKENS[chainId as ChainId] },
      )

    const weth = WETH[chainId as ChainId]
    if (weth) {
      // we have to replace it as a workaround because if it is automatically
      // fetched by address it will cause an invariant when used in constructing
      // pairs since we replace the name and symbol with 'ETH' and 'Ether'
      tokens[weth.address] = weth
    }
    return tokens
  }, [userAddedTokens, chainId])
}

export function useToken(tokenAddress?: string): Token | undefined {
  const tokens = useAllTokens()
  return useMemo(() => {
    const validatedAddress = isAddress(tokenAddress)
    if (!validatedAddress) return
    return tokens[validatedAddress]
  }, [tokens, tokenAddress])
}

// gets token information by address (typically user input) and
// automatically adds it for the user if the token address is valid
export function useTokenByAddressAndAutomaticallyAdd(
  tokenAddress?: string,
): { token: Token | undefined; error: Maybe<Error>; isLoading: boolean } {
  const fetchTokenByAddress = useFetchTokenByAddress()
  const addToken = useAddUserToken()
  const token = useToken(tokenAddress)
  const { chainId } = useActiveWeb3React()

  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<Maybe<Error>>(null)

  useEffect(() => {
    if (!chainId || !tokenAddress || !isAddress(tokenAddress)) return
    const weth = WETH[chainId as ChainId]
    if (weth && weth.address === isAddress(tokenAddress)) return

    if (tokenAddress && tokenAddress != '0x0000000000000000000000000000000000000000' && !token) {
      setIsLoading(true)
      fetchTokenByAddress(tokenAddress)
        .then((token) => {
          if (token !== null) {
            addToken(token)
          }
          setIsLoading(false)
        })
        .catch((error) => {
          setError(error)
          setIsLoading(false)
        })
    }
  }, [tokenAddress, token, fetchTokenByAddress, addToken, chainId])

  return {
    token,
    isLoading,
    error,
  }
}
