import React, { useCallback, useState } from 'react'
import styled from 'styled-components'

import { useActiveWeb3React } from '../../../hooks'
import useInterval from '../../../hooks/useInterval'
import { useRemovePopup } from '../../../state/application/hooks'
import { TYPE } from '../../../theme'
import { ExternalLink } from '../../../theme/components'
import { getExplorerLink } from '../../../utils'
import { CheckCircle } from '../../icons/CheckCircle'
import { CloseCircle } from '../../icons/CloseCircle'
import { AutoRow } from '../../swap/Row'

const Fader = styled.div<{ count: number }>`
  position: absolute;
  bottom: 0px;
  left: 0px;
  width: ${({ count }) => `calc(100% - (100% / ${150 / count}))`};
  height: 2px;
  background-color: ${({ theme }) => theme.bg3};
  transition: width 100ms linear;
`

const Wrap = styled.div`
  max-width: calc(100% - 80px);
  width: 100%;
`

const delay = 100

export default function TxnPopup({
  hash,
  popKey,
  success,
  summary,
}: {
  hash: string
  success?: boolean
  summary?: string
  popKey?: string
}) {
  const { chainId } = useActiveWeb3React()
  const [count, setCount] = useState(1)

  const [isRunning, setIsRunning] = useState(true)
  const removePopup = useRemovePopup()

  const removeThisPopup = useCallback(() => removePopup(popKey), [popKey, removePopup])

  useInterval(
    () => {
      count > 150 ? removeThisPopup() : setCount(count + 1)
    },
    isRunning ? delay : null,
  )

  return (
    <AutoRow onMouseEnter={() => setIsRunning(false)} onMouseLeave={() => setIsRunning(true)}>
      {success ? (
        <CheckCircle color={'#27AE60'} style={{ marginRight: '15px' }} width="42" />
      ) : (
        <CloseCircle color={'#FF6871'} style={{ marginRight: '15px' }} width="42" />
      )}
      <Wrap>
        <TYPE.body fontWeight={500}>
          {summary ? summary : 'Hash: ' + hash.slice(0, 8) + '...' + hash.slice(58, 65)}
        </TYPE.body>
        <ExternalLink href={getExplorerLink(chainId, hash, 'transaction')}>
          View transaction
        </ExternalLink>
      </Wrap>
      <Fader count={count} />
    </AutoRow>
  )
}
