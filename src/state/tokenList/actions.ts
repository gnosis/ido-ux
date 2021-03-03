import { createAction } from '@reduxjs/toolkit'
import { TokenList } from '@uniswap/token-lists'

export const loadTokenListFromAPI = createAction<{ tokenList: TokenList }>('LoadTokenListFromAPI')
