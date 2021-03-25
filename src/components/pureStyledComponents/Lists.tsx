import styled, { css } from 'styled-components'

const commonCSS = css`
  color: ${({ theme }) => theme.text1};
  font-size: 16px;
  font-weight: 400;
  line-height: 1.4;
  margin: 0 0 30px;
  padding: 0;
  text-align: left;

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

export const UnorderedList = styled.ul`
  ${commonCSS}
`

export const OrderedList = styled.ol`
  ${commonCSS}

  li {
    ul,
    ol {
      margin-bottom: 0;
    }

    li {
      list-style: lower-latin;

      li {
        list-style: lower-roman;
      }
    }
  }
`

export const Li = styled.li`
  margin: 0 0 5px 20px;
`

export const OrderedListMultiNumber = styled(OrderedList)`
  counter-reset: item;
`

export const LiMultiNumber = styled(Li)`
  display: block;
  margin-left: 0;

  &:before {
    content: counters(item, '.') '. ';
    counter-increment: item;
    display: inline-block;
    margin-right: 10px;
  }

  > ol {
    margin-left: 20px;
  }
`

export const LiTitle = styled.h3`
  color: ${({ theme }) => theme.text1};
  display: inline-block;
  font-size: 16px;
  font-weight: 600;
  line-height: 1.3;
  margin: 30px 0 10px 0;
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

export const LiTitleNoMarginTop = styled(LiTitle)`
  margin-top: 0;
`
