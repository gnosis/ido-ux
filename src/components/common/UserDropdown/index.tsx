import React from 'react'
import styled from 'styled-components'

import { truncateStringInTheMiddle } from '../../../utils/tools'
import { Button } from '../../buttons/Button'
import { ButtonCopy } from '../../buttons/ButtonCopy'
import { ButtonType } from '../../buttons/buttonStylingTypes'
import { Dropdown, DropdownItem, DropdownPosition } from '../../common/Dropdown'
import { Switch } from '../../form/Switch'
import { ChevronDown } from '../../icons/ChevronDown'

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

  &:hover {
    .addressText {
      color: ${(props) => props.theme.colors.darkerGrey};
    }

    .chevronDown {
      .fill {
        fill: ${(props) => props.theme.colors.darkerGrey};
      }
    }
  }
`

const Address = styled.div`
  align-items: center;
  display: flex;
`

const AddressText = styled.div`
  color: ${(props) => props.theme.colors.textColor};
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
  background-color: ${(props) => props.theme.colors.holdGreen};
  border-radius: 8px;
  flex-grow: 0;
  flex-shrink: 0;
  height: 8px;
  margin-right: 4px;
  width: 8px;
`

const ConnectionText = styled.div`
  color: ${(props) => props.theme.colors.holdGreen};
  font-size: 9px;
  font-weight: 600;
  line-height: 1.2;
  margin-bottom: -2px;
  text-transform: capitalize;
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

const Item = styled.div`
  align-items: center;
  border-bottom: 1px solid ${(props) => props.theme.dropdown.item.borderColor};
  color: ${(props) => props.theme.colors.darkerGrey};
  display: flex;
  font-size: 13px;
  justify-content: space-between;
  line-height: 1.2;
  padding: 12px;
  width: 100%;
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
  font-size: 14px;
  height: 28px;
  line-height: 1;
  width: 100%;
`

const TextAndButton = styled.span`
  align-items: center;
  display: flex;
  justify-content: space-between;
`

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const getWalletName = (provider: any): string => {
  const isMetaMask =
    Object.prototype.hasOwnProperty.call(provider._web3Provider, 'isMetaMask') &&
    provider._web3Provider.isMetaMask
  const isWalletConnect = Object.prototype.hasOwnProperty.call(provider._web3Provider, 'wc')

  return isMetaMask ? 'MetaMask' : isWalletConnect ? 'WalletConnect' : 'Unknown'
}

const UserDropdownButton = () => {
  const address = '0x12345678901010101010101011010101010101'

  return (
    <DropdownButton>
      <Address>
        <AddressText className="addressText" title={address}>
          {truncateStringInTheMiddle(address, 6, 4)}
        </AddressText>
        <ChevronDown />
      </Address>
      {/* {networkConfig.networkId && ( */}
      <Connection>
        <ConnectionStatus />
        <ConnectionText>
          {/* {networkConfig.getNetworkName()} / {getWalletName(provider)} */}
          Rinkeby / Metamask
        </ConnectionText>
      </Connection>
      {/* )} */}
    </DropdownButton>
  )
}

const UserDropdownContent = () => {
  const items = [
    {
      title: 'Network',
      value: 'Rinkeby',
    },
    {
      title: 'Wallet',
      value: 'Metamask',
    },
    {
      title: 'Dark Theme',
      value: (
        <Switch
          active
          disabled
          onClick={() => {
            console.log('toggle')
          }}
          small
        />
      ),
    },
  ]

  return (
    <Content>
      {items.map((item, index) => {
        return (
          <Item key={index}>
            <Title>{item.title}</Title>
            <Value>{item.value}</Value>
          </Item>
        )
      })}
      <Item>
        <DisconnectButton
          buttonType={ButtonType.danger}
          onClick={() => {
            // disconnect()
          }}
        >
          Disconnect
        </DisconnectButton>
      </Item>
    </Content>
  )
}

export const UserDropdown: React.FC = (props) => {
  const headerDropdownItems = [
    <DropdownItemStyled key="1">
      <UserDropdownContent />
    </DropdownItemStyled>,
  ]

  return (
    <Wrapper
      activeItemHighlight={false}
      closeOnClick={false}
      dropdownButtonContent={<UserDropdownButton />}
      dropdownPosition={DropdownPosition.right}
      items={headerDropdownItems}
      {...props}
    />
  )
}
