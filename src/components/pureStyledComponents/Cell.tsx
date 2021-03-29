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
  display: grid;
  grid-template-columns: ${(props) => getColumns(props.columns)};
  padding: 13px 0;
  text-decoration: none;

  &:last-child {
    border-bottom: none;
  }
`

export const CellRow = styled.span<CellRowProps>`
  ${CellRowCSS}
`

CellRow.defaultProps = {
  columns: 1,
}

export const Cell = styled.span`
  /* min-width: fit-content; */
  padding: 0 10px;

  &:first-child {
    padding-left: 15px;
  }

  &:last-child {
    padding-right: 15px;
  }
`
