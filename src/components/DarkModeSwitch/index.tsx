import React from "react";
import { Sun, Moon } from "react-feather";
import { useDarkModeManager } from "../../state/user/hooks";

import { ButtonSecondary } from "../Button";

export default function DarkModeSwitch() {
  const [darkMode, toggleDarkMode] = useDarkModeManager();

  return (
    <ButtonSecondary
      onClick={toggleDarkMode}
      p="8px 12px"
      ml="0.5rem"
      width="min-content"
    >
      {darkMode ? <Sun size={16} /> : <Moon size={16} />}
    </ButtonSecondary>
  );
}
