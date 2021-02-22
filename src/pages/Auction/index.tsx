import React, { useState } from 'react'
import { RouteComponentProps } from 'react-router-dom'
import styled from 'styled-components'

import AuctionDetails from '../../components/AuctionDetails'
import AuctionHeader from '../../components/AuctionHeader'
import { ButtonLight } from '../../components/Button'
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

const renderAuctionElements = ({ auctionState }: { auctionState: AuctionState }) => {
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
      return <div></div>
  }
}

const Auction = ({ location: { search } }: RouteComponentProps) => {
  useDefaultsFromURLSearch(search)
  const { account } = useActiveWeb3React()
  const toggleWalletModal = useWalletModalToggle()
  const { auctionState } = useDerivedAuctionState()
  const [showAdvanced, setShowAdvanced] = useState<boolean>(false)
  const orders: OrderState | undefined = useOrderState()
  useCurrentUserOrders()
  useOrderbookDataCallback()

  return !account ? (
    <div>
      <h3>GnosisAuction is a platform designed for fair price finding of one-time events.</h3>
      <ButtonLight onClick={toggleWalletModal}>Connect Wallet</ButtonLight>
    </div>
  ) : (
    <>
      <AuctionHeader />
      {renderAuctionElements({
        auctionState,
      })}

      <OrderDisplayDropdown
        orders={orders.orders}
        setShowAdvanced={setShowAdvanced}
        showAdvanced={showAdvanced}
      />
    </>
  )
}

export default Auction
