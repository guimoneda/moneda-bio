import React from 'react';
import { useReducedMotion } from '../hooks/useReducedMotion';

interface MarqueeProps {
  items: string[];
}

/**
 * Edge-to-edge running band of capabilities. The list is rendered twice and
 * translated by exactly -50%, so the seam is mathematically invisible.
 */
const Marquee: React.FC<MarqueeProps> = ({ items }) => {
  const reduced = useReducedMotion();

  const Row = ({ hidden }: { hidden?: boolean }) => (
    <ul className="flex shrink-0 items-center" aria-hidden={hidden || undefined}>
      {items.map((item) => (
        <li key={item} className="flex items-center whitespace-nowrap">
          <span className="label px-6 py-4 text-ink/70 sm:px-8">{item}</span>
          <span className="h-1 w-1 bg-signal" aria-hidden="true" />
        </li>
      ))}
    </ul>
  );

  if (reduced) {
    // Static, wrapped, fully readable — not a stalled animation.
    return (
      <div className="overflow-hidden border-y border-rule/15 py-1">
        <div className="mx-auto flex max-w-shell flex-wrap items-center px-6">
          <Row />
        </div>
      </div>
    );
  }

  return (
    <div className="group relative overflow-hidden border-y border-rule/15">
      <div className="flex w-max animate-marquee group-hover:[animation-play-state:paused]">
        <Row />
        <Row hidden />
      </div>
      {/* Feathered edges so the band reads as continuous rather than clipped. */}
      <div className="pointer-events-none absolute inset-y-0 left-0 w-16 bg-gradient-to-r from-canvas to-transparent sm:w-32" />
      <div className="pointer-events-none absolute inset-y-0 right-0 w-16 bg-gradient-to-l from-canvas to-transparent sm:w-32" />
    </div>
  );
};

export default Marquee;
