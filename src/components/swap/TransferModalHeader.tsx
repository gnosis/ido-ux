import React from 'react'
import { TokenAmount } from 'uniswap-xdai-sdk'

import { Text } from 'rebass'

import { useActiveWeb3React } from '../../hooks'
import { ExternalLink, TYPE } from '../../theme'
import { getExplorerLink } from '../../utils'
import Copy from '../common/Copy'
import TokenLogo from '../common/TokenLogo'
import { AutoColumn } from './Column'
import { AutoRow, RowBetween } from './Row'

export function TransferModalHeader({
  ENSName,
  amount,
  recipient,
}: {
  recipient: string
  ENSName: string
  amount: TokenAmount
}) {
  const { chainId } = useActiveWeb3React()
  return (
    <AutoColumn gap="lg" style={{ marginTop: '40px' }}>
      <RowBetween>
        <Text fontSize={36} fontWeight={500}>
          {amount?.toSignificant(6)} {amount?.token?.symbol}
        </Text>
        {amount && amount.token && (
          <TokenLogo
            size={'30px'}
            token={{ address: amount.token.address, symbol: amount.token.symbol }}
          />
        )}
      </RowBetween>
      <TYPE.darkGray fontSize={20}>To</TYPE.darkGray>
      {ENSName ? (
        <AutoColumn gap="lg">
          <TYPE.blue fontSize={36}>{ENSName}</TYPE.blue>
          <AutoRow gap="10px">
            <ExternalLink href={getExplorerLink(chainId, ENSName, 'address')}>
              <TYPE.blue fontSize={18}>
                {recipient?.slice(0, 8)}...{recipient?.slice(34, 42)}↗
              </TYPE.blue>
            </ExternalLink>
            <Copy toCopy={recipient} />
          </AutoRow>
        </AutoColumn>
      ) : (
        <AutoRow gap="10px">
          <ExternalLink href={getExplorerLink(chainId, recipient, 'address')}>
            <TYPE.blue fontSize={36}>
              {recipient?.slice(0, 6)}...{recipient?.slice(36, 42)}↗
            </TYPE.blue>
          </ExternalLink>
          <Copy toCopy={recipient} />
        </AutoRow>
      )}
    </AutoColumn>
  )
}
