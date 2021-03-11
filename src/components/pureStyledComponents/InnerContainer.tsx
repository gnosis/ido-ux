import styled from 'styled-components'

export const InnerContainer = styled.div`
  display: flex;
  flex-direction: column;
  flex-grow: 1;
  flex-shrink: 0;
  margin: 0 auto;
  max-width: ${(props) => props.theme.layout.maxWidth};
  padding-left: ${(props) => props.theme.layout.horizontalPadding};
  padding-right: ${(props) => props.theme.layout.horizontalPadding};
  width: 100%;
`
