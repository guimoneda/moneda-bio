import React from 'react';
import { motion } from 'motion/react';
import { useReducedMotion } from '../hooks/useReducedMotion';

interface SplitTextProps {
  text: string;
  className?: string;
  delay?: number;
  /** Seconds between each character. */
  stagger?: number;
}

/**
 * Per-character entry. Each glyph rises out of its own clipping mask, which
 * reads as type being set rather than a block fading in.
 *
 * Accessibility: the split glyphs are hidden from assistive technology and the
 * real string is carried alongside them in a visually-hidden node.
 *
 * An `aria-label` on the wrapper computes the same accessible name in Chromium,
 * but ARIA prohibits `aria-label` on generic roles (a bare `span`), so support
 * is not guaranteed. A real text node needs no such guarantee.
 */
const SplitText: React.FC<SplitTextProps> = ({ text, className = '', delay = 0, stagger = 0.032 }) => {
  const reduced = useReducedMotion();

  if (reduced) {
    return <span className={className}>{text}</span>;
  }

  return (
    <span className={className}>
      <span className="sr-only">{text}</span>

      <span aria-hidden="true">
        {Array.from(text).map((char, i) => (
          <span
            // Characters repeat within a word, so the index is the only stable key.
            // eslint-disable-next-line react/no-array-index-key
            key={`${char}-${i}`}
            className="inline-block overflow-hidden align-bottom"
          >
            <motion.span
              className="inline-block"
              initial={{ y: '105%' }}
              animate={{ y: '0%' }}
              transition={{ duration: 0.85, delay: delay + i * stagger, ease: [0.22, 1, 0.36, 1] }}
            >
              {char === ' ' ? ' ' : char}
            </motion.span>
          </span>
        ))}
      </span>
    </span>
  );
};

export default SplitText;
