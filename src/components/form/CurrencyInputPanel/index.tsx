import React from 'react'
import styled from 'styled-components'
import { Token } from 'uniswap-xdai-sdk'

import { useActiveWeb3React } from '../../../hooks'
import { ApprovalState } from '../../../hooks/useApproveCallback'
import { ChainId, getTokenDisplay } from '../../../utils'
import { MiniLock } from '../../icons/MiniLock'
import {
  FieldRowBottom,
  FieldRowInput,
  FieldRowLabel,
  FieldRowLineButton,
  FieldRowPrimaryButton,
  FieldRowToken,
  FieldRowTokenSymbol,
  FieldRowTop,
  FieldRowWrapper,
} from '../../pureStyledComponents/FieldRow'
import TokenLogo from '../../token/TokenLogo'

const UnlockButton = styled(FieldRowPrimaryButton)<{ unlocking?: boolean }>`
  background-color: ${(props) =>
    props.unlocking ? '#008c73' : ({ theme }) => theme.buttonPrimary.backgroundColor};
  color: ${(props) => (props.unlocking ? '#fff' : ({ theme }) => theme.buttonPrimary.color)};

  &[disabled] {
    opacity: 1;
  }
`

UnlockButton.defaultProps = {
  unlocking: false,
}

interface Props {
  chainId: ChainId
  isLocked?: boolean
  onMax?: () => void
  onUnlock?: () => void
  onUserSellAmountInput: (val: string) => void
  token: Maybe<Token>
  unlockState?: ApprovalState
  value: string
}

const CurrencyInputPanel: React.FC<Props> = (props) => {
  const {
    chainId,
    isLocked,
    onMax,
    onUnlock,
    onUserSellAmountInput,
    token = null,
    unlockState,
    value,
    ...restProps
  } = props
  const { account } = useActiveWeb3React()

  return (
    <FieldRowWrapper {...restProps}>
      <FieldRowTop>
        <FieldRowLabel>Amount</FieldRowLabel>
        {onMax && account && <FieldRowLineButton onClick={onMax}>Max</FieldRowLineButton>}
      </FieldRowTop>
      <FieldRowBottom>
        {token && (
          <FieldRowToken>
            {token.address && (
              <TokenLogo size={'15px'} token={{ address: token.address, symbol: token.symbol }} />
            )}
            {token && token.symbol && (
              <FieldRowTokenSymbol>{getTokenDisplay(token, chainId)}</FieldRowTokenSymbol>
            )}
          </FieldRowToken>
        )}
        {isLocked && (
          <UnlockButton
            disabled={unlockState === ApprovalState.PENDING}
            onClick={onUnlock}
            unlocking={unlockState === ApprovalState.PENDING}
          >
            {unlockState === ApprovalState.PENDING ? (
              <>Unlocking</>
            ) : (
              <>
                <MiniLock />
                Unlock
              </>
            )}
          </UnlockButton>
        )}
        <FieldRowInput
          onUserSellAmountInput={(val) => {
            onUserSellAmountInput(val)
          }}
          value={value}
        />
      </FieldRowBottom>
    </FieldRowWrapper>
  )
}

export default CurrencyInputPanel
