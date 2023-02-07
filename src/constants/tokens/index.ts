import { Token, WETH } from '@josojo/honeyswap-sdk'

import { ChainId } from '../../utils'

type AllTokens = Readonly<{ [chainId in ChainId]: Readonly<{ [tokenAddress: string]: Token }> }>

const chainIdValues = Object.values(ChainId)
const wethTokensValues = Object.values(WETH).filter((wethToken: Token) =>
  chainIdValues.includes(Number(wethToken.chainId)),
)

export const ALL_TOKENS: AllTokens = [
  // WETH on all chains
  ...wethTokensValues,
]

  // put into an object
  .reduce<AllTokens>(
    (tokenMap, token) => {
      if (tokenMap[token.chainId][token.address] !== undefined) throw Error('Duplicate tokens.')
      return {
        ...tokenMap,
        [token.chainId]: {
          ...tokenMap[token.chainId],
          [token.address]: token,
        },
      }
    },
    {
      [ChainId.MAINNET]: {},
      [ChainId.GÖRLI]: {},
      [ChainId.XDAI]: {},
      [ChainId.MATIC]: {},
    },
  )
