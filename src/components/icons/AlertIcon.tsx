import React from 'react'
import styled from 'styled-components'

const Wrapper = styled.svg`
  flex-shrink: 0;

  .fill {
    fill-rule: evenodd;
    fill: ${({ theme }) => theme.primary1};
  }
`

export const AlertIcon: React.FC<{ className?: string }> = (props) => {
  return (
    <Wrapper
      className={`alertIcon ${props.className}`}
      height="78"
      viewBox="0 0 78 78"
      width="78"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <path
        className="fill"
        d="M14.812 8a3.249 3.249 0 0 1 3.25 3.25v13a3.25 3.25 0 0 1-6.5 0v-13A3.247 3.247 0 0 1 14.812 8m0 25.187a4.062 4.062 0 1 1-4.062 4.063 4.064 4.064 0 0 1 4.063-4.062"
        transform="translate(24.185 18.004)"
      />
      <path
        className="fill"
        d="M36.749 2a4.718 4.718 0 0 0-4.17 2.444L1.607 59.948A4.749 4.749 0 0 0 5.776 67h61.945a4.748 4.748 0 0 0 4.17-7.052L40.919 4.444A4.715 4.715 0 0 0 36.749 2m0 8.3l28.028 50.226H8.724L36.749 10.3"
        transform="translate(2.251 4.5)"
      />
    </Wrapper>
  )
}
