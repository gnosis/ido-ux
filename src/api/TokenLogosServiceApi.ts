import { TokenInfo, TokenList } from '@uniswap/token-lists'
import schema from '@uniswap/token-lists/src/tokenlist.schema.json'
import Ajv from 'ajv'

const TOKEN_LIST_RESOURCES = [
  'https://tokens.coingecko.com/uniswap/all.json',
  'https://raw.githubusercontent.com/gnosis/ido-contracts/master/assets/tokens/rinkeby-token-list.json',
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

      const data = await response.json()

      if (!tokenListValidator(data)) {
        console.error(tokenListValidator.errors)

        throw new Error('Token list failed validation')
      }

      return (data as TokenList).tokens
    } catch (error) {
      console.error(error)

      throw new Error(`Failed to fetch token list from URL ${url}`)
    }
  }

  public async getAllTokens(): Promise<{ [key: string]: string }> {
    const tokens: { [key: string]: string } = {}

    try {
      const responses = await Promise.all(
        TOKEN_LIST_RESOURCES.map((url) => this.getTokensByUrl(url)),
      )

      responses.forEach((items) => {
        items.forEach((token) => {
          tokens[token.address.toLowerCase()] = token.logoURI
        })
      })
    } catch (error) {
      console.error(error)

      throw new Error('Failed to get all tokens')
    }

    return tokens
  }
}
