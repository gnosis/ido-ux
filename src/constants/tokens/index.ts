import { Token, WETH } from 'uniswap-xdai-sdk'

import { ChainId } from '../../utils'
import MAINNET_TOKENS from './mainnet'
import RINKEBY_TOKENS from './rinkeby'

type AllTokens = Readonly<{ [chainId in ChainId]: Readonly<{ [tokenAddress: string]: Token }> }>

const chainIdValues = Object.values(ChainId)
const wethTokensValues = Object.values(WETH).filter((wethToken: Token) =>
  chainIdValues.includes(Number(wethToken.chainId)),
)

export const ALL_TOKENS: AllTokens = [
  // WETH on all chains
  ...wethTokensValues,
  // chain-specific tokens
  ...MAINNET_TOKENS,
  ...RINKEBY_TOKENS,
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
      [ChainId.RINKEBY]: {},
      [ChainId.XDAI]: {},
    },
  )
