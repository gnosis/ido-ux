import { createAction } from '@reduxjs/toolkit'
import { TokenInfo } from '@uniswap/token-lists'

export const loadTokenListFromAPI = createAction<{ tokenList: TokenInfo[] }>('LoadTokenListFromAPI')
