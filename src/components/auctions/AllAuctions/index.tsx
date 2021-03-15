import React, { useMemo } from 'react'
import { NavLink } from 'react-router-dom'
import styled from 'styled-components'

import { useGlobalFilter, useTable } from 'react-table'

import { KeyValue } from '../../common/KeyValue'
import { BaseCard } from '../../pureStyledComponents/BaseCard'
import { Cell, CellRowCSS, CellRowProps } from '../../pureStyledComponents/Cell'
import { PageTitle } from '../../pureStyledComponents/PageTitle'

const Wrapper = styled(BaseCard)`
  padding: 0;
`

const SectionTitle = styled(PageTitle)`
  margin-bottom: 16px;
  margin-top: 0;
`

const RowLink = styled(NavLink)<CellRowProps>`
  ${CellRowCSS}
  cursor: pointer;

  &:first-child {
    padding-top: 17px;
  }

  &:last-child {
    padding-bottom: 17px;
  }

  &:hover {
    background-color: rgba(255, 255, 255, 0.05);
  }
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

const AllAuctions = (allAuctions: any[]) => {
  const columns = useMemo(
    () => [
      {
        Header: '',
        accessor: 'symbol',
        align: 'flex-start',
        show: true,
        style: { height: '100%', justifyContent: 'center' },
      },
      {
        Header: 'Auction Id',
        accessor: 'auctionId',
        align: 'flex-start',
        show: true,
        style: {},
      },
      {
        Header: 'Network',
        accessor: 'chainId',
        align: 'flex-start',
        show: true,
        style: {},
      },
      {
        Header: 'Selling',
        accessor: 'selling',
        align: 'flex-start',
        show: true,
        style: {},
      },
      {
        Header: 'Buying',
        accessor: 'buying',
        align: 'flex-start',
        show: true,
        style: {},
      },
      {
        Header: 'Status',
        accessor: 'status',
        align: 'flex-start',
        show: true,
        style: {},
      },
      {
        Header: 'End date',
        accessor: 'date',
        align: 'flex-start',
        show: true,
        style: {},
      },
      {
        Header: '',
        accessor: 'chevron',
        align: 'flex-end',
        show: true,
        style: { height: '100%', justifyContent: 'center' },
      },
      {
        Header: '',
        accessor: 'url',
        align: '',
        show: false,
        style: {},
      },
    ],
    [],
  )
  const data = useMemo(() => Object.values(allAuctions), [allAuctions])
  const { prepareRow, rows, setGlobalFilter, state } = useTable(
    {
      columns,
      data,
    },
    useGlobalFilter,
  )

  // console.log(data)
  return (
    <>
      <SectionTitle style={{ display: 'block' }}>Auctions</SectionTitle>
      <GlobalFilter globalFilter={state.globalFilter} setGlobalFilter={setGlobalFilter} />
      <Wrapper>
        {rows.map((row, i) => {
          prepareRow(row)
          return (
            <RowLink
              columns={'85px 1fr 1fr 1fr 1fr 1fr 1fr 50px'}
              key={i}
              to={row.original['url'] ? row.original['url'] : '#'}
            >
              {row.cells.map(
                (cell, j) =>
                  cell.render('show') && (
                    <Cell key={j}>
                      <KeyValue
                        align={cell.render('align')}
                        itemKey={cell.render('Header')}
                        itemValue={cell.render('Cell')}
                        style={cell.render('style')}
                      />
                    </Cell>
                  ),
              )}
            </RowLink>
          )
        })}
      </Wrapper>
    </>
  )
}

export default AllAuctions
