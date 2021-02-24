import React, { useState } from 'react'
import { RouteComponentProps } from 'react-router-dom'
import styled from 'styled-components'

import AuctionDetails from '../../components/AuctionDetails'
import AuctionHeader from '../../components/AuctionHeader'
import Claimer from '../../components/Claimer'
import OrderDisplayDropdown from '../../components/OrderDropdown'
import OrderPlacement from '../../components/OrderPlacement'
import { ButtonCopy } from '../../components/buttons/ButtonCopy'
import { PageTitle } from '../../components/pureStyledComponents/PageTitle'
import {
  AuctionState,
  useCurrentUserOrders,
  useDefaultsFromURLSearch,
  useDerivedAuctionState,
  useSwapState,
} from '../../state/orderPlacement/hooks'
import { useOrderbookDataCallback } from '../../state/orderbook/hooks'
import { useOrderState } from '../../state/orders/hooks'
import { OrderState } from '../../state/orders/reducer'
import ClaimerBody from '../ClaimerBody'
import OrderBody from '../OrderBody'

const Title = styled(PageTitle)`
  margin-bottom: 2px;
`

const SubTitleWrapper = styled.div`
  align-items: center;
  display: flex;
  margin: 0 0 40px;
`

const SubTitle = styled.h2`
  color: ${({ theme }) => theme.text1};
  font-size: 15px;
  font-weight: 400;
  line-height: 1.2;
  margin: 0 6px 0 0;
`

const CopyButton = styled(ButtonCopy)`
  height: 14px;
  position: relative;
  top: -1px;
  width: 14px;
`

const Auction = ({ location: { search } }: RouteComponentProps) => {
  const { auctionState } = useDerivedAuctionState()
  const [showAdvanced, setShowAdvanced] = useState<boolean>(false)
  const orders: OrderState | undefined = useOrderState()
  const { auctionId } = useSwapState()
  const url = window.location.href

  useDefaultsFromURLSearch(search)
  useCurrentUserOrders()
  useOrderbookDataCallback()

  return (
    <>
      <Title>Auction Details</Title>
      <SubTitleWrapper>
        <SubTitle>Auction Id #{auctionId}</SubTitle>
        <CopyButton copyValue={url} title="Copy URL" />
      </SubTitleWrapper>
      <AuctionDetails />
      <AuctionHeader />

      {(auctionState === AuctionState.ORDER_PLACING ||
        auctionState === AuctionState.ORDER_PLACING_AND_CANCELING) && (
        <OrderBody>
          <OrderPlacement />
        </OrderBody>
      )}
      {auctionState === AuctionState.CLAIMING && (
        <ClaimerBody>
          <Claimer />
        </ClaimerBody>
      )}
      {(auctionState === undefined || auctionState === AuctionState.NOT_YET_STARTED) && (
        <>Auction not started yet.</>
      )}
      <OrderDisplayDropdown
        orders={orders.orders}
        setShowAdvanced={setShowAdvanced}
        showAdvanced={showAdvanced}
      />
    </>
  )
}

export default Auction
