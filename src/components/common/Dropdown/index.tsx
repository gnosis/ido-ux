import { transparentize } from 'polished'
import React, { DOMAttributes, createRef, useCallback, useEffect, useState } from 'react'
import styled, { css } from 'styled-components'

import { BaseCard } from '../../pureStyledComponents/BaseCard'

export enum DropdownPosition {
  center,
  left,
  right,
}

export enum DropdownDirection {
  downwards = 'down',
  upwards = 'up',
}

const Wrapper = styled.div<{ isOpen: boolean; disabled: boolean }>`
  outline: none;
  pointer-events: ${(props) => (props.disabled ? 'none' : 'initial')};
  position: relative;
  z-index: ${(props) => (props.isOpen ? '100' : '50')};

  &[disabled] {
    cursor: not-allowed;
    opacity: 0.5;
  }
`

const ButtonContainer = styled.div`
  background-color: transparent;
  border: none;
  display: block;
  outline: none;
  padding: 0;
  user-select: none;
  width: 100%;
`

const PositionLeftCSS = css`
  left: 0;
`

const PositionRightCSS = css`
  right: 0;
`

const PositionCenterCSS = css`
  left: 50%;
  transform: translateX(-50%);
`

const DirectionDownwardsCSS = css`
  top: calc(100% + 10px);
`

const DirectionUpwardsCSS = css`
  bottom: calc(100% + 10px);
`

const Items = styled(BaseCard)<{
  dropdownDirection?: DropdownDirection
  dropdownPosition?: DropdownPosition
  fullWidth?: boolean
  isOpen: boolean
}>`
  background: ${({ theme }) => theme.dropdown.bg2};
  border-radius: ${({ theme }) => theme.dropdown.borderRadius};
  border: 1px solid ${({ theme }) => theme.dropdown.border};
  box-shadow: ${({ theme }) => theme.dropdown.boxShadow};
  display: ${(props) => (props.isOpen ? 'block' : 'none')};
  min-width: 160px;
  position: absolute;
  white-space: nowrap;

  ${(props) => props.fullWidth && 'width: 100%;'}
  ${(props) => (props.dropdownPosition === DropdownPosition.left ? PositionLeftCSS : '')}
  ${(props) => (props.dropdownPosition === DropdownPosition.right ? PositionRightCSS : '')}
  ${(props) => (props.dropdownPosition === DropdownPosition.center ? PositionCenterCSS : '')}
  ${(props) =>
    props.dropdownDirection === DropdownDirection.downwards ? DirectionDownwardsCSS : ''}
  ${(props) => (props.dropdownDirection === DropdownDirection.upwards ? DirectionUpwardsCSS : '')}
`

Items.defaultProps = {
  dropdownDirection: DropdownDirection.downwards,
  dropdownPosition: DropdownPosition.left,
  fullWidth: false,
  isOpen: false,
}

export interface DropdownItemProps {
  disabled?: boolean
}

export const DropdownItemCSS = css<DropdownItemProps>`
  align-items: center;
  background-color: ${(props) => props.theme.dropdown.item.backgroundColor};
  border-bottom: 1px solid ${(props) => props.theme.dropdown.item.borderColor};
  color: ${(props) => props.theme.dropdown.item.color};
  cursor: pointer;
  display: flex;
  font-size: 14px;
  font-weight: 400;
  line-height: 1.4;
  min-height: ${(props) => props.theme.dropdown.item.height};
  overflow: hidden;
  padding: 10px ${(props) => props.theme.dropdown.item.paddingHorizontal};
  text-decoration: none;
  user-select: none;

  &.isActive {
    color: ${(props) => props.theme.dropdown.item.colorActive};
    font-weight: 600;
  }

  &:first-child {
    border-top-left-radius: ${(props) => props.theme.cards.borderRadius};
    border-top-right-radius: ${(props) => props.theme.cards.borderRadius};
  }

  &:last-child {
    border-bottom-left-radius: ${(props) => props.theme.cards.borderRadius};
    border-bottom-right-radius: ${(props) => props.theme.cards.borderRadius};
    border-bottom: none;
  }
  &.isActive,
  &:hover {
    background-color: ${({ theme }) => transparentize(0.9, theme.text2)};
  }

  &:disabled,
  &[disabled] {
    &,
    &:hover {
      background-color: ${(props) => props.theme.dropdown.item.backgroundColor};
      cursor: not-allowed;
      font-weight: 400;
      opacity: 0.5;
      pointer-events: none;
    }
  }
`

export const DropdownItem = styled.div<DropdownItemProps>`
  ${DropdownItemCSS}
`

DropdownItem.defaultProps = {
  disabled: false,
}

interface Props extends DOMAttributes<HTMLDivElement> {
  activeItemHighlight?: boolean | undefined
  className?: string
  closeOnClick?: boolean
  currentItem?: number | undefined
  disabled?: boolean
  dropdownButtonContent?: React.ReactNode | string
  dropdownDirection?: DropdownDirection | undefined
  dropdownPosition?: DropdownPosition | undefined
  fullWidth?: boolean
  items: Array<unknown>
  triggerClose?: boolean
}

export const Dropdown: React.FC<Props> = (props) => {
  const {
    activeItemHighlight = true,
    className = '',
    closeOnClick = true,
    currentItem = 0,
    disabled = false,
    dropdownButtonContent,
    dropdownDirection,
    dropdownPosition,
    fullWidth,
    items,
    triggerClose,
    ...restProps
  } = props
  const [isOpen, setIsOpen] = useState<boolean>(false)
  const node = createRef<HTMLDivElement>()

  const onButtonClick = useCallback(
    (e) => {
      e.stopPropagation()
      if (disabled) return
      setIsOpen(!isOpen)
    },
    [disabled, isOpen],
  )

  useEffect(() => {
    // Note: you can use triggerClose to close the dropdown when clicking on a specific element
    if (triggerClose) {
      setIsOpen(false)
    }

    // Note: This code handles closing when clickin outside of the dropdown
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const handleClick = (e: any) => {
      if (node && node.current && node.current.contains(e.target)) {
        return
      }
      setIsOpen(false)
    }

    document.addEventListener('mousedown', handleClick)

    return () => {
      document.removeEventListener('mousedown', handleClick)
    }
  }, [node, triggerClose])

  return (
    <Wrapper
      className={`dropdown ${isOpen ? 'isOpen' : ''} ${className}`}
      disabled={disabled}
      isOpen={isOpen}
      ref={node}
      {...restProps}
    >
      <ButtonContainer className="dropdownButton" onClick={onButtonClick}>
        {dropdownButtonContent}
      </ButtonContainer>
      <Items
        className="dropdownItems"
        dropdownDirection={dropdownDirection}
        dropdownPosition={dropdownPosition}
        fullWidth={fullWidth}
        isOpen={isOpen}
        noPadding
      >
        {
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          items.map((item: any, index: number) => {
            const isActive = activeItemHighlight && index === currentItem
            const dropdownItem = React.cloneElement(item, {
              className: `dropdownItem ${isActive && 'isActive'}`,
              key: item.key ? item.key : index,
              onClick: (e) => {
                e.stopPropagation()

                if (closeOnClick) {
                  setIsOpen(false)
                }

                if (!item.props.onClick) {
                  return
                }

                item.props.onClick()
              },
            })

            return dropdownItem
          })
        }
      </Items>
    </Wrapper>
  )
}
