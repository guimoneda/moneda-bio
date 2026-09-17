import React from 'react';
import { useTheme } from '../lib/theme';

/**
 * Ink / Paper. Two squares rather than the usual sun-and-moon pictogram — the
 * control is drawn in the same vocabulary as the rest of the interface.
 */
const ThemeToggle: React.FC = () => {
  const { theme, toggle } = useTheme();
  const nextTheme = theme === 'ink' ? 'paper' : 'ink';

  return (
    <button
      type="button"
      onClick={toggle}
      data-testid="theme-toggle"
      aria-label={`Switch to ${nextTheme} theme`}
      title={`Switch to ${nextTheme} theme`}
      className="group relative flex h-10 w-10 items-center justify-center border border-rule/25 transition-colors duration-300 hover:border-signal"
    >
      <span className="relative block h-3.5 w-3.5">
        <span className="absolute inset-0 border border-ink transition-transform duration-500 ease-instrument group-hover:rotate-45" />
        <span
          className={`absolute inset-0 bg-ink transition-[clip-path] duration-500 ease-instrument group-hover:rotate-45 ${
            theme === 'ink' ? '[clip-path:inset(0_50%_0_0)]' : '[clip-path:inset(0_0_0_50%)]'
          }`}
        />
      </span>
    </button>
  );
};

export default ThemeToggle;
