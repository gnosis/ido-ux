import React, { useState } from 'react'
import { RouteComponentProps } from 'react-router-dom'
import styled from 'styled-components'

import AuctionDetails from '../../components/AuctionDetails'
import AuctionHeader from '../../components/AuctionHeader'
import Claimer from '../../components/Claimer'
import OrderDisplayDropdown from '../../components/OrderDropdown'
import OrderPlacement from '../../components/OrderPlacement'
import { useActiveWeb3React } from '../../hooks'
import { useWalletModalToggle } from '../../state/application/hooks'
import {
  AuctionState,
  useCurrentUserOrders,
  useDefaultsFromURLSearch,
  useDerivedAuctionState,
} from '../../state/orderPlacement/hooks'
import { useOrderbookDataCallback } from '../../state/orderbook/hooks'
import { useOrderState } from '../../state/orders/hooks'
import { OrderState } from '../../state/orders/reducer'
import ClaimerBody from '../ClaimerBody'
import OrderBody from '../OrderBody'

const Wrapper = styled.div`
  display: flex;
  flex-flow: row wrap;
  width: 100%;
  justify-content: space-between;
  align-items: stretch;
  ${({ theme }) => theme.mediaWidth.upToMedium`flex-flow: column wrap;`};
`
function renderAuctionElements({ auctionState }: { auctionState: AuctionState }) {
  switch (auctionState) {
    case undefined || AuctionState.NOT_YET_STARTED:
      return <></>
    case AuctionState.ORDER_PLACING:
    case AuctionState.ORDER_PLACING_AND_CANCELING:
      return (
        <>
          <AuctionDetails />
          <OrderBody>
            <OrderPlacement />
          </OrderBody>
        </>
      )

    case AuctionState.CLAIMING:
      return (
        <>
          <AuctionDetails />
          <ClaimerBody>
            <Claimer />
          </ClaimerBody>
        </>
      )

    default:
      return null
  }
}

export default function Auction({ location: { search } }: RouteComponentProps) {
  useDefaultsFromURLSearch(search)
  const { account } = useActiveWeb3React()
  const toggleWalletModal = useWalletModalToggle()
  const { auctionState } = useDerivedAuctionState()
  const [showAdvanced, setShowAdvanced] = useState<boolean>(false)
  const orders: OrderState | undefined = useOrderState()
  useCurrentUserOrders()
  useOrderbookDataCallback()

  return (
    <>
      <Wrapper>
        <AuctionHeader />
        {renderAuctionElements({
          auctionState,
        })}
      </Wrapper>
      <OrderDisplayDropdown
        orders={orders.orders}
        setShowAdvanced={setShowAdvanced}
        showAdvanced={showAdvanced}
      />
    </>
  )
}
