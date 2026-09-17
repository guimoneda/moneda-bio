import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';

export type Theme = 'ink' | 'paper';

const STORAGE_KEY = 'moneda-theme';

interface ThemeContextValue {
  theme: Theme;
  toggle: () => void;
}

const ThemeContext = createContext<ThemeContextValue>({ theme: 'ink', toggle: () => {} });

/** Reads whatever the pre-paint script in index.html already resolved. */
const readTheme = (): Theme => {
  if (typeof document === 'undefined') return 'ink';
  return document.documentElement.getAttribute('data-theme') === 'paper' ? 'paper' : 'ink';
};

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [theme, setTheme] = useState<Theme>(readTheme);

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    try {
      localStorage.setItem(STORAGE_KEY, theme);
    } catch {
      // Private browsing or blocked storage: the choice just won't persist.
    }
  }, [theme]);

  const toggle = useCallback(() => setTheme((t) => (t === 'ink' ? 'paper' : 'ink')), []);
  const value = useMemo(() => ({ theme, toggle }), [theme, toggle]);

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
};

export const useTheme = () => useContext(ThemeContext);
