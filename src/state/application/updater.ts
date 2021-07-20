import { useCallback, useEffect, useState } from 'react'

import { useDispatch } from 'react-redux'

import { useActiveWeb3React } from '../../hooks'
import useDebounce from '../../hooks/useDebounce'
import useIsWindowVisible from '../../hooks/useIsWindowVisible'
import { getLogger } from '../../utils/logger'
import { updateBlockNumber } from './actions'

const logger = getLogger('Updater')

export default function Updater() {
  const { account, chainId, library } = useActiveWeb3React()
  const dispatch = useDispatch()

  const windowVisible = useIsWindowVisible()
  const [blockchainState, setBlockchainState] = useState<{
    chainId: number | undefined
    blockNumber: number | null
  }>({
    chainId,
    blockNumber: null,
  })

  const blockNumberCallback = useCallback(
    (blockNumber: number) => {
      setBlockchainState((currentState) => {
        if (chainId === currentState.chainId) {
          if (typeof currentState.blockNumber !== 'number') return { chainId, blockNumber }
          return { chainId, blockNumber: Math.max(blockNumber, currentState.blockNumber) }
        }
        return currentState
      })
    },
    [chainId, setBlockchainState],
  )

  // update block number
  useEffect(() => {
    if (!account || !library || !chainId) return

    setBlockchainState({ chainId, blockNumber: null })

    library
      .getBlockNumber()
      .then((blockNumber) => {
        blockNumberCallback(blockNumber)
      })
      .catch((error) => logger.error(`Failed to get block number for chainId ${chainId}`, error))

    library.on('block', blockNumberCallback)
    return () => {
      library.removeListener('block', blockNumberCallback)
    }
  }, [dispatch, account, chainId, library, blockNumberCallback])

  // because blocks arrive in bunches with longer polling periods, we just want
  // to process the latest one.
  const debouncedBlockchainState = useDebounce(blockchainState, 100)

  useEffect(() => {
    if (!account || !debouncedBlockchainState.chainId || !debouncedBlockchainState.blockNumber)
      return
    if (windowVisible) {
      dispatch(
        updateBlockNumber({
          chainId: debouncedBlockchainState.chainId,
          blockNumber: debouncedBlockchainState.blockNumber,
        }),
      )
    }
  }, [
    account,
    windowVisible,
    dispatch,
    debouncedBlockchainState.chainId,
    debouncedBlockchainState.blockNumber,
  ])

  return null
}
