import React, { useMemo } from "react";
import { useTable, useGlobalFilter } from "react-table";
import styled from "styled-components";

const Styles = styled.div`
  padding: 1rem;
  width: 100%;
  height: 100%
  align-items: end;
  text-align: center;
  flex: 0 1 auto;

  table {
    text-align: center;
    width: 100%;
    padding: 2px;
    th,
    td {
      margin: 0.2;
      padding: 0.5rem;
      text-align: center;
      border-bottom: 1px solid black;
    }
  }
`;

// value and onChange function
const GlobalFilter = ({ globalFilter, setGlobalFilter }: any) => {
  return (
    <input
      value={globalFilter || ""}
      onChange={(e) => {
        setGlobalFilter(e.target.value || undefined); // Set undefined to remove the filter entirely
      }}
      placeholder={`Search All ...`}
    />
  );
};

export default function DatatablePage(allAuctions: any[]) {
  const columns = useMemo(
    () => [
      {
        Header: "Pair",
        accessor: "symbol",
        minWidth: 300,
      },
      {
        Header: "#AuctionId",
        accessor: "auctionId",
        minWidth: 50,
      },
      {
        Header: "Selling",
        accessor: "selling",
        minWidth: 50,
      },
      {
        Header: "Buying",
        accessor: "buying",
        minWidth: 50,
      },
      {
        Header: "Status",
        accessor: "status",
        minWidth: 100,
      },
      {
        Header: "End date",
        accessor: "date",
        minWidth: 50,
      },
      {
        Header: "Link",
        accessor: "link",
        minWidth: 50,
      },
    ],
    [],
  );
  const data = useMemo(() => Object.values(allAuctions), [allAuctions]);

  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    rows,
    prepareRow,
    state,
    setGlobalFilter,
  } = useTable(
    {
      columns,
      data,
    },
    useGlobalFilter,
  );
  return (
    <>
      <Styles>
        <GlobalFilter
          globalFilter={state.globalFilter}
          setGlobalFilter={setGlobalFilter}
        />
      </Styles>
      <Styles>
        <table {...getTableProps()}>
          <thead>
            {headerGroups.map((headerGroup, i) => (
              <tr {...headerGroup.getHeaderGroupProps()} key={i}>
                {headerGroup.headers.map((column, j) => (
                  <th {...column.getHeaderProps()} key={j}>
                    {column.render("Header")}
                  </th>
                ))}
              </tr>
            ))}
          </thead>
          <tbody {...getTableBodyProps()}>
            {rows.map((row, i) => {
              prepareRow(row);
              return (
                <tr {...row.getRowProps()} key={i}>
                  {row.cells.map((cell, j) => {
                    return (
                      <td {...cell.getCellProps()} key={j}>
                        {cell.render("Cell")}
                      </td>
                    );
                  })}
                </tr>
              );
            })}
          </tbody>
        </table>
      </Styles>
    </>
  );
}
