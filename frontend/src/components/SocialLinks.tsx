import React from 'react';

const LINKS = [
  { name: 'GitHub', handle: 'guimoneda', url: 'https://github.com/guimoneda/' },
  { name: 'LinkedIn', handle: 'in/moneda', url: 'https://www.linkedin.com/in/moneda/' },
  { name: 'Instagram', handle: '@guimoneda', url: 'https://www.instagram.com/guimoneda' },
];

/**
 * Social links as an index, not a row of coloured glyphs. Each row is a full
 * click target with the destination handle shown in monospace — the reader knows
 * where they are going before they go.
 */
const SocialLinks: React.FC = () => (
  <ul className="w-full border-t border-rule/15" data-testid="social-links">
    {LINKS.map((link) => (
      <li key={link.name} className="group border-b border-rule/15">
        <a
          href={link.url}
          target="_blank"
          rel="noopener noreferrer"
          className="relative flex items-baseline justify-between gap-6 py-5 sm:py-6"
        >
          <span className="pointer-events-none absolute inset-0 origin-left scale-x-0 bg-panel transition-transform duration-500 ease-instrument group-hover:scale-x-100" />

          <span className="relative flex items-baseline gap-4 sm:gap-6">
            <span
              className="font-mono text-[0.7rem] text-signal opacity-0 transition-opacity duration-300 group-hover:opacity-100"
              aria-hidden="true"
            >
              &#8599;
            </span>
            <span className="font-display text-display-sm font-semibold text-ink transition-transform duration-500 ease-instrument group-hover:translate-x-1">
              {link.name}
            </span>
          </span>

          <span className="relative font-mono text-meta text-mute">{link.handle}</span>
        </a>
      </li>
    ))}
  </ul>
);

export default SocialLinks;
