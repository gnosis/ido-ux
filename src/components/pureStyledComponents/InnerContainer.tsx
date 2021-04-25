import styled from 'styled-components'

export const InnerContainer = styled.div`
  display: flex;
  flex-direction: column;
  flex-grow: 1;
  flex-shrink: 0;
  margin: 0 auto;
  max-width: ${({ theme }) => theme.layout.maxWidth};
  padding-left: ${({ theme }) => theme.layout.horizontalPadding};
  padding-right: ${({ theme }) => theme.layout.horizontalPadding};
  width: 100%;
`
