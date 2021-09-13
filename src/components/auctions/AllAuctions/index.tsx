import React, { useMemo, useRef, useState } from 'react'
import { NavLink } from 'react-router-dom'
import styled, { css } from 'styled-components'

import * as CSS from 'csstype'
import { useFilters, useGlobalFilter, usePagination, useTable } from 'react-table'

import { ButtonSelect } from '../../buttons/ButtonSelect'
import { Dropdown, DropdownDirection, DropdownItem, DropdownPosition } from '../../common/Dropdown'
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
  z-index: 51;
`

const SectionTitle = styled(PageTitle)`
  font-size: 22px;
  margin-bottom: 14px;
`
const rowCss = css<CellRowProps>`
  ${CellRowCSS}
  column-gap: 6px;
  cursor: pointer;
  grid-template-columns: 1fr 1fr;
  padding-left: 10px;
  padding-right: 10px;
  row-gap: 15px;

  &:hover {
    background-color: rgba(255, 255, 255, 0.05);
  }

  @media (min-width: ${({ theme }) => theme.themeBreakPoints.md}) {
    column-gap: 10px;
    grid-template-columns: 1fr 80px 1fr 1fr 1fr 1fr 100px 1fr 100px 20px;
    padding-left: 15px;
    padding-right: 15px;
  }

  @media (min-width: ${({ theme }) => theme.themeBreakPoints.xl}) {
    grid-template-columns: ${(props) => getColumns(props.columns)};
  }
`

const RowLink = styled(NavLink)<CellRowProps>`
  ${rowCss}
`

const RowHead = styled.div<CellRowProps>`
  ${rowCss}
  pointer-events: none;
  font-size: 14px;
  display: none;
  @media (min-width: ${({ theme }) => theme.themeBreakPoints.md}) {
    display: grid;
    grid-template-columns: 1fr 80px 1fr 1fr 1fr 1fr 100px 1fr 100px 20px;
  }
  @media (min-width: ${({ theme }) => theme.themeBreakPoints.xl}) {
    grid-template-columns: ${(props) => getColumns(props.columns)};
  }
`

interface CellProps {
  fs?: string
}
const TableCell = styled(Cell)<Partial<CSS.Properties & CellProps>>`
  color: ${({ theme }) => theme.text1};
  display: flex;
  justify-content: center;
  flex-direction: column;
  font-size: ${(props) => props.fs || '16px'};
  &:last-child {
    position: absolute;
    right: 15px;
    top: 50%;
    transform: translateY(-50%);
  }

  > span {
    display: flex;
    align-items: center;
    > *:not(:last-child) {
      margin-right: 6px;
    }
    &:last-child {
      font-size: 16px;
      font-weight: bold;
      @media (min-width: ${({ theme }) => theme.themeBreakPoints.md}) {
        display: none;
      }
    }
  }

  @media (min-width: ${({ theme }) => theme.themeBreakPoints.xl}) {
    &:last-child {
      position: unset;
      right: auto;
      top: auto;
      transform: none;
    }
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
    border-color: ${({ theme }) =>
      (props) =>
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
  color: ${({ theme }) =>
    (props) =>
      props.error ? theme.textField.errorColor : theme.text1};
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
  min-height: 50px;
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
  color: ${(props) => props.theme.dropdown.item.color};
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

const TBody = styled.div`
  min-height: 266px;
  @media (max-width: ${({ theme }) => theme.themeBreakPoints.md}) {
    > div:first-child {
      position: relative !important;
    }
    > div:not(:first-child) {
      display: none !important;
    }
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

  const sectionHead = useRef(null)

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

  function handleNextPage() {
    nextPage()
    sectionHead.current.scrollIntoView()
  }

  function handlePrevPage() {
    previousPage()
    sectionHead.current.scrollIntoView()
  }
  return (
    <Wrapper ref={sectionHead} {...restProps}>
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
            <RowHead columns={'85px 1fr 1fr 1fr 1fr 1fr 1fr 1fr 1fr 40px'}>
              {prepareRow(page[0])}
              {page[0].cells.map(
                (cell, i) =>
                  cell.render('show') && (
                    <TableCell fs="14px" key={i}>
                      {cell.render('Header')}
                    </TableCell>
                  ),
              )}
            </RowHead>
            <TBody>
              {page.map((row, i) => {
                prepareRow(row)
                return (
                  <RowLink
                    columns={'85px 1fr 1fr 1fr 1fr 1fr 1fr 1fr 1fr 40px'}
                    key={i}
                    to={row.original['url'] ? row.original['url'] : '#'}
                  >
                    {row.cells.map((cell, j) => {
                      return (
                        cell.render('show') && (
                          <TableCell key={j}>
                            <span>
                              {cell.column.Header === 'Selling' || cell.column.Header === 'Buying'
                                ? cell.value.slice(0, 7)
                                : cell.value}
                            </span>
                            <span>{cell.render('Header')}</span>
                          </TableCell>
                        )
                      )
                    })}
                  </RowLink>
                )
              })}
            </TBody>
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
                <PaginationButton disabled={!canPreviousPage} onClick={() => handlePrevPage()}>
                  <ChevronLeft />
                </PaginationButton>
                <PaginationButton disabled={!canNextPage} onClick={() => handleNextPage()}>
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
