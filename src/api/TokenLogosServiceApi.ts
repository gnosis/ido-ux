import { TokenInfo, TokenList } from '@uniswap/token-lists'
import schema from '@uniswap/token-lists/src/tokenlist.schema.json'
import Ajv from 'ajv'

import { getLogger } from '../utils/logger'

const logger = getLogger('TokenLogosServiceApi')

const TOKEN_LIST_RESOURCES = [
  'https://raw.githubusercontent.com/ribbon-finance/ribbon-token-list/82c7808f7b0322b2ba8807d7dc88c2db7fb9971a/ribbon.tokenlist.json',
  'https://tokens.coingecko.com/uniswap/all.json',
  'https://tokens.1inch.eth.link',
  'https://bafybeih3zii2hukln4enn2qiacqeb4jgvqescxpbudxhpvtfiex4cjpgce.ipfs.dweb.link/',
  'https://raw.githubusercontent.com/gnosis/ido-contracts/master/assets/tokens/goerli-token-list.json',
  'https://tokens.honeyswap.org',
]
const tokenListValidator = new Ajv({ allErrors: true }).compile(schema)

export interface TokenLogosServiceApiInterface {
  getTokensByUrl(url: string): Promise<TokenInfo[]>
  getAllTokens(): Promise<{ [key: string]: string }>
}

export class TokenLogosServiceApi implements TokenLogosServiceApiInterface {
  public async getTokensByUrl(url: string): Promise<TokenInfo[]> {
    try {
      // The browser looks for a matching request in its HTTP cache.
      const response = await fetch(url, { cache: 'default' })

      if (!response.ok) {
        throw new Error('Invalid token list response.')
      }

      const data: TokenList = await response.json()

      if (!tokenListValidator(data)) {
        const validationErrors =
          tokenListValidator.errors?.reduce<string>((memo, error) => {
            const add = `${error.dataPath} ${error.message ?? ''}`
            return memo.length > 0 ? `${memo}; ${add}` : `${add}`
          }, '') ?? 'unknown error'

        logger.error(`Token list ${url} failed validation  ${validationErrors}`)
      }

      return data?.tokens ?? []
    } catch (error) {
      logger.error(`Failed to fetch token list from URL ${url}`, error)

      return []
    }
  }

  public async getAllTokens(): Promise<{ [key: string]: string }> {
    const tokens: { [key: string]: string } = {}

    try {
      const responses = await Promise.allSettled(
        TOKEN_LIST_RESOURCES.map((url) => this.getTokensByUrl(url)),
      )

      for (const res of responses) {
        if (res.status === 'rejected') {
          logger.error('Error getting token logo details: ', res.reason)
        }

        if (res.status === 'fulfilled') {
          res.value.forEach((token) => {
            if (token.logoURI != undefined)
              tokens[token.address.toLowerCase()] = resolveIPFSTokenUrI(token.logoURI)
          })
        }
      }
    } catch (error) {
      logger.error('Failed to get all tokens', error)

      return {}
    }

    return tokens
  }
}

function resolveIPFSTokenUrI(uri: string): string {
  return uri.startsWith('ipfs://') ? 'https://ipfs.io/ipfs/' + uri.substring(7) : uri
}
