import React, { useMemo } from 'react'
import { NavLink } from 'react-router-dom'
import styled from 'styled-components'

import { useGlobalFilter, useTable } from 'react-table'

import { ButtonSelect } from '../../buttons/ButtonSelect'
import { Dropdown, DropdownItem, DropdownPosition } from '../../common/Dropdown'
import { KeyValue } from '../../common/KeyValue'
import { Delete } from '../../icons/Delete'
import { Magnifier } from '../../icons/Magnifier'
import { BaseCard } from '../../pureStyledComponents/BaseCard'
import { Cell, CellRowCSS, CellRowProps } from '../../pureStyledComponents/Cell'
import { PageTitle } from '../../pureStyledComponents/PageTitle'
import { TexfieldPartsCSS, TextfieldCSS } from '../../pureStyledComponents/Textfield'

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

const TableControls = styled.div`
  align-items: center;
  display: flex;
  justify-content: space-between;
  margin-bottom: 16px;
`

const SearchWrapper = styled.div`
  ${TextfieldCSS};
  align-items: center;
  display: flex;
  max-width: 100%;
  padding-right: 0;
  width: 565px;

  &:focus-within {
    background-color: ${({ theme }) => theme.textField.backgroundColorActive};
    border-color: ${({ theme }) => (props) =>
      props.error ? theme.textField.errorColor : theme.textField.borderColorActive};
  }
`

const SearchInput = styled.input`
  ${TexfieldPartsCSS};
  background: none;
  border: none;
  color: ${({ theme }) => (props) =>
    props.error ? theme.textField.errorColor : theme.textField.color};
  flex-grow: 1;
  font-size: ${({ theme }) => theme.textField.fontSize};
  font-weight: ${({ theme }) => theme.textField.fontWeight};
  height: ${({ theme }) => theme.textField.height};
  margin: 0 0 0 10px;
  outline: none;
  overflow: hidden;
  padding: 0;
  text-overflow: ellipsis;
  white-space: nowrap;
`

const DeleteSearchTerm = styled.button`
  align-items: center;
  background: none;
  border: none;
  cursor: pointer;
  display: flex;
  flex-shrink: none;
  height: 100%;
  justify-content: center;
  margin: 0;
  outline: none;
  padding: 0;
  width: 38px;

  &[disabled] {
    opacity: 0.5;
  }
`

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
        Header: 'Network',
        accessor: 'chainId',
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

  const filterOptions = [
    {
      title: 'All Auctions',
      onClick: () => {
        setGlobalFilter(undefined)
      },
    },
    {
      title: 'Participation "Yes"',
      onClick: () => {
        setGlobalFilter('Yes')
      },
    },
    {
      title: 'Participation "No"',
      onClick: () => {
        setGlobalFilter('No')
      },
    },
  ]

  return (
    <>
      <SectionTitle style={{ display: 'block' }}>Auctions</SectionTitle>
      <TableControls>
        <SearchWrapper>
          <Magnifier />
          <SearchInput
            onChange={(e) => {
              setGlobalFilter(e.target.value || undefined)
            }}
            placeholder={`Search by auction Id, selling token, buying token, status, date…`}
            value={state.globalFilter || ''}
          />
          <DeleteSearchTerm
            disabled={!state.globalFilter}
            onClick={() => {
              setGlobalFilter(undefined)
            }}
          >
            <Delete />
          </DeleteSearchTerm>
        </SearchWrapper>
        <Dropdown
          activeItemHighlight={false}
          dropdownButtonContent={<ButtonSelect content={<span>adsd</span>} />}
          dropdownPosition={DropdownPosition.right}
          items={filterOptions.map((item, index) => (
            <DropdownItem key={index} onClick={item.onClick}>
              {item.title}
            </DropdownItem>
          ))}
        />
      </TableControls>
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
