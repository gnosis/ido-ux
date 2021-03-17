import React, { useMemo, useState } from 'react'
import { NavLink } from 'react-router-dom'
import styled, { css } from 'styled-components'

import { useFilters, useGlobalFilter, usePagination, useTable } from 'react-table'

import { ButtonSelect } from '../../buttons/ButtonSelect'
import { Dropdown, DropdownItem, DropdownPosition } from '../../common/Dropdown'
import { InlineLoading } from '../../common/InlineLoading'
import { KeyValue } from '../../common/KeyValue'
import { SpinnerSize } from '../../common/Spinner'
import { ChevronRight } from '../../icons/ChevronRight'
import { Delete } from '../../icons/Delete'
import { InfoIcon } from '../../icons/InfoIcon'
import { Magnifier } from '../../icons/Magnifier'
import { BaseCard } from '../../pureStyledComponents/BaseCard'
import { Cell, CellRowCSS, CellRowProps } from '../../pureStyledComponents/Cell'
import { EmptyContentText, EmptyContentWrapper } from '../../pureStyledComponents/EmptyContent'
import { PageTitle } from '../../pureStyledComponents/PageTitle'
import { TexfieldPartsCSS, TextfieldCSS } from '../../pureStyledComponents/Textfield'

const Wrapper = styled.div`
  padding-bottom: 60px;
`

const Table = styled(BaseCard)`
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

const Pagination = styled.div`
  align-items: center;
  border-top: 1px solid ${({ theme }) => theme.border};
  display: flex;
  height: 56px;
  justify-content: flex-end;
  padding: 0 15px;
`

const PaginationTextCSS = css`
  color: ${({ theme }) => theme.text1};
  font-size: 13px;
  font-weight: normal;
`

const PaginationText = styled.span`
  ${PaginationTextCSS}
`

const PaginationBreak = styled.span`
  ${PaginationTextCSS}
  margin: 0 12px;
`

const PaginationButton = styled.button`
  align-items: center;
  border: none;
  cursor: pointer;
  display: flex;
  height: 35px;
  outline: none;
  padding: 0;
  user-select: none;
  width: 35px;

  &:hover {
    .fill {
      color: ${({ theme }) => theme.primary1};
    }
  }

  &[disabled],
  &[disabled]:hover {
    cursor: not-allowed;
    opacity: 0.5;

    .fill {
      color: ${({ theme }) => theme.text1};
    }
  }
`

const ChevronLeft = styled(ChevronRight)`
  transform: translateZ(90deg);
`

const PagesSelect = styled.select`
  border: none;
  -webkit-appearance: none;
  -moz-appearance: none;
  appearance: none;
  -ms-appearance: none;
`

const Loading = styled(InlineLoading)`
  min-height: 290px;
`

interface Props {
  tableData: any[]
  isLoading: boolean
}

const AllAuctions: React.FC<Props> = (props) => {
  const { isLoading = true, tableData, ...restProps } = props
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
  const data = useMemo(() => Object.values(tableData), [tableData])
  const [currentDropdownFilter, setCurrentDropdownFilter] = useState<string | undefined>()

  const searchValue = React.useCallback((element: any, filterValue: string) => {
    const isReactElement = element && element.props && element.props.children
    const isString = !isReactElement && typeof element === 'string'
    /**
     * this will work only for strings, and react elements like
     * <>
     *   <span>some text</span>
     *   <Icon />
     * </>
     *
     * maybe make it better in the future?
     */
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

  const {
    canNextPage,
    canPreviousPage,
    nextPage,
    page,
    prepareRow,
    previousPage,
    rows,
    setAllFilters,
    setFilter,
    setGlobalFilter,
    setPageSize,
    state,
  } = useTable(
    {
      columns,
      data,
      filterTypes,
      globalFilter,
      initialState: { pageIndex: 0, pageSize: 5 },
    },
    useGlobalFilter,
    useFilters,
    usePagination,
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

  const { pageIndex, pageSize } = state
  const noData = tableData.length === 0

  return (
    <Wrapper {...restProps}>
      <SectionTitle style={{ display: 'block' }}>Auctions</SectionTitle>
      <TableControls>
        <SearchWrapper>
          <Magnifier />
          <SearchInput
            disabled={noData || isLoading}
            onChange={(e) => {
              setGlobalFilter(e.target.value)
            }}
            placeholder={`Search by auction Id, selling token, buying token, date…`}
            value={state.globalFilter || ''}
          />
          <DeleteSearchTerm
            disabled={!state.globalFilter || noData || isLoading}
            onClick={() => {
              setGlobalFilter(undefined)
            }}
          >
            <Delete />
          </DeleteSearchTerm>
        </SearchWrapper>
        <Dropdown
          activeItemHighlight={false}
          disabled={noData || isLoading}
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
      {isLoading ? (
        <Loading message="Loading..." size={SpinnerSize.small} />
      ) : noData ? (
        <EmptyContentWrapper>
          <InfoIcon />
          <EmptyContentText>No auctions.</EmptyContentText>
        </EmptyContentWrapper>
      ) : (
        <>
          <Table>
            {page.map((row, i) => {
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
            <Pagination>
              <PaginationText>Items per page</PaginationText>{' '}
              <PagesSelect
                onChange={(e) => {
                  setPageSize(Number(e.target.value))
                }}
                value={pageSize}
              >
                {[5, 10, 20, 30, 40, 50].map((pageSize) => (
                  <option key={pageSize} value={pageSize}>
                    {pageSize}
                  </option>
                ))}
              </PagesSelect>
              <PaginationBreak>|</PaginationBreak>
              <PaginationText>
                {pageIndex + 1 === 1 ? 1 : pageIndex * pageSize + 1} - {(pageIndex + 1) * pageSize}{' '}
                of {rows.length} transactions
              </PaginationText>{' '}
              <PaginationButton disabled={!canPreviousPage} onClick={() => previousPage()}>
                <ChevronLeft />
              </PaginationButton>
              <PaginationButton disabled={!canNextPage} onClick={() => nextPage()}>
                <ChevronRight />
              </PaginationButton>
            </Pagination>
          </Table>
        </>
      )}
    </Wrapper>
  )
}

export default AllAuctions
