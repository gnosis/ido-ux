import styled from 'styled-components'

export const Title = styled.h2`
  color: ${({ theme }) => theme.text1};
  font-size: 16px;
  font-weight: 600;
  line-height: 1.3;
  margin: 0 0 10px;
  text-align: left;
  text-transform: uppercase;

  a {
    color: ${({ theme }) => theme.text1};
    text-decoration: underline;

    &:hover {
      text-decoration: none;
    }
  }
`
