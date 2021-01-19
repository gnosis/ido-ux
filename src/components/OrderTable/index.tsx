import React from "react";
import styled from "styled-components";
import { OrderDisplay, OrderStatus } from "../../state/orders/reducer";

const StyledRow = styled.div`
  display: grid;
  grid-template-columns: 1.5fr 0.6fr 1fr 1fr 1fr;
  grid-template-areas: "amount price fill status action";
  font-weight: normal;
  font-size: 13px;
  padding: 8px 0;

  &:not(:last-child) {
    border-bottom: 1px solid rgba(43, 43, 43, 0.435);
  }

  > div {
    display: flex;
    align-items: center;
  }

  > div:last-of-type {
    margin: 0 0 0 auto;
  }
`;

const StyledHeader = styled(StyledRow)`
  > div {
    font-weight: 500;
  }
`;

const Wrapper = styled.div`
  width: 100%;
  padding: 0;
`;

function Table(orders: OrderDisplay[]) {
  // Render the UI for your table
  console.log(Object.entries(orders));
  return (
    <>
      <StyledHeader>
        <div>Amount</div>
        <div>Price</div>
        <div>Est. Fill</div>
        <div>Status</div>
        <div>Actions</div>
      </StyledHeader>

      {Object.entries(orders).map((order, index) => {
        return (
          <StyledRow key={index}>
            <div>{order[1].sellAmount}</div>
            <div>{order[1].price}</div>
            <div>100</div>
            <div>
              {order[1].status == OrderStatus.PLACED ? "Placed" : "Pending"}
            </div>
            <div>x</div>
          </StyledRow>
        );
      })}
    </>
  );
}

export default function OrderTable(orders: OrderDisplay[]) {
  return (
    <Wrapper>
      <Table {...orders} />
    </Wrapper>
  );
}
