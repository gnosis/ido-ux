import { useMemo } from 'react'

import { Token, TokenAmount } from '@josojo/honeyswap-sdk'

import { useTokenContract } from '../hooks/useContract'
import { useSingleCallResult } from '../state/multicall/hooks'

export function useTokenAllowance(
  token?: Token,
  owner?: string,
  spender?: string,
): TokenAmount | undefined {
  const contract = useTokenContract(token?.address, false)

  const inputs = useMemo(() => [owner, spender], [owner, spender])
  // eslint-disable-next-line no-warning-comments
  // Todo: research why this hack of allowance reload for each block
  // is needed to update the allowance after approving.
  const allowance = useSingleCallResult(contract, 'allowance', inputs, {
    blocksPerFetch: 1,
  }).result
  return useMemo(
    () => (token && allowance ? new TokenAmount(token, allowance.toString()) : undefined),
    [token, allowance],
  )
}
