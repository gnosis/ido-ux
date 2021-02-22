import React from 'react'
import styled from 'styled-components'

import { ChainId } from '@uniswap/sdk'
import { useWeb3React } from '@web3-react/core'

import { useActiveWeb3React } from '../../../hooks'
import { truncateStringInTheMiddle } from '../../../utils/tools'
import { Button } from '../../buttons/Button'
import { ButtonType } from '../../buttons/buttonStylingTypes'
import { Dropdown, DropdownItem, DropdownPosition } from '../../common/Dropdown'
import { Switch } from '../../form/Switch'
import { ChevronDown } from '../../icons/ChevronDown'
import { ChevronRight } from '../../icons/ChevronRight'

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
  margin-top: 10px;
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
  border-bottom: 1px solid ${({ theme }) => theme.border};
  color: ${({ theme }) => theme.dropdown.item.color};
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
        <ConnectionText>
          {chainId === ChainId.ROPSTEN && 'Ropsten'}
          {chainId === ChainId.RINKEBY && 'Rinkeby'}
          {chainId === ChainId.GÖRLI && 'Görli'}
          {chainId === ChainId.KOVAN && 'Kovan'}
        </ConnectionText>
      </Connection>
    </DropdownButton>
  )
}

const UserDropdownContent = () => {
  const items = [
    {
      title: 'Wallet',
      value: 'Metamask',
    },
    {
      title: 'Your transactions',
      value: <ChevronRight />,
    },
    {
      title: 'Night mode',
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
