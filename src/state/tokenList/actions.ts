import { createAction } from '@reduxjs/toolkit'

export const loadTokenListFromAPI = createAction<{ tokenList: { [key: string]: string } }>(
  'LoadTokenListFromAPI',
)
