import React, { useState } from 'react'
import styled from 'styled-components'

import * as CSS from 'csstype'

import { AuctionState } from '../../../state/orderPlacement/hooks'
import { ButtonSelect } from '../../buttons/ButtonSelect'
import { ButtonToggle } from '../../buttons/ButtonToggle'
import { Dropdown, DropdownItem, DropdownPosition } from '../../common/Dropdown'
import { ChartIcon } from '../../icons/ChartIcon'
import { TableIcon } from '../../icons/TableIcon'
import { Checkbox } from '../../pureStyledComponents/Checkbox'
import { PageTitle } from '../../pureStyledComponents/PageTitle'
import { OrderBook } from '../Orderbook'
import { OrderBookTable } from '../OrderbookTable'

interface WrapProps {
  margin?: any
  flexDir?: any
  alignItems?: any
}

const Wrap = styled.div<Partial<CSS.Properties & WrapProps>>`
  display: flex;
  align-items: ${(props) =>
    props.alignItems
      ? typeof props.alignItems !== 'string'
        ? props.alignItems[0]
        : props.alignItems
      : 'flex-start'};
  justify-content: space-between;
  flex-direction: ${(props) =>
    props.flexDir ? (typeof props.flexDir !== 'string' ? props.flexDir[0] : props.flexDir) : 'row'};
  ${(props) =>
    props.flexDir
      ? props.flexDir === 'column' || props.flexDir[0] === 'column'
        ? 'flex-wrap: nowrap'
        : 'flex-wrap: wrap'
      : 'flex-wrap: wrap'};
  margin: ${(props) =>
    props.margin ? (typeof props.margin !== 'string' ? props.margin[0] : props.margin) : '0'};
  @media (min-width: 768px) {
    align-items: ${(props) =>
      props.alignItems
        ? typeof props.alignItems !== 'string'
          ? props.alignItems[1]
          : props.alignItems
        : 'flex-start'};
    flex-direction: ${(props) =>
      props.flexDir
        ? typeof props.flexDir !== 'string'
          ? props.flexDir[1]
          : props.flexDir
        : 'row'};
    ${(props) =>
      props.flexDir
        ? props.flexDir === 'column' || props.flexDir[1] === 'column'
          ? 'flex-wrap: nowrap'
          : 'flex-wrap: wrap'
        : 'flex-wrap: wrap'};
    margin: ${(props) =>
      props.margin ? (typeof props.margin !== 'string' ? props.margin[1] : props.margin) : '0'};
  }
`

const SectionTitle = styled(PageTitle)`
  margin-bottom: 0;
  margin-top: 0;
`

const StyledButtonSelect = styled(ButtonSelect)`
  height: 19px;
  font-size: 13px;
  border-color: ${({ theme }) => theme.textField.color};
  padding: 2px 6px;
  line-height: 13px;
  cursor: pointer;
  svg {
    width: 8px;
    margin-left: 7px;
  }
`

const StyledDropdown = styled(Dropdown)`
  margin-left: 16px;
  @media (min-width: 768px) {
    margin-left: 0;
    margin-right: 16px;
  }
  &.isOpen {
    button {
      background-color: ${({ theme }) => theme.textField.color};
      border-color: ${({ theme }) => theme.textField.color};
      color: ${({ theme }) => theme.textField.backgroundColor};
      .fill {
        fill: ${({ theme }) => theme.textField.backgroundColor};
      }
    }
  }
  .dropdownItems {
    min-width: 82px;
  }
`

const StyledDropdownItem = styled(DropdownItem)`
  padding: 5px 13px;
  font-size: 13px;
  font-weight: normal;
  line-height: 1.08;
  justify-content: space-between;
`

const StyledCheckbox = styled(Checkbox)`
  border-radius: 50%;
  background-color: ${({ theme }) => theme.textField.color};
  &:before {
    border-radius: 50%;
  }
`

export const OrderBookContainer = (props) => {
  const { auctionIdentifier, derivedAuctionInfo } = props

  const [isChartVisible, setChartVisibility] = useState(true)
  const dropdownMockData = ['0.001', '0.01', '0.1', '1', '10', '50', '100']
  return (
    <>
      <Wrap alignItems={['flex-start', 'center']} flexDir={['column', 'row']} margin={'0 0 16px 0'}>
        <SectionTitle as="h2">
          {(derivedAuctionInfo.auctionState === AuctionState.ORDER_PLACING ||
            derivedAuctionInfo.auctionState === AuctionState.ORDER_PLACING_AND_CANCELING) &&
            'Orderbook'}
        </SectionTitle>
        <Wrap flexDir={['row-reverse', 'row']} margin={['20px 0', '0']}>
          {!isChartVisible && (
            <StyledDropdown
              dropdownButtonContent={<StyledButtonSelect content={'Granularity'} />}
              dropdownPosition={DropdownPosition.right}
              items={dropdownMockData.map((item, index) => (
                <StyledDropdownItem key={index}>
                  {item}
                  <StyledCheckbox />
                </StyledDropdownItem>
              ))}
            />
          )}
          <ButtonToggle
            activate={isChartVisible}
            left={{ icon: <ChartIcon />, label: 'Chart' }}
            onClick={() => setChartVisibility(!isChartVisible)}
            right={{ icon: <TableIcon />, label: 'List' }}
          />
        </Wrap>
      </Wrap>
      {isChartVisible ? (
        <OrderBook auctionIdentifier={auctionIdentifier} derivedAuctionInfo={derivedAuctionInfo} />
      ) : (
        <OrderBookTable />
      )}
    </>
  )
}
