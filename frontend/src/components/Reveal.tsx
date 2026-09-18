import React from 'react';
import { motion } from 'motion/react';
import { useReducedMotion } from '../hooks/useReducedMotion';

interface RevealProps {
  children: React.ReactNode;
  delay?: number;
  className?: string;
  /** Distance travelled on entry, in px. */
  y?: number;
  as?: 'div' | 'li' | 'section';
}

/**
 * Scroll-entry primitive. One component owns the site's entry choreography so
 * timing stays consistent instead of being re-guessed at every call site.
 */
const Reveal: React.FC<RevealProps> = ({ children, delay = 0, className, y = 18, as = 'div' }) => {
  const reduced = useReducedMotion();
  const Component = motion[as];

  if (reduced) {
    return <Component className={className}>{children}</Component>;
  }

  return (
    <Component
      className={className}
      initial={{ opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-60px' }}
      transition={{ duration: 0.7, delay, ease: [0.22, 1, 0.36, 1] }}
    >
      {children}
    </Component>
  );
};

export default Reveal;
