import { ChainId } from 'uniswap-xdai-sdk'

import { TokenList } from '@uniswap/token-lists'
import schema from '@uniswap/token-lists/src/tokenlist.schema.json'
import Ajv from 'ajv'

const NETWORKS_TOKEN_LIST = {
  // Coingecko List
  [ChainId.MAINNET]: 'https://tokens.coingecko.com/uniswap/all.json',
  // Default list
  [ChainId.RINKEBY]:
    'https://raw.githubusercontent.com/gnosis/gp-swap-ui/develop/src/custom/tokens/rinkeby-token-list.json',
  // Honeyswap List
  [ChainId.XDAI]: 'https://tokens.honeyswap.org/',
}
const tokenListValidator = new Ajv({ allErrors: true }).compile(schema)

export interface TokenLogosServiceApiInterface {
  getTokens(chainId: number): Promise<TokenList>
}

export class TokenLogosServiceApi implements TokenLogosServiceApiInterface {
  public async getTokens(chainId: number): Promise<TokenList> {
    try {
      if (!chainId) {
        return null
      }

      const url = NETWORKS_TOKEN_LIST[chainId] || null
      const response = await fetch(url)

      if (!response.ok) {
        throw new Error('Invalid token list response.')
      }

      const data = await response.json()

      if (!tokenListValidator(data)) {
        console.error(tokenListValidator.errors)

        throw new Error('Token list failed validation')
      }

      return data as TokenList
    } catch (error) {
      console.error(error)

      throw new Error(`Failed to fetch token list for chain id ${chainId}`)
    }
  }
}
