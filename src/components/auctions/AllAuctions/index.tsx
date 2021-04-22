import React, { useMemo, useState } from 'react'
import { NavLink } from 'react-router-dom'
import styled, { css } from 'styled-components'

import { useFilters, useGlobalFilter, usePagination, useTable } from 'react-table'

import { ButtonSelect } from '../../buttons/ButtonSelect'
import { Dropdown, DropdownDirection, DropdownItem, DropdownPosition } from '../../common/Dropdown'
import { KeyValue } from '../../common/KeyValue'
import { ChevronRight } from '../../icons/ChevronRight'
import { Delete } from '../../icons/Delete'
import { InfoIcon } from '../../icons/InfoIcon'
import { Magnifier } from '../../icons/Magnifier'
import { BaseCard } from '../../pureStyledComponents/BaseCard'
import { Cell, CellRowCSS, CellRowProps, getColumns } from '../../pureStyledComponents/Cell'
import { EmptyContentText, EmptyContentWrapper } from '../../pureStyledComponents/EmptyContent'
import { PageTitle } from '../../pureStyledComponents/PageTitle'
import { TexfieldPartsCSS, TextfieldCSS } from '../../pureStyledComponents/Textfield'

const Wrapper = styled.div``

const Table = styled(BaseCard)`
  padding: 0;
`

const SectionTitle = styled(PageTitle)`
  font-size: 22px;
  margin-bottom: 14px;
`

const RowLink = styled(NavLink)<CellRowProps>`
  ${CellRowCSS}
  column-gap: 6px;
  cursor: pointer;
  grid-template-columns: 1fr 1fr;
  padding-left: 10px;
  padding-right: 20px;
  row-gap: 15px;

  &:first-child {
    padding-top: 17px;
  }

  &:last-child,
  &:last-of-type {
    padding-bottom: 17px;
  }

  &:hover {
    background-color: rgba(255, 255, 255, 0.05);
  }

  @media (min-width: ${({ theme }) => theme.themeBreakPoints.md}) {
    column-gap: 10px;
    grid-template-columns: ${(props) => getColumns(props.columns)};
    padding-left: 15px;
    padding-right: 15px;
  }
`

const TableCell = styled(Cell)`
  &:last-child {
    position: absolute;
    right: 15px;
    top: 50%;
    transform: translateY(-50%);
  }

  @media (min-width: ${({ theme }) => theme.themeBreakPoints.md}) {
    &:last-child {
      position: unset;
      right: auto;
      top: auto;
      transform: none;
    }
  }
`

const KeyValueStyled = styled(KeyValue)`
  .itemKey,
  .itemValue {
    white-space: nowrap;
  }
`

const TableControls = styled.div`
  margin-bottom: 28px;

  @media (min-width: ${({ theme }) => theme.themeBreakPoints.md}) {
    align-items: center;
    display: flex;
    justify-content: space-between;
    margin-bottom: 16px;
  }
`

const SearchWrapper = styled.div`
  ${TextfieldCSS};
  align-items: center;
  display: flex;
  margin-bottom: 12px;
  max-width: 100%;
  padding-left: 9px;
  padding-right: 0;
  width: 565px;

  &:focus-within {
    background-color: ${({ theme }) => theme.textField.backgroundColorActive};
    border-color: ${({ theme }) => (props) =>
      props.error ? theme.textField.errorColor : theme.textField.borderColorActive};
  }

  @media (min-width: ${({ theme }) => theme.themeBreakPoints.md}) {
    margin-bottom: 0;
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
  flex-direction: column;
  justify-content: center;
  min-height: 56px;
  padding: 0 15px;

  @media (min-width: ${({ theme }) => theme.themeBreakPoints.md}) {
    flex-direction: row;
    justify-content: flex-end;
  }
`

const PaginationBlock = styled.span`
  align-items: center;
  display: flex;
  justify-content: center;
`

const PaginationTextCSS = css`
  color: ${({ theme }) => theme.text1};
  font-size: 13px;
  font-weight: normal;
  white-space: nowrap;
`

