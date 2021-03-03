import { useCallback } from 'react'

import { TokenList } from '@uniswap/token-lists'
import { useDispatch, useSelector } from 'react-redux'

import { AppDispatch, AppState } from '..'
import { loadTokenListFromAPI } from './actions'

export function useTokenListState(): AppState['tokenList'] {
  return useSelector<AppState, AppState['tokenList']>((state) => state.tokenList)
}

export function useTokenListActionHandlers(): {
  onLoadTokenList: (tokenList: TokenList) => void
} {
  const dispatch = useDispatch<AppDispatch>()

  const onLoadTokenList = useCallback(
    (tokenList: TokenList) => {
      dispatch(loadTokenListFromAPI({ tokenList }))
    },
    [dispatch],
  )

  return { onLoadTokenList }
}
