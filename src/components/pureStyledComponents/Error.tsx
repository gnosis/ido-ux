import styled from 'styled-components'

export const ErrorWrapper = styled.div`
  margin-bottom: 20px;
`

export const ErrorRow = styled.div`
  align-items: center;
  display: flex;
  margin-bottom: 5px;

  &:last-child {
    margin-bottom: 0;
  }

  > svg {
    margin-bottom: auto;
  }
`

export const ErrorText = styled.div`
  color: ${({ theme }) => theme.text1};
  font-size: 15px;
  font-weight: normal;
  line-height: 1.4;
  margin: 0 0 0 15px;
  position: relative;
  text-align: left;
  top: 1px;
`
