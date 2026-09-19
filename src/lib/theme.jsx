import { createContext, useContext } from 'react'
import { getTheme, NEUTRAL } from './themes'

const ThemeCtx = createContext(getTheme('blue'))

export function ThemeProvider({ theme, children }) {
  const t = typeof theme === 'string' ? getTheme(theme) : theme
  return <ThemeCtx.Provider value={t}>{children}</ThemeCtx.Provider>
}

export const useTheme = () => useContext(ThemeCtx)
export const useNeutral = () => NEUTRAL
