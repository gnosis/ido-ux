import React, { useMemo, useState } from 'react'
import { NavLink } from 'react-router-dom'
import styled from 'styled-components'

import { useFilters, useGlobalFilter, useTable } from 'react-table'

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

const KeyValueStyled = styled(KeyValue)`
  .itemKey,
  .itemValue {
    white-space: nowrap;
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
        Header: 'Type',
        accessor: 'type',
        align: 'flex-start',
        show: true,
        style: {},
        filter: 'searchInTags',
      },
      {
        Header: 'Participation',
        accessor: 'participation',
        align: 'flex-start',
        show: true,
        style: {},
        filter: 'searchInTags',
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
  const [currentDropdownFilter, setCurrentDropdownFilter] = useState<string | undefined>()

  const searchValue = React.useCallback((element: any, filterValue: string) => {
    const isReactElement = element && element.props && element.props.children
    const isString = !isReactElement && typeof element === 'string'
    const value = isReactElement
      ? element.props.children[0].props.children
      : isString
      ? element
      : ''

    return filterValue.length === 0
      ? true
      : String(value).toLowerCase().includes(String(filterValue).toLowerCase())
  }, [])

  const filterTypes = React.useMemo(
    () => ({
      searchInTags: (rows, id, filterValue) =>
        rows.filter((row) => searchValue(row.values[id], filterValue)),
    }),
    [searchValue],
  )

  const globalFilter = React.useMemo(
    () => (rows, columns, filterValue) =>
      rows.filter((row) => {
        let searchResult = false
        for (const column of columns) {
          searchResult = searchResult || searchValue(row.values[column], filterValue)
        }
        return searchResult
      }),
    [searchValue],
  )

  const { prepareRow, rows, setAllFilters, setFilter, setGlobalFilter, state } = useTable(
    {
      columns,
      data,
      filterTypes,
      globalFilter,
    },
    useGlobalFilter,
    useFilters,
  )

  const updateFilter = (column?: string | undefined, value?: string | undefined) => {
    setAllFilters([])
    if (column && value) {
      setFilter(column, value)
    }
  }

  const filterOptions = [
    {
      onClick: updateFilter,
      title: 'All Auctions',
    },
    {
      column: 'participation',
      onClick: updateFilter,
      title: 'Participation "Yes"',
      value: 'yes',
    },
    {
      column: 'participation',
      onClick: updateFilter,
      title: 'Participation "No"',
      value: 'no',
    },
    {
      column: 'status',
      onClick: updateFilter,
      title: 'Ongoing',
      value: 'ongoing',
    },
    {
      column: 'status',
      onClick: updateFilter,
      title: 'Ended',
      value: 'ended',
    },
    {
      column: 'type',
      onClick: updateFilter,
      title: 'Private',
      value: 'private',
    },
    {
      column: 'type',
      onClick: updateFilter,
      title: 'Public',
      value: 'public',
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
              setGlobalFilter(e.target.value)
            }}
            placeholder={`Search by auction Id, selling token, buying token, date…`}
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
          dropdownButtonContent={
            <ButtonSelect
              content={
                <span>
                  {!currentDropdownFilter ? filterOptions[0].title : currentDropdownFilter}
                </span>
              }
            />
          }
          dropdownPosition={DropdownPosition.right}
          items={filterOptions.map((item, index) => (
            <DropdownItem
              key={index}
              onClick={() => {
                item.onClick(item.column, item.value)
                setCurrentDropdownFilter(item.title)
              }}
            >
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
              columns={'85px 1fr 1fr 1fr 1fr 1fr 1fr 1fr 1fr 40px'}
              key={i}
              to={row.original['url'] ? row.original['url'] : '#'}
            >
              {row.cells.map(
                (cell, j) =>
                  cell.render('show') && (
                    <Cell key={j}>
                      <KeyValueStyled
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
