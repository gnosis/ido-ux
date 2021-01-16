import React from "react";
import styled from "styled-components";
import { Fraction, TokenAmount } from "@uniswap/sdk";
import { useDerivedAuctionInfo } from "../../state/orderPlacement/hooks";

const Styles = styled.div`
  padding: 1rem;
  table {
    border-spacing: 0;
    border: 1px solid black;
    tr {
      :last-child {
        td {
          border-bottom: 0;
        }
      }
    }
    th,
    td {
      margin: 0;
      padding: 0.5rem;
      border-bottom: 1px solid black;
      border-right: 1px solid black;
      :last-child {
        border-right: 0;
      }
    }
  }
`;
export enum OrderStatus {
  PENDING,
  PLACED,
}

export interface OrderDisplay {
  sellAmount: TokenAmount;
  price: Fraction;
  status: OrderStatus;
}

function Table() {
  // Render the UI for your table
  return (
    <table>
      <tr>
        <th>Investment</th>
        <th>Price</th>
        <th>Status</th>
        <th>Cancellation</th>
      </tr>
      <tr>
        <td>10</td>
        <td>15</td>
        <td>Place</td>
      </tr>
      <tr>
        <td>11</td>
        <td>15</td>
        <td>Place</td>
      </tr>
    </table>
  );
}

export default function OrderTable(orders: OrderDisplay[]) {
  return (
    <Styles>
      <Table />
    </Styles>
  );
}