const PaginationText = styled.span`
  ${PaginationTextCSS}
  margin-right: 8px;
`

const PaginationBreak = styled.span`
  ${PaginationTextCSS}
  display: none;
  margin: 0 12px;

  @media (min-width: ${({ theme }) => theme.themeBreakPoints.md}) {
    display: block;
  }
`

const PaginationButton = styled.button`
  align-items: center;
  background: none;
  border: none;
  cursor: pointer;
  display: flex;
  justify-content: center;
  height: auto;
  outline: none;
  padding: 0;
  user-select: none;
  width: 25px;
  white-space: nowrap;

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

  @media (min-width: ${({ theme }) => theme.themeBreakPoints.md}) {
    height: 35px;
  }
`

const ChevronLeft = styled(ChevronRight)`
  transform: rotateZ(180deg);
`

const DropdownPagination = styled(Dropdown)`
  .dropdownItems {
    min-width: 70px;
  }
`

const PaginationDropdownButton = styled.div`
  ${PaginationTextCSS}
  cursor: pointer;
  white-space: nowrap;
`

const PaginationItem = styled.div`
  align-items: center;
  border-bottom: 1px solid ${(props) => props.theme.dropdown.item.borderColor};
  cursor: pointer;
  display: flex;
  font-size: 14px;
  font-weight: 400;
  height: 32px;
  line-height: 1.2;
  padding: 0 10px;
  white-space: nowrap;

  &:hover {
    background-color: ${(props) => props.theme.dropdown.item.backgroundColorHover};
  }
`

interface Props {
  tableData: any[]
}

const AllAuctions = (props: Props) => {
  const { tableData, ...restProps } = props
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
  const noAuctions = tableData.length === 0
  const noAuctionsFound = page.length === 0
  const noData = noAuctions || noAuctionsFound

  return (
    <Wrapper {...restProps}>
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
      {noData ? (
        <EmptyContentWrapper>
          <InfoIcon />
          <EmptyContentText>
            {noAuctions && 'No auctions.'}
            {noAuctionsFound && 'No auctions found.'}
          </EmptyContentText>
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
                        <TableCell key={j}>
                          <KeyValueStyled
                            align={cell.render('align')}
                            itemKey={cell.render('Header')}
                            itemValue={cell.render('Cell')}
                            style={cell.render('style')}
                          />
                        </TableCell>
                      ),
                  )}
                </RowLink>
              )
            })}
            <Pagination>
              <PaginationBlock>
                <PaginationText>Items per page</PaginationText>{' '}
                <DropdownPagination
                  dropdownButtonContent={
                    <PaginationDropdownButton>{pageSize} ▼</PaginationDropdownButton>
                  }
                  dropdownDirection={DropdownDirection.upwards}
                  dropdownPosition={DropdownPosition.right}
                  items={[5, 10, 20, 30].map((pageSize) => (
                    <PaginationItem
                      key={pageSize}
                      onClick={() => {
                        setPageSize(Number(pageSize))
                      }}
                    >
                      {pageSize}
                    </PaginationItem>
                  ))}
                />
              </PaginationBlock>
              <PaginationBreak>|</PaginationBreak>
              <PaginationBlock>
                <PaginationText>
                  {pageIndex + 1 === 1 ? 1 : pageIndex * pageSize + 1} -{' '}
                  {rows.length < (pageIndex + 1) * pageSize
                    ? rows.length
                    : (pageIndex + 1) * pageSize}{' '}
                  of {rows.length} auctions
                </PaginationText>{' '}
                <PaginationButton disabled={!canPreviousPage} onClick={() => previousPage()}>
                  <ChevronLeft />
                </PaginationButton>
                <PaginationButton disabled={!canNextPage} onClick={() => nextPage()}>
                  <ChevronRight />
                </PaginationButton>
              </PaginationBlock>
            </Pagination>
          </Table>
        </>
      )}
    </Wrapper>
  )
}

export default AllAuctions
