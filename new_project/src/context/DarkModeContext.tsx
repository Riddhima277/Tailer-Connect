import React, { createContext, useContext, useState } from "react";

const DarkModeContext = createContext<{
  darkMode: boolean;
  setDarkMode: (v: boolean) => void;
}>({ darkMode: false, setDarkMode: () => {} });

export function DarkModeProvider({ children }: { children: React.ReactNode }) {
  const [darkMode, setDarkMode] = useState(false);
  return (
    <DarkModeContext.Provider value={{ darkMode, setDarkMode }}>
      {children}
    </DarkModeContext.Provider>
  );
}

export function useDarkMode() {
  return useContext(DarkModeContext);
}