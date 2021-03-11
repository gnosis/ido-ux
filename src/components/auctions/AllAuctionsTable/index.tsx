import React, { useMemo } from 'react'
import styled, { css } from 'styled-components'

import { useGlobalFilter, useTable } from 'react-table'

import { KeyValue } from '../../common/KeyValue'
import { BaseCard } from '../../pureStyledComponents/BaseCard'
import { PageTitle } from '../../pureStyledComponents/PageTitle'

const Wrapper = styled(BaseCard)`
  padding: 4px 0;
`

const SectionTitle = styled(PageTitle)`
  margin-bottom: 16px;
  margin-top: 0;
`

const Grid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr 1fr 1fr 1fr 1fr 1fr 1fr;
`

const CommonCellCSS = css`
  border-bottom: 1px solid ${({ theme }) => theme.border};
  padding: 13px 15px;

  &:nth-last-child(-n + 4) {
    border-bottom: none;
  }
`

const Cell = styled(KeyValue)`
  ${CommonCellCSS}
`

// value and onChange function
const GlobalFilter = ({ globalFilter, setGlobalFilter }: any) => {
  return (
    <input
      onChange={(e) => {
        setGlobalFilter(e.target.value || undefined) // Set undefined to remove the filter entirely
      }}
      placeholder={`Search All ...`}
      value={globalFilter || ''}
    />
  )
}

const DatatablePage = (allAuctions: any[]) => {
  const columns = useMemo(
    () => [
      {
        Header: 'Pair',
        accessor: 'symbol',
        minWidth: 300,
      },
      {
        Header: '#AuctionId',
        accessor: 'auctionId',
        minWidth: 50,
      },
      {
        Header: 'Network',
        accessor: 'chainId',
        minWidth: 50,
      },
      {
        Header: 'Selling',
        accessor: 'selling',
        minWidth: 50,
      },
      {
        Header: 'Buying',
        accessor: 'buying',
        minWidth: 50,
      },
      {
        Header: 'Status',
        accessor: 'status',
        minWidth: 100,
      },
      {
        Header: 'End date',
        accessor: 'date',
        minWidth: 50,
      },
      {
        Header: 'Link',
        accessor: 'link',
        minWidth: 50,
      },
    ],
    [],
  )
  const data = useMemo(() => Object.values(allAuctions), [allAuctions])

  const { headerGroups, prepareRow, rows, setGlobalFilter, state } = useTable(
    {
      columns,
      data,
    },
    useGlobalFilter,
  )
  console.log(headerGroups[0].headers)
  return (
    <>
      <SectionTitle>Auctions</SectionTitle>
      <GlobalFilter globalFilter={state.globalFilter} setGlobalFilter={setGlobalFilter} />
      <Wrapper>
        <Grid>
          {/* {headerGroups.map((headerGroup) =>
            headerGroup.headers.map((column, j) => (
              <Cell itemKey="asd" itemValue="asd" key={j}>
                {column.render('Header')}
              </Cell>
            )),
          )} */}

          {rows.map((row) => {
            prepareRow(row)
            return row.cells.map((cell, j) => (
              <Cell
                itemKey={headerGroups[0].headers[j]['Header']}
                itemValue={cell.render('Cell')}
                key={j}
              ></Cell>
            ))
          })}
        </Grid>
      </Wrapper>
    </>
  )
}

export default DatatablePage
