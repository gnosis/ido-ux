import React from 'react'
import styled from 'styled-components'

import { WalletConnectConnector } from '@anxolin/walletconnect-connector'
import { useWeb3React } from '@web3-react/core'

import { useActiveWeb3React } from '../../../hooks'
import { useDarkModeManager } from '../../../state/user/hooks'
import { getChainName, truncateStringInTheMiddle } from '../../../utils/tools'
import { Button } from '../../buttons/Button'
import { ButtonType } from '../../buttons/buttonStylingTypes'
import { Dropdown, DropdownItem, DropdownPosition } from '../../common/Dropdown'
import { Switch } from '../../form/Switch'
import { ChevronDown } from '../../icons/ChevronDown'
import { ChevronRight } from '../../icons/ChevronRight'
import { TransactionsModal } from '../../modals/TransactionsModal'

const Wrapper = styled(Dropdown)`
  align-items: center;
  display: flex;
  height: 100%;

  .dropdownButton {
    height: 100%;
  }

  &.isOpen {
    .chevronDown {
      transform: rotateX(180deg);
    }
  }
`

const DropdownButton = styled.div`
  align-items: flex-start;
  cursor: pointer;
  display: flex;
  flex-direction: column;
  height: 100%;
  justify-content: center;

  .fill {
    fill: ${({ theme }) => theme.text1};
  }

  &:hover {
    .addressText {
      color: ${({ theme }) => theme.text1};
    }

    .chevronDown {
      .fill {
        fill: ${({ theme }) => theme.text1};
      }
    }
  }
`

const Address = styled.div`
  align-items: center;
  display: flex;

  @media (min-width: ${({ theme }) => theme.themeBreakPoints.md}) {
    margin-top: 10px;
  }
`

const AddressText = styled.div`
  color: ${({ theme }) => theme.text1};
  font-size: 15px;
  font-weight: 400;
  line-height: 1.2;
  margin-right: 8px;
`

const Connection = styled.div`
  align-items: center;
  display: flex;
`

const ConnectionStatus = styled.div`
  background-color: ${({ theme }) => theme.green1};
  border-radius: 8px;
  flex-grow: 0;
  flex-shrink: 0;
  height: 8px;
  margin-right: 4px;
  width: 8px;
`

const ConnectionText = styled.div`
  color: ${({ theme }) => theme.green1};
  font-size: 9px;
  font-weight: 600;
  line-height: 1.2;
  margin-bottom: -2px;
`

const Content = styled.div`
  width: 245px;
`
const DropdownItemStyled = styled(DropdownItem)`
  cursor: default;
  padding: 0;

  &:hover {
    background-color: transparent;
  }
`

const Item = styled.div<{ hasOnClick?: boolean; disabled?: boolean; hide?: boolean }>`
  align-items: center;
  border-bottom: 1px solid ${({ theme }) => theme.border};
  color: ${({ theme }) => theme.dropdown.item.color};
  cursor: ${(props) => (props.hasOnClick ? 'pointer' : 'default')};
  display: ${(props) => (props.hide ? 'none' : 'flex')};
  font-size: 13px;
  justify-content: space-between;
  line-height: 1.2;
  padding: 12px;
  width: 100%;

  &:hover {
    background-color: ${(props) =>
      props.hasOnClick ? props.theme.dropdown.item.backgroundColorHover : 'transparent'};
  }

  ${(props) => props.disabled && 'pointer-events: none;'}
`

const Title = styled.div`
  padding-right: 10px;
`

const Value = styled.div`
  font-weight: 600;
  text-transform: capitalize;
  position: relative;
`

const DisconnectButton = styled(Button)`
  border-radius: 4px;
  font-size: 14px;
  height: 28px;
  line-height: 1;
  width: 100%;
  font-family: 'Averta', sans-serif;
`

const UserDropdownButton = () => {
  const { account } = useWeb3React()
  const { chainId } = useActiveWeb3React()

  return (
    <DropdownButton>
      <Address>
        <AddressText className="addressText" title={account}>
          {account ? truncateStringInTheMiddle(account, 8, 6) : 'Invalid address.'}
        </AddressText>
        <ChevronDown />
      </Address>
      <Connection>
        <ConnectionStatus />
        <ConnectionText>{getChainName(chainId)}</ConnectionText>
      </Connection>
    </DropdownButton>
  )
}

interface Props {
  disabled?: boolean
}

export const UserDropdown: React.FC<Props> = (props) => {
  const { disabled = false, ...restProps } = props
  const [transactionsModalVisible, setTransactionsModalVisible] = React.useState(false)
  const [darkMode, toggleDarkMode] = useDarkModeManager()

  const { connector, deactivate, library } = useActiveWeb3React()

  const getWalletName = React.useCallback((): string => {
    const provider = library?.provider

    const isMetaMask = provider
      ? Object.prototype.hasOwnProperty.call(provider, 'isMetaMask') && provider?.isMetaMask
      : undefined
    const isWalletConnect = provider
      ? Object.prototype.hasOwnProperty.call(provider, 'wc')
      : undefined

    return isMetaMask ? 'MetaMask' : isWalletConnect ? 'WalletConnect' : 'Unknown'
  }, [library])

  const disconnect = React.useCallback(async () => {
    deactivate()
    if (connector instanceof WalletConnectConnector && typeof connector.close === 'function') {
      connector.close()
      connector.walletConnectProvider = null
      localStorage.removeItem('walletconnect')
    }
  }, [connector, deactivate])

  const UserDropdownContent = () => {
    const items = [
      {
        title: 'Wallet',
        value: getWalletName(),
      },
      {
        title: 'Your transactions',
        onClick: () => {
          setTransactionsModalVisible(true)
        },
        value: <ChevronRight />,
      },
      {
        disabled: true,
        hide: true,
        onClick: toggleDarkMode,
        title: 'Night mode',
        value: <Switch active={darkMode} disabled small />,
      },
    ]

    return (
      <Content>
        {items.map((item, index) => {
          return (
            <Item
              disabled={item.disabled && item.disabled}
              hasOnClick={item.onClick && item.onClick ? true : false}
              hide={item.hide && item.hide}
              key={index}
              onClick={item.onClick && item.onClick}
            >
              <Title>{item.title}</Title>
              <Value>{item.value}</Value>
            </Item>
          )
        })}
        <Item>
          <DisconnectButton
            buttonType={ButtonType.danger}
            onClick={() => {
              disconnect()
            }}
          >
            Disconnect
          </DisconnectButton>
        </Item>
      </Content>
    )
  }

  const headerDropdownItems = [
    <DropdownItemStyled key="1">
      <UserDropdownContent />
    </DropdownItemStyled>,
  ]

  return (
    <>
      <Wrapper
        activeItemHighlight={false}
        closeOnClick={false}
        disabled={disabled}
        dropdownButtonContent={<UserDropdownButton />}
        dropdownPosition={DropdownPosition.right}
        items={headerDropdownItems}
        {...restProps}
      />
      <TransactionsModal
        isOpen={transactionsModalVisible}
        onDismiss={() => setTransactionsModalVisible(false)}
      />
    </>
  )
}
