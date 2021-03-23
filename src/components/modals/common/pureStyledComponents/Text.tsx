import styled from 'styled-components'

export const Text = styled.p<{
  textAlign?: string
  fontSize?: string
  fontWeight?: string
  margin?: string
}>`
  color: ${({ theme }) => theme.text1};
  font-size: ${(props) => props.fontSize};
  font-weight: ${(props) => props.fontWeight};
  line-height: 1.5;
  margin: ${(props) => props.margin};
  text-align: ${(props) => props.textAlign};

  &:last-child {
    margin-bottom: 0;
  }
`

Text.defaultProps = {
  fontSize: '16px',
  fontWeight: '400',
  textAlign: 'left',
  margin: ' 0 0 15px',
}
