import React, { useCallback } from 'react'
import styled from 'styled-components'

const StyledRangeInput = styled.input<{ value: number }>`
  -webkit-appearance: none; /* Hides the slider so that custom slider can be made */
  width: 100%; /* Specific width is required for Firefox. */
  background: transparent; /* Otherwise white in Chrome */
  cursor: pointer;

  &:focus {
    outline: none;
  }

  &::-moz-focus-outer {
    border: 0;
  }

  &::-webkit-slider-thumb {
    -webkit-appearance: none;
    height: 28px;
    width: 28px;
    background-color: #565a69;
    border-radius: 100%;
    border: none;
    transform: translateY(-50%);
    color: ${({ theme }) => theme.bg1};

    &:hover,
    &:focus {
      box-shadow: 0px 0px 1px rgba(0, 0, 0, 0.1), 0px 4px 8px rgba(0, 0, 0, 0.08),
        0px 16px 24px rgba(0, 0, 0, 0.06), 0px 24px 32px rgba(0, 0, 0, 0.04);
    }
  }

  &::-moz-range-thumb {
    height: 28px;
    width: 28px;
    background-color: #565a69;
    border-radius: 100%;
    border: none;
    color: ${({ theme }) => theme.bg1};

    &:hover,
    &:focus {
      box-shadow: 0px 0px 1px rgba(0, 0, 0, 0.1), 0px 4px 8px rgba(0, 0, 0, 0.08),
        0px 16px 24px rgba(0, 0, 0, 0.06), 0px 24px 32px rgba(0, 0, 0, 0.04);
    }
  }

  &::-ms-thumb {
    height: 28px;
    width: 28px;
    background-color: #565a69;
    border-radius: 100%;
    color: ${({ theme }) => theme.bg1};

    &:hover,
    &:focus {
      box-shadow: 0px 0px 1px rgba(0, 0, 0, 0.1), 0px 4px 8px rgba(0, 0, 0, 0.08),
        0px 16px 24px rgba(0, 0, 0, 0.06), 0px 24px 32px rgba(0, 0, 0, 0.04);
    }
  }

  &::-webkit-slider-runnable-track {
    background: linear-gradient(
      90deg,
      ${({ theme }) => theme.bg5},
      ${({ theme }) => theme.bg5} ${({ value }) => value}%,
      ${({ theme }) => theme.bg3} ${({ value }) => value}%,
      ${({ theme }) => theme.bg3}
    );
    height: 2px;
  }

  &::-moz-range-track {
    background: linear-gradient(
      90deg,
      ${({ theme }) => theme.bg5},
      ${({ theme }) => theme.bg5} ${({ value }) => value}%,
      ${({ theme }) => theme.bg3} ${({ value }) => value}%,
      ${({ theme }) => theme.bg3}
    );
    height: 2px;
  }

  &::-ms-track {
    width: 100%;
    border-color: transparent;
    color: transparent;

    background: ${({ theme }) => theme.bg5};
    height: 2px;
  }
  &::-ms-fill-lower {
    background: ${({ theme }) => theme.bg5};
  }
  &::-ms-fill-upper {
    background: ${({ theme }) => theme.bg3};
  }
`

interface InputSliderProps {
  value: number
  onChange: (value: number) => void
}

export default function InputSlider({ onChange, value }: InputSliderProps) {
  const changeCallback = useCallback(
    (e) => {
      onChange(e.target.value)
    },
    [onChange],
  )

  return (
    <StyledRangeInput
      aria-labelledby="input-slider"
      max={100}
      min={0}
      onChange={changeCallback}
      step={1}
      style={{
        width: '90%',
        marginLeft: 15,
        marginRight: 15,
        padding: '15px 0',
      }}
      type="range"
      value={value}
    />
  )
}
