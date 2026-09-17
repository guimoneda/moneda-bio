/** @type {import('tailwindcss').Config} */

// Every colour is a CSS custom property holding an "R G B" triple, so the same
// utility classes resolve against whichever theme is on <html data-theme>.
const token = (name) => `rgb(var(--${name}) / <alpha-value>)`;

module.exports = {
  content: ['./src/**/*.{js,jsx,ts,tsx}', './public/index.html'],
  theme: {
    extend: {
      colors: {
        canvas: token('canvas'),
        panel: token('panel'),
        'panel-hi': token('panel-hi'),
        ink: token('ink'),
        mute: token('mute'),
        rule: token('rule'),
        signal: token('signal'),
        'signal-ink': token('signal-ink'),
      },
      fontFamily: {
        display: ['"Bricolage Grotesque"', 'ui-sans-serif', 'system-ui', 'sans-serif'],
        sans: ['"Inter Tight"', 'ui-sans-serif', 'system-ui', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'ui-monospace', 'SFMono-Regular', 'monospace'],
      },
      fontSize: {
        // Fluid, viewport-scaled display sizes — the headline is architecture,
        // not decoration, so it is sized against the viewport rather than a step scale.
        'display-xl': ['clamp(3.25rem, 13.5vw, 13rem)', { lineHeight: '0.82', letterSpacing: '-0.045em' }],
        'display-lg': ['clamp(2.5rem, 8vw, 6.5rem)', { lineHeight: '0.88', letterSpacing: '-0.035em' }],
        'display-md': ['clamp(1.75rem, 4.2vw, 3.25rem)', { lineHeight: '0.95', letterSpacing: '-0.03em' }],
        'display-sm': ['clamp(1.35rem, 2.6vw, 2rem)', { lineHeight: '1.02', letterSpacing: '-0.022em' }],
        label: ['0.6875rem', { lineHeight: '1', letterSpacing: '0.16em' }],
        meta: ['0.75rem', { lineHeight: '1.35', letterSpacing: '0.03em' }],
      },
      maxWidth: {
        shell: '96rem',
        prose: '68ch',
      },
      transitionTimingFunction: {
        // One easing curve for the whole site. Shared vocabulary, not per-component guesses.
        instrument: 'cubic-bezier(0.22, 1, 0.36, 1)',
      },
      keyframes: {
        marquee: {
          from: { transform: 'translate3d(0, 0, 0)' },
          to: { transform: 'translate3d(-50%, 0, 0)' },
        },
        blink: {
          '0%, 45%': { opacity: '1' },
          '50%, 95%': { opacity: '0.25' },
          '100%': { opacity: '1' },
        },
      },
      animation: {
        marquee: 'marquee 38s linear infinite',
        blink: 'blink 2.6s steps(1, end) infinite',
      },
    },
  },
  plugins: [],
};
