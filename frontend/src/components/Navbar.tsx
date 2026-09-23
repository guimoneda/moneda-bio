import React, { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { AnimatePresence, motion, useMotionValueEvent, useScroll, useSpring } from 'motion/react';
import { useReducedMotion } from '../hooks/useReducedMotion';
import ThemeToggle from './ThemeToggle';

const NAV_LINKS = [
  { index: '01', label: 'Index', to: '/' },
  { index: '02', label: 'Experience', to: '/jobs' },
];

const Navbar: React.FC = () => {
  const { pathname } = useLocation();
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const reduced = useReducedMotion();

  const { scrollY, scrollYProgress } = useScroll();
  const progress = useSpring(scrollYProgress, { stiffness: 220, damping: 40, restDelta: 0.001 });

  useMotionValueEvent(scrollY, 'change', (v) => setScrolled(v > 24));

  // Close the sheet on navigation, and never leave the page scroll-locked.
  useEffect(() => setMenuOpen(false), [pathname]);

  useEffect(() => {
    if (!menuOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setMenuOpen(false);
    };
    const previous = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    window.addEventListener('keydown', onKey);
    return () => {
      document.body.style.overflow = previous;
      window.removeEventListener('keydown', onKey);
    };
  }, [menuOpen]);

  return (
    <>
      <nav
        data-testid="navbar"
        className={`fixed inset-x-0 top-0 z-50 transition-colors duration-500 ease-instrument ${
          scrolled || menuOpen ? 'border-b border-rule/15 bg-canvas/85 backdrop-blur-xl' : 'border-b border-transparent'
        }`}
      >
        {/* Reading progress. A hairline, not a bar — it should be felt, not read. */}
        <motion.div
          className="absolute inset-x-0 top-0 h-px origin-left bg-signal"
          style={{ scaleX: reduced ? 0 : progress }}
          aria-hidden="true"
        />

        <div className="mx-auto flex h-[4.5rem] max-w-shell items-center justify-between gap-6 px-6 sm:px-8">
          <Link
            to="/"
            data-testid="brand"
            className="group flex items-center gap-3"
            aria-label="Moneda — home"
          >
            <span className="flex h-7 w-7 items-center justify-center bg-signal font-display text-[0.9rem] font-bold leading-none text-signal-ink transition-transform duration-500 ease-instrument group-hover:rotate-[-8deg]">
              M
            </span>
            <span className="flex items-baseline gap-2">
              <span className="font-display text-[1.05rem] font-semibold uppercase tracking-[0.12em] text-ink">
                Moneda
              </span>
              <span className="label hidden text-mute/70 sm:inline">DELIVERY</span>
            </span>
          </Link>

          {/*
            One control set. The theme toggle and menu button are rendered once
            and shown or hidden by breakpoint, so neither is duplicated in the
            accessibility tree.
          */}
          <div className="flex items-center gap-1 sm:gap-2">
            <div className="hidden items-center gap-1 md:flex">
              {NAV_LINKS.map((link) => {
                const active = pathname === link.to;
                return (
                  <Link
                    key={link.to}
                    to={link.to}
                    aria-current={active ? 'page' : undefined}
                    className="group relative px-4 py-2"
                  >
                    <span className="flex items-baseline gap-2">
                      <span
                        className={`font-mono text-[0.65rem] transition-colors ${
                          active ? 'text-signal' : 'text-mute/60'
                        }`}
                      >
                        {link.index}
                      </span>
                      <span
                        className={`text-sm transition-colors ${
                          active ? 'text-ink' : 'text-mute group-hover:text-ink'
                        }`}
                      >
                        {link.label}
                      </span>
                    </span>
                    {/* Underline wipes in from the left rather than fading. */}
                    <span
                      className={`absolute inset-x-4 bottom-1 h-px origin-left bg-signal transition-transform duration-500 ease-instrument ${
                        active ? 'scale-x-100' : 'scale-x-0 group-hover:scale-x-100'
                      }`}
                    />
                  </Link>
                );
              })}
            </div>

            <span className="mx-2 hidden h-4 w-px bg-rule/20 md:block" aria-hidden="true" />

            <ThemeToggle />

            <a
              href="/admin/"
              className="ml-1 hidden border border-rule/25 px-4 py-2 text-sm text-mute transition-colors duration-300 hover:border-signal hover:text-signal md:inline-flex"
            >
              Admin
            </a>

            <button
              type="button"
              onClick={() => setMenuOpen((open) => !open)}
              aria-expanded={menuOpen}
              aria-controls="mobile-menu"
              aria-label={menuOpen ? 'Close menu' : 'Open menu'}
              data-testid="menu-toggle"
              className="flex h-10 w-10 flex-col items-center justify-center gap-[5px] border border-rule/25 transition-colors hover:border-signal md:hidden"
            >
              <span
                className={`h-px w-4 bg-ink transition-transform duration-300 ease-instrument ${
                  menuOpen ? 'translate-y-[3px] rotate-45' : ''
                }`}
              />
              <span
                className={`h-px w-4 bg-ink transition-transform duration-300 ease-instrument ${
                  menuOpen ? '-translate-y-[3px] -rotate-45' : ''
                }`}
              />
            </button>
          </div>
        </div>
      </nav>

      <AnimatePresence>
        {menuOpen && (
          <motion.div
            id="mobile-menu"
            data-testid="mobile-menu"
            initial={{ opacity: 0, y: -12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
            className="fixed inset-x-0 top-[4.5rem] z-40 border-b border-rule/15 bg-canvas md:hidden"
          >
            <ul className="mx-auto max-w-shell px-6 pb-8 pt-2">
              {NAV_LINKS.map((link) => (
                <li key={link.to} className="border-t border-rule/15">
                  <Link to={link.to} className="flex items-baseline gap-4 py-5">
                    <span className="font-mono text-[0.65rem] text-signal">{link.index}</span>
                    <span className="text-display-sm font-display text-ink">{link.label}</span>
                  </Link>
                </li>
              ))}
              <li className="border-y border-rule/15">
                <a href="/admin/" className="flex items-baseline gap-4 py-5">
                  <span className="font-mono text-[0.65rem] text-signal">03</span>
                  <span className="text-display-sm font-display text-mute">Admin</span>
                </a>
              </li>
            </ul>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default Navbar;
