import styled from 'styled-components'

export const Paragraph = styled.p`
  color: ${(props) => props.theme.colors.textColor};
  font-size: 16px;
  font-weight: 400;
  line-height: 1.4;
  margin: 0 0 30px;
  text-align: left;

  &:last-child {
    margin-bottom: 0;
  }

  a {
    color: ${(props) => props.theme.colors.primary};
    text-decoration: underline;

    &:hover {
      text-decoration: none;
    }
  }

  strong {
    font-weight: 700;
  }
`
