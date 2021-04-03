import { useEffect, useState } from 'react'

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
  const [maxBlockNumber, setMaxBlockNumber] = useState<Maybe<number>>(null)
  // because blocks arrive in bunches with longer polling periods, we just want
  // to process the latest one.
  const debouncedMaxBlockNumber = useDebounce<Maybe<number>>(maxBlockNumber, 100)

  // update block number
  useEffect(() => {
    if (!account || !library || !chainId) return

    const blockListener = (blockNumber: number) => {
      setMaxBlockNumber((maxBlockNumber) => {
        if (typeof maxBlockNumber !== 'number') return blockNumber
        return Math.max(maxBlockNumber, blockNumber)
      })
    }

    setMaxBlockNumber(null)

    library
      .getBlockNumber()
      .then((blockNumber) => dispatch(updateBlockNumber({ chainId, blockNumber })))
      .catch((error) => logger.error(`Failed to get block number for chainId ${chainId}`, error))

    library.on('block', blockListener)
    return () => {
      library.removeListener('block', blockListener)
    }
  }, [dispatch, account, chainId, library])

  useEffect(() => {
    if (!account || !chainId || !debouncedMaxBlockNumber) return
    if (windowVisible) {
      dispatch(updateBlockNumber({ chainId, blockNumber: debouncedMaxBlockNumber }))
    }
  }, [chainId, account, debouncedMaxBlockNumber, windowVisible, dispatch])

  return null
}
