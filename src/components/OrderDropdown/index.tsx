import React, { useContext } from "react";
import { ChevronDown } from "react-feather";
import { ThemeContext } from "styled-components";
import { RowBetween } from "../Row";
import { AdvancedDropdown, SectionBreak } from "../swap/styleds";

import { ChevronUp } from "react-feather";
import { Text } from "rebass";
import { CursorPointer } from "../../theme";
import { AutoColumn } from "../Column";
import OrderTable from "../OrderTable";
import { OrderDisplay } from "../../state/orders/reducer";

export interface OrderTableDetailsProps {
  orders: OrderDisplay[];
}

export default function OrderDisplayDropdown({
  showAdvanced,
  orders,
  setShowAdvanced,
  ...rest
}: Omit<OrderTableDetailsProps, "onDismiss"> & {
  showAdvanced: boolean;
  setShowAdvanced: (showAdvanced: boolean) => void;
}) {
  const theme = useContext(ThemeContext);
  return (
    <AdvancedDropdown>
      {showAdvanced && !!orders ? (
        <AdvancedOrderDetails
          {...rest}
          onDismiss={() => setShowAdvanced(false)}
          orders={orders}
        />
      ) : (
        <CursorPointer>
          <RowBetween
            onClick={() => setShowAdvanced(true)}
            padding="4px 4px"
            id="show-advanced"
          >
            <Text fontSize={14} fontWeight={500} style={{ userSelect: "none" }}>
              {!orders || orders.length === 0
                ? "You have no orders yet"
                : `Show ${orders.length} orders`}
            </Text>
            <ChevronDown color={theme.text2} />
          </RowBetween>
        </CursorPointer>
      )}
    </AdvancedDropdown>
  );
}

export interface AdvancedOrderDetailsProps extends OrderTableDetailsProps {
  onDismiss: () => void;
}

export function AdvancedOrderDetails({
  orders,
  onDismiss,
}: AdvancedOrderDetailsProps) {
  const theme = useContext(ThemeContext);

  return (
    <AutoColumn gap="md">
      <CursorPointer>
        <RowBetween onClick={onDismiss} padding="4px 4px">
          <Text
            fontSize={14}
            color={theme.text2}
            fontWeight={500}
            style={{ userSelect: "none" }}
          >
            Hide {orders.length} orders
          </Text>
          <ChevronUp color={theme.text2} />
        </RowBetween>
      </CursorPointer>

      <SectionBreak />

      <OrderTable {...orders} />
    </AutoColumn>
  );
}
