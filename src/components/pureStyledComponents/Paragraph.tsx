import styled from 'styled-components'

export const Paragraph = styled.p`
  color: ${({ theme }) => theme.text1};
  font-size: 16px;
  font-weight: 400;
  line-height: 1.4;
  margin: 0 0 30px;
  text-align: left;

  &:last-child {
    margin-bottom: 0;
  }

  a {
    color: ${({ theme }) => theme.primary1};
    text-decoration: underline;

    &:hover {
      text-decoration: none;
    }
  }

  strong {
    font-weight: 700;
  }
`
