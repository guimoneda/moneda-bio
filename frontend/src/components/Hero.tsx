import React from 'react';
import { motion } from 'motion/react';
import SignalGrid from './SignalGrid';
import SplitText from './SplitText';
import { useReducedMotion } from '../hooks/useReducedMotion';
import { useResource } from '../hooks/useResource';
import { deriveStats, Job } from '../lib/jobs';

const Hero: React.FC = () => {
  const reduced = useReducedMotion();
  const jobs = useResource<Job[]>('/api/jobs/');
  const stats = jobs.status === 'ready' ? deriveStats(jobs.data) : null;

  const fade = (delay: number) =>
    reduced
      ? {}
      : {
          initial: { opacity: 0, y: 16 },
          animate: { opacity: 1, y: 0 },
          transition: { duration: 0.8, delay, ease: [0.22, 1, 0.36, 1] as const },
        };

  // Every figure below is computed from the live API, never hard-coded.
  const tiles = [
    { value: stats ? `${stats.years}+` : '—', label: 'Years shipping' },
    { value: stats ? String(stats.roles) : '—', label: 'Roles held' },
    { value: stats ? `${stats.technologies}` : '—', label: 'Technologies' },
  ];

  return (
    <section className="relative overflow-hidden pt-[4.5rem]" data-testid="hero">
      {/* Column guides: the grid the page is set on, left visible. */}
      <div
        className="pointer-events-none absolute inset-0 mx-auto hidden max-w-shell px-6 sm:px-8 lg:block"
        aria-hidden="true"
      >
        <div className="grid h-full grid-cols-12">
          {Array.from({ length: 12 }).map((_, i) => (
            // eslint-disable-next-line react/no-array-index-key
            <div key={i} className="border-l border-rule/[0.06] last:border-r" />
          ))}
        </div>
      </div>

      <div className="relative mx-auto max-w-shell px-6 pb-16 pt-12 sm:px-8 sm:pt-16">
        {/* Spec-sheet header */}
        <motion.div
          {...fade(0)}
          className="flex flex-wrap items-center justify-between gap-y-3 border-t border-rule/15 pt-4"
        >
          <span className="label flex items-center gap-2.5">
            <span className="h-1.5 w-1.5 animate-blink bg-signal" aria-hidden="true" />
            Available for work
          </span>
          <span className="label">Quality Engineering &amp; Test Automation</span>
          {stats && <span className="label hidden sm:inline">Since {stats.since}</span>}
        </motion.div>

        {/* The name, set to the viewport. */}
        <h1 className="mt-10 sm:mt-14">
          <span className="block text-display-lg font-medium text-mute">
            <SplitText text="Guilherme" delay={0.1} />
          </span>
          <span className="mt-1 block text-display-xl font-bold text-ink sm:mt-2">
            <SplitText text="Moneda" delay={0.22} stagger={0.045} />
          </span>
          <span className="sr-only">— Senior QA Engineer</span>
        </h1>

        <motion.p
          {...fade(0.5)}
          aria-hidden="true"
          className="text-outline mt-4 font-display text-display-md font-semibold uppercase sm:mt-6"
        >
          Senior QA Engineer
        </motion.p>

        {/* Statement + instrument */}
        <div className="mt-14 grid gap-12 border-t border-rule/15 pt-10 lg:grid-cols-12 lg:gap-8">
          <motion.div {...fade(0.6)} className="lg:col-span-6 xl:col-span-5">
            <p className="max-w-prose text-lg leading-[1.6] text-mute sm:text-xl">
              <strong className="font-medium text-ink">{stats ? `${stats.years}+ years` : '8+ years'}</strong>{' '}
              building scalable test
              automation frameworks for web, mobile and microservice architectures. Specialised in{' '}
              <strong className="font-medium text-ink">Selenium</strong>,{' '}
              <strong className="font-medium text-ink">Robot Framework</strong>,{' '}
              <strong className="font-medium text-ink">CI/CD</strong> and{' '}
              <strong className="font-medium text-ink">cloud environments</strong>.
            </p>

            <div className="mt-10 flex flex-wrap gap-3">
              <a
                href="/jobs"
                className="group relative inline-flex items-center gap-3 overflow-hidden bg-signal px-7 py-3.5 text-sm font-medium uppercase tracking-[0.1em] text-signal-ink"
              >
                {/* Fill wipes upward on hover; the label inverts against it. */}
                <span className="absolute inset-0 origin-bottom scale-y-0 bg-ink transition-transform duration-500 ease-instrument group-hover:scale-y-100" />
                <span className="relative transition-colors duration-500 group-hover:text-canvas">
                  View My Work
                </span>
                <span className="relative transition-transform duration-500 ease-instrument group-hover:translate-x-1 group-hover:text-canvas">
                  &#8594;
                </span>
              </a>

              <a
                href="mailto:contact@guimoneda.com"
                className="group inline-flex items-center gap-3 border border-rule/25 px-7 py-3.5 text-sm font-medium uppercase tracking-[0.1em] text-ink transition-colors duration-300 hover:border-signal hover:text-signal"
              >
                Contact Me
                <span className="transition-transform duration-500 ease-instrument group-hover:translate-x-1">
                  &#8599;
                </span>
              </a>
            </div>

            <dl className="mt-12 grid grid-cols-3 border-t border-rule/15">
              {tiles.map((tile) => (
                <div key={tile.label} className="border-r border-rule/15 py-5 pr-4 last:border-r-0">
                  <dt className="label mb-2 block">{tile.label}</dt>
                  <dd className="font-display text-display-sm font-semibold text-ink">{tile.value}</dd>
                </div>
              ))}
            </dl>
          </motion.div>

          <motion.div
            {...fade(0.72)}
            className="relative lg:col-span-6 lg:col-start-7 xl:col-span-6 xl:col-start-7"
          >
            <div className="relative border border-rule/15">
              <div className="flex items-center justify-between border-b border-rule/15 px-4 py-2.5">
                <span className="label">suite / regression</span>
                <span className="label flex items-center gap-2 text-signal">
                  <span className="h-1 w-1 animate-blink bg-signal" aria-hidden="true" />
                  running
                </span>
              </div>

              <SignalGrid className="block h-[260px] w-full sm:h-[320px] lg:h-[400px]" />

              <div className="grid grid-cols-3 border-t border-rule/15">
                <div className="border-r border-rule/15 px-4 py-3">
                  <span className="label block">Roles</span>
                  <span className="mt-1 block font-mono text-sm text-ink">
                    {stats ? String(stats.roles).padStart(2, '0') : '··'}
                  </span>
                </div>
                <div className="border-r border-rule/15 px-4 py-3">
                  <span className="label block">Stack</span>
                  <span className="mt-1 block font-mono text-sm text-ink">
                    {stats ? String(stats.technologies).padStart(2, '0') : '··'}
                  </span>
                </div>
                <div className="px-4 py-3">
                  <span className="label block">Since</span>
                  <span className="mt-1 block font-mono text-sm text-signal">
                    {stats ? stats.since : '····'}
                  </span>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
