import styled from 'styled-components'

export const ErrorWrapper = styled.div`
  margin-bottom: 20px;
`

export const ErrorRow = styled.div`
  align-items: center;
  display: flex;
  margin-bottom: 5px;
  flex-wrap: wrap;
  justify-content: center;
  &:last-child {
    margin-bottom: 0;
  }

  > svg {
    margin-bottom: auto;
  }
  @media (min-width: ${({ theme }) => theme.themeBreakPoints.sm}) {
    flex-wrap: nowrap;
    justify-content: flex-start;
  }
`

export const ErrorText = styled.div`
  color: ${({ theme }) => theme.text1};
  font-size: 15px;
  font-weight: bold;
  line-height: 1.4;
  margin: 0 0 0 10px;
  position: relative;
  text-align: left;
  top: 1px;
`
