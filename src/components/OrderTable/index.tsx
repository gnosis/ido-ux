import React from "react";
import styled from "styled-components";
import { OrderDisplay, OrderStatus } from "../../state/orders/reducer";

const Styles = styled.div`
  align-items: center
  width: 100%;
  padding: 0.1rem;
  table {
    margin-left: auto;
    margin-right: auto;
    text-align: center;
    border-spacing: 0.5;
    tr {

      border-bottom: 1px solid black;
      border-right: 1px solid black;
      :last-child {
        td {
          border-bottom: 1;
        }
      }
    }
    th,
    td {
      margin: 0;
      padding: 0.5rem;
      :last-child {
        border-right: 0;
      }
    }
  }
`;

function Table(orders: OrderDisplay[]) {
  // Render the UI for your table
  console.log(Object.entries(orders));
  return (
    <table style={{ alignSelf: "center" }}>
      <thead>
        <tr>
          <th>Amount</th>
          <th>Price</th>
          <th>Estimated Fill</th>
          <th>Status</th>
          <th>Cancellation</th>
        </tr>
      </thead>
      <tbody>
        {Object.entries(orders).map((order, index) => {
          return (
            <tr key={index}>
              <td>{order[1].sellAmount}</td>
              <td>{order[1].price}</td>
              <td>100</td>
              <td>
                {order[1].status == OrderStatus.PLACED ? "Placed" : "Pending"}
              </td>
              <td>x</td>
            </tr>
          );
        })}
      </tbody>
    </table>
  );
}

export default function OrderTable(orders: OrderDisplay[]) {
  return (
    <Styles>
      <Table {...orders} />
    </Styles>
  );
}
