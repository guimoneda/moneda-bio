import React from 'react';
import { motion } from 'motion/react';
import { useReducedMotion } from '../hooks/useReducedMotion';

interface SectionHeadingProps {
  /** Two-digit section index, e.g. `02`. */
  index: string;
  title: string;
  /** Right-hand monospace annotation — a count, a date span, a status. */
  meta?: string;
  as?: 'h1' | 'h2';
  action?: React.ReactNode;
}

/**
 * The page's structural refrain: a hairline that draws itself in on scroll, a
 * monospace index, the title, and an optional right-aligned annotation. It
 * replaces the repeated `border-l-4 border-indigo-500` block from the old design.
 */
const SectionHeading: React.FC<SectionHeadingProps> = ({ index, title, meta, as = 'h2', action }) => {
  const Tag = as;
  const reduced = useReducedMotion();

  return (
    <div className="relative">
      <motion.div
        className="h-px origin-left bg-signal"
        initial={reduced ? undefined : { scaleX: 0 }}
        whileInView={reduced ? undefined : { scaleX: 1 }}
        viewport={{ once: true, margin: '-80px' }}
        transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
      />

      <div className="flex flex-wrap items-baseline justify-between gap-x-8 gap-y-3 pt-4">
        <div className="flex items-baseline gap-4 sm:gap-6">
          <span className="label text-signal" aria-hidden="true">
            {index}
          </span>
          <Tag className="text-display-md text-ink">{title}</Tag>
        </div>

        <div className="flex items-baseline gap-6">
          {meta && <span className="label hidden sm:inline">{meta}</span>}
          {action}
        </div>
      </div>
    </div>
  );
};

export default SectionHeading;
