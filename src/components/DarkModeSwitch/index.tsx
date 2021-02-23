import React from 'react'
import { Moon, Sun } from 'react-feather'

import { useDarkModeManager } from '../../state/user/hooks'
import { ButtonSecondary } from '../Button'

export default function DarkModeSwitch() {
  const [darkMode, toggleDarkMode] = useDarkModeManager()

  return (
    <ButtonSecondary ml="0.5rem" onClick={toggleDarkMode} p="8px 12px" width="min-content">
      {darkMode ? <Sun size={16} /> : <Moon size={16} />}
    </ButtonSecondary>
  )
}
