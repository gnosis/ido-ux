import { TokenInfo, TokenList } from '@uniswap/token-lists'
import schema from '@uniswap/token-lists/src/tokenlist.schema.json'
import Ajv from 'ajv'

const TOKEN_LIST_RESOURCES = [
  'https://tokens.coingecko.com/uniswap/all.json',
  'https://raw.githubusercontent.com/gnosis/ido-ux/develop/src/custom/tokens/rinkeby-token-list.json',
  'https://tokens.honeyswap.org',
]
const tokenListValidator = new Ajv({ allErrors: true }).compile(schema)

export interface TokenLogosServiceApiInterface {
  getTokensByUrl(url: string): Promise<TokenList>
  getAllTokens(): Promise<TokenInfo[]>
}

export class TokenLogosServiceApi implements TokenLogosServiceApiInterface {
  public async getTokensByUrl(url: string): Promise<TokenList> {
    try {
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

      throw new Error(`Failed to fetch token list from URL ${url}`)
    }
  }

  public async getAllTokens(): Promise<TokenInfo[]> {
    const tokens: TokenInfo[] = []

    try {
      const [coingeckoTokenList, gnosisTokenList, honeyswapTokenList] = await Promise.all(
        TOKEN_LIST_RESOURCES.map((url) => this.getTokensByUrl(url)),
      )

      tokens.push(...coingeckoTokenList.tokens)
      tokens.push(...gnosisTokenList.tokens)
      tokens.push(...honeyswapTokenList.tokens)
    } catch (error) {
      console.error(error)

      throw new Error('Failed to get all tokens')
    }

    return tokens
  }
}
