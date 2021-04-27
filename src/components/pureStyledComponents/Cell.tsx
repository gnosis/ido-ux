import styled, { css } from 'styled-components'

export const getColumns = (columns: number | string): string => {
  if (typeof columns === 'string') {
    return columns
  }

  let totalColumns = ''

  for (let c = 0; c < columns; c++) {
    totalColumns += '1fr '
  }

  return totalColumns
}

export interface CellRowProps {
  columns?: number | string
}

export const CellRowCSS = css<CellRowProps>`
  border-bottom: 1px solid ${({ theme }) => theme.border};
  column-gap: 10px;
  display: grid;
  grid-template-columns: ${(props) => getColumns(props.columns)};
  padding: 10px 15px;
  position: relative;
  text-decoration: none;
  z-index: 1;

  &:last-child,
  &:last-of-type {
    border-bottom: none;
  }

  &:hover {
    z-index: 5;
  }
`

export const CellRow = styled.span<CellRowProps>`
  ${CellRowCSS}
`

CellRow.defaultProps = {
  columns: 1,
}

export const Cell = styled.span``
