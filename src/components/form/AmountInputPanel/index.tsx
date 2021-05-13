import { rgba } from 'polished'
import React from 'react'
import styled, { keyframes } from 'styled-components'
import { Token } from 'uniswap-xdai-sdk'

import { useActiveWeb3React } from '../../../hooks'
import { ApprovalState } from '../../../hooks/useApproveCallback'
import { ChainId, getTokenDisplay } from '../../../utils'
import { MiniInfoIcon } from '../../icons/MiniInfoIcon'
import { MiniLock } from '../../icons/MiniLock'
import { MiniSpinner } from '../../icons/MiniSpinner'
import {
  FieldRowBottom,
  FieldRowInfo,
  FieldRowInfoProps,
  FieldRowInput,
  FieldRowLabel,
  FieldRowLineButton,
  FieldRowPrimaryButton,
  FieldRowPrimaryButtonText,
  FieldRowToken,
  FieldRowTokenSymbol,
  FieldRowTop,
  FieldRowWrapper,
  InfoType,
} from '../../pureStyledComponents/FieldRow'
import TokenLogo from '../../token/TokenLogo'

const rotate = keyframes`
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
`

const UnlockButton = styled(FieldRowPrimaryButton)<{ unlocking?: boolean }>`
  background-color: ${(props) =>
    props.unlocking ? '#008c73' : ({ theme }) => theme.buttonPrimary.backgroundColor};
  color: ${(props) => (props.unlocking ? '#fff' : ({ theme }) => theme.buttonPrimary.color)};

  &:hover {
    background-color: ${(props) =>
      props.unlocking
        ? rgba('#008c73', 0.8)
        : ({ theme }) => rgba(theme.buttonPrimary.backgroundColor, 0.8)};
    color: ${(props) => (props.unlocking ? '#fff' : ({ theme }) => theme.buttonPrimary.color)};
  }

  &[disabled] {
    background-color: ${(props) =>
      props.unlocking ? '#008c73' : ({ theme }) => theme.buttonPrimary.backgroundColor};
    opacity: 1;
  }
`

UnlockButton.defaultProps = {
  unlocking: false,
}

const SpinningLaVidaLoca = styled.span`
  animation: ${rotate} 2s linear infinite;
  flex-grow: 0;
  flex-shrink: 0;
  margin-right: 2px;
`

const Balance = styled.div<{ disabled?: boolean }>`
  color: ${({ theme }) => theme.text1};
  font-size: 14px;
  font-weight: 400;
  line-height: 1.2;
  margin: 0 8px 0 0;
  ${(props) => props.disabled && 'opacity: 0.7;'}
`

Balance.defaultProps = {
  disabled: false,
}

export interface unlockProps {
  isLocked: boolean
  onUnlock: () => void
  unlockState: ApprovalState
}

interface Props {
  balance?: string
  chainId: ChainId
  info?: FieldRowInfoProps
  onMax?: () => void
  onUserSellAmountInput: (val: string) => void
  token: Maybe<Token>
  unlock: unlockProps
  value: string
}

const AmountInputPanel: React.FC<Props> = (props) => {
  const {
    balance,
    chainId,
    info,
    onMax,
    onUserSellAmountInput,
    token = null,
    unlock,
    value,
    ...restProps
  } = props
  const { account } = useActiveWeb3React()
  const isUnlocking = unlock.unlockState === ApprovalState.PENDING
  const error = info?.type === InfoType.error

  return (
    <>
      <FieldRowWrapper error={error} {...restProps}>
        <FieldRowTop>
          <FieldRowLabel>Amount</FieldRowLabel>
          <Balance disabled={!balance}>Balance: {balance ? balance : '0.00'}</Balance>
          <FieldRowLineButton disabled={!onMax || !account} onClick={onMax}>
            Max
          </FieldRowLineButton>
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
          {unlock.isLocked && (
            <UnlockButton disabled={isUnlocking} onClick={unlock.onUnlock} unlocking={isUnlocking}>
              {isUnlocking ? (
                <>
                  <SpinningLaVidaLoca>
                    <MiniSpinner />
                  </SpinningLaVidaLoca>
                  <FieldRowPrimaryButtonText>Unlocking</FieldRowPrimaryButtonText>
                </>
              ) : (
                <>
                  <MiniLock />
                  <FieldRowPrimaryButtonText>Unlock</FieldRowPrimaryButtonText>
                </>
              )}
            </UnlockButton>
          )}
          <FieldRowInput
            disabled={!account}
            error={error}
            onUserSellAmountInput={(val) => {
              onUserSellAmountInput(val)
            }}
            value={value}
          />
        </FieldRowBottom>
      </FieldRowWrapper>
      <FieldRowInfo infoType={info?.type}>
        {info ? (
          <>
            <MiniInfoIcon /> {info.text}
          </>
        ) : (
          <>&nbsp;</>
        )}
      </FieldRowInfo>
    </>
  )
}

export default AmountInputPanel
