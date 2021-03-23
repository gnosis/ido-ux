import { chainNames } from '../../../constants'
import { CHAIN_ID } from '../../../constants/config'
import { useActiveWeb3React } from '../../../hooks'
import { useSwapState } from '../../../state/orderPlacement/hooks'

export const useNetworkCheck = (): { errorWrongNetwork: string | undefined } => {
  const { chainId: injectedChainId } = useActiveWeb3React()
  const { chainId = CHAIN_ID } = useSwapState()
  const errorWrongNetwork =
    injectedChainId === undefined || chainId === injectedChainId || chainId === undefined
      ? undefined
      : `Please connect to the network: ${chainNames[chainId]}`
  return {
    errorWrongNetwork,
  }
}
