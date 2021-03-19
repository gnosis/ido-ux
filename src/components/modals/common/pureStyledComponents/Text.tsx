import styled from 'styled-components'

export const Text = styled.p<{ textAlign?: string; fontSize?: string }>`
  color: ${({ theme }) => theme.text1};
  font-size: ${(props) => props.fontSize};
  font-weight: 400;
  line-height: 1.5;
  margin: 0 0 15px;
  text-align: ${(props) => props.textAlign};

  &:last-child {
    margin-bottom: 0;
  }
`

Text.defaultProps = {
  fontSize: '16px',
  textAlign: 'left',
}
