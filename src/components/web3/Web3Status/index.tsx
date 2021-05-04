import { useActiveWeb3React } from '../../../hooks'
import { useSwapState } from '../../../state/orderPlacement/hooks'

export enum NetworkError {
  undefinedInjectedChainId = 1,
  undefinedChainId = 2,
  noChainMatch = 3,
  noError = undefined,
}

export const useNetworkCheck = (): { errorWrongNetwork: NetworkError | undefined } => {
  const { account, chainId: injectedChainId } = useActiveWeb3React()
  const { chainId } = useSwapState()

  const errorWrongNetwork =
    injectedChainId === undefined
      ? NetworkError.undefinedInjectedChainId
      : chainId === undefined
      ? NetworkError.undefinedChainId
      : chainId !== injectedChainId && !!account
      ? NetworkError.noChainMatch
      : NetworkError.noError

  return { errorWrongNetwork }
}
