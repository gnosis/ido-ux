import styled from 'styled-components'

const MARGIN_BOTTOM = '12px'

export const Row = styled.div<{ cols?: string; paddingTop?: boolean }>`
  display: grid;
  grid-column-gap: 20px;
  grid-row-gap: ${MARGIN_BOTTOM};
  grid-template-columns: 1fr;
  margin-bottom: ${MARGIN_BOTTOM};
  padding-top: ${(props) => (props.paddingTop ? '8px' : '0')};

  &:last-child {
    margin-bottom: 0;
  }

  @media (min-width: ${(props) => props.theme.themeBreakPoints.md}) {
    grid-template-columns: ${(props) => props.cols};
  }
`

Row.defaultProps = {
  cols: '1fr',
  paddingTop: false,
}
