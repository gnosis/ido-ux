import styled from 'styled-components'

export const BoxTitle = styled.div`
  text-align: center;
  justify-content: center;
  height: 3rem;
  flex: 1 0 auto;
  border-radius: 3rem;
  outline: none;
  text-decoration: none;
  color: ${({ theme }) => theme.text1};
  font-size: 20px;
`
