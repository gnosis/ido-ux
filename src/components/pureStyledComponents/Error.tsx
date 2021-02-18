import styled from 'styled-components'

export const ErrorContainer = styled.div`
  padding: 8px 0 0 0;
`

export const Error = styled.p`
  color: ${(props) => props.theme.colors.error};
  font-size: 12px;
  font-weight: 500;
  line-height: 1.4;
  margin: 0 0 5px 0;
  text-align: left;
  text-transform: none;

  &:last-child {
    margin-bottom: 0;
  }
`
