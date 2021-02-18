import React, { useContext } from 'react'
import { ThemeContext } from 'styled-components'

import { ChevronDown, ChevronUp } from 'react-feather'
import { Text } from 'rebass'

import { OrderDisplay } from '../../state/orders/reducer'
import { CursorPointer } from '../../theme'
import { AutoColumn } from '../Column'
import OrderTable from '../OrderTable'
import { RowBetween } from '../Row'
import { AdvancedDropdown, SectionBreak } from '../swap/styleds'

export interface OrderTableDetailsProps {
  orders: OrderDisplay[]
}

export default function OrderDisplayDropdown({
  orders,
  setShowAdvanced,
  showAdvanced,
  ...rest
}: Omit<OrderTableDetailsProps, 'onDismiss'> & {
  showAdvanced: boolean
  setShowAdvanced: (showAdvanced: boolean) => void
}) {
  const theme = useContext(ThemeContext)
  return (
    <AdvancedDropdown>
      {showAdvanced && !!orders ? (
        <AdvancedOrderDetails {...rest} onDismiss={() => setShowAdvanced(false)} orders={orders} />
      ) : (
        <CursorPointer>
          <RowBetween id="show-advanced" onClick={() => setShowAdvanced(true)} padding="4px 4px">
            <Text fontSize={14} fontWeight={500} style={{ userSelect: 'none' }}>
              {!orders || orders.length === 0
                ? 'You have no orders yet'
                : `Show ${orders.length} orders`}
            </Text>
            <ChevronDown color={theme.text2} />
          </RowBetween>
        </CursorPointer>
      )}
    </AdvancedDropdown>
  )
}

export interface AdvancedOrderDetailsProps extends OrderTableDetailsProps {
  onDismiss: () => void
}

export function AdvancedOrderDetails({ onDismiss, orders }: AdvancedOrderDetailsProps) {
  const theme = useContext(ThemeContext)

  return (
    <AutoColumn gap="md">
      <CursorPointer>
        <RowBetween onClick={onDismiss} padding="4px 4px">
          <Text color={theme.text2} fontSize={14} fontWeight={500} style={{ userSelect: 'none' }}>
            Hide {orders.length} orders
          </Text>
          <ChevronUp color={theme.text2} />
        </RowBetween>
      </CursorPointer>

      <SectionBreak />

      <OrderTable {...orders} />
    </AutoColumn>
  )
}
