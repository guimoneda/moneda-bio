import React, { useCallback, useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion, useMotionValue, useSpring } from 'motion/react';
import RichText from './RichText';
import { useReducedMotion } from '../hooks/useReducedMotion';
import { useResource } from '../hooks/useResource';
import { byNewest, Job } from '../lib/jobs';
import { pad, range } from '../lib/format';

interface JobListProps {
  limit?: number;
}

const jobImage = (job: Job): string | null => job.image || job.image_url || null;

/**
 * Experience, set as a numbered index rather than a grid of cards.
 *
 * Hovering a row moves a preview panel that tracks the cursor (pointer-fine
 * devices only); clicking morphs the row itself into the detail panel through
 * the shared `layoutId` pairing, which is preserved from the original design.
 */
const JobList: React.FC<JobListProps> = ({ limit }) => {
  const reduced = useReducedMotion();
  const state = useResource<Job[]>('/api/jobs/');
  const [selectedId, setSelectedId] = useState<number | null>(null);
  const [hoveredId, setHoveredId] = useState<number | null>(null);

  const closeRef = useRef<HTMLButtonElement>(null);
  const lastFocused = useRef<HTMLElement | null>(null);

  // Cursor-tracked preview. Springs keep it trailing the pointer with weight.
  const pointerY = useMotionValue(0);
  const previewY = useSpring(pointerY, { stiffness: 380, damping: 40, mass: 0.6 });

  const onPointerMove = useCallback(
    (e: React.PointerEvent<HTMLDivElement>) => {
      if (e.pointerType !== 'mouse') return;
      const bounds = e.currentTarget.getBoundingClientRect();
      pointerY.set(e.clientY - bounds.top);
    },
    [pointerY]
  );

  const open = (job: Job, e: React.MouseEvent) => {
    lastFocused.current = e.currentTarget as HTMLElement;
    setSelectedId(job.id);
    setHoveredId(null);
  };

  const close = useCallback(() => {
    setSelectedId(null);
    lastFocused.current?.focus();
  }, []);

  // Escape to dismiss, scroll locked while open, focus handed to the panel.
  useEffect(() => {
    if (selectedId === null) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') close();
    };
    const previous = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    window.addEventListener('keydown', onKey);
    const timer = window.setTimeout(() => closeRef.current?.focus(), 60);
    return () => {
      document.body.style.overflow = previous;
      window.removeEventListener('keydown', onKey);
      window.clearTimeout(timer);
    };
  }, [selectedId, close]);

  if (state.status === 'loading') {
    return (
      <ul className="border-t border-rule/15" data-testid="job-index-loading" aria-busy="true">
        {Array.from({ length: limit ?? 4 }).map((_, i) => (
          // eslint-disable-next-line react/no-array-index-key
          <li key={i} className="flex items-center gap-6 border-b border-rule/15 py-8">
            <span className="h-3 w-6 animate-pulse bg-rule/10" />
            <span className="h-7 w-2/5 animate-pulse bg-rule/10" />
            <span className="ml-auto h-3 w-24 animate-pulse bg-rule/10" />
          </li>
        ))}
        <li className="sr-only">Loading experience…</li>
      </ul>
    );
  }

  if (state.status === 'error') {
    return (
      <div className="border-y border-rule/15 py-12" role="alert" data-testid="job-index-error">
        <p className="label text-signal">Experience unavailable</p>
        <p className="mt-3 max-w-prose text-mute">
          The history could not be loaded ({state.error}). Everything else on this page still works —
          try a refresh.
        </p>
      </div>
    );
  }

  const jobs = byNewest(state.data);
  const displayed = limit ? jobs.slice(0, limit) : jobs;
  const selected = selectedId === null ? null : jobs.find((job) => job.id === selectedId) ?? null;
  const hovered = hoveredId === null ? null : displayed.find((job) => job.id === hoveredId) ?? null;

  return (
    <div className="relative" onPointerMove={onPointerMove} data-testid="job-index">
      <ol className="border-t border-rule/15">
        {displayed.map((job, i) => (
          <motion.li
            layoutId={`card-${job.id}`}
            key={job.id}
            data-testid="job-row"
            className="group relative border-b border-rule/15"
            onMouseEnter={() => setHoveredId(job.id)}
            onMouseLeave={() => setHoveredId((id) => (id === job.id ? null : id))}
          >
            {/* Hover fill sweeps down from the rule above. */}
            <span
              className="pointer-events-none absolute inset-0 origin-top scale-y-0 bg-panel transition-transform duration-500 ease-instrument group-hover:scale-y-100"
              aria-hidden="true"
            />

            <button
              type="button"
              onClick={(e) => open(job, e)}
              aria-label={`${job.title} at ${job.company} — open details`}
              className="relative flex w-full flex-col gap-3 px-1 py-7 text-left sm:px-2 md:grid md:grid-cols-12 md:items-baseline md:gap-6 md:py-9"
            >
              <span className="label col-span-1 text-signal/70 transition-colors duration-300 group-hover:text-signal">
                {pad(i + 1)}
              </span>

              <span className="col-span-6 block">
                <h3 className="block font-display text-display-sm font-semibold text-ink transition-transform duration-500 ease-instrument md:group-hover:translate-x-2">
                  {job.title}
                </h3>
                {job.technologies?.length > 0 && (
                  <span className="mt-2 hidden flex-wrap gap-x-3 gap-y-1 lg:flex">
                    {job.technologies.slice(0, 4).map((tech) => (
                      <span key={tech} className="font-mono text-[0.7rem] text-mute/70">
                        {tech}
                      </span>
                    ))}
                    {job.technologies.length > 4 && (
                      <span className="font-mono text-[0.7rem] text-mute/50">
                        +{job.technologies.length - 4}
                      </span>
                    )}
                  </span>
                )}
              </span>

              <span className="col-span-3 block font-mono text-meta uppercase text-mute">
                {job.company}
              </span>

              <span className="col-span-2 flex items-baseline justify-between gap-4 font-mono text-meta text-mute md:justify-end">
                {range(job.start_date, job.end_date)}
                <span
                  className="text-signal opacity-0 transition-all duration-500 ease-instrument group-hover:translate-x-1 group-hover:opacity-100"
                  aria-hidden="true"
                >
                  &#8594;
                </span>
              </span>
            </button>
          </motion.li>
        ))}
      </ol>

      {/*
        Row preview. It tracks the pointer vertically but is anchored horizontally
        in the empty band between the title and company columns, so it never
        covers the role name it is describing. Decorative, fine pointers only.
      */}
      {!reduced && (
        <AnimatePresence>
          {hovered && (
            <motion.div
              key={hovered.id}
              initial={{ opacity: 0, scale: 0.94 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.94 }}
              transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
              style={{ y: previewY }}
              aria-hidden="true"
              className="pointer-events-none absolute left-[47%] top-0 z-30 hidden h-36 w-48 -translate-x-1/2 -translate-y-1/2 overflow-hidden border border-rule/20 bg-panel-hi [@media(pointer:fine)]:block"
            >
              {jobImage(hovered) ? (
                <img
                  src={jobImage(hovered) as string}
                  alt=""
                  loading="lazy"
                  className="h-full w-full object-cover opacity-70 grayscale"
                />
              ) : (
                // No stock photography. Absent an image the company sets its own tile,
                // drawn in the system's own vocabulary rather than as a colour block.
                <span className="relative flex h-full w-full items-center justify-center">
                  <span className="text-outline font-display text-4xl font-bold uppercase tracking-tight">
                    {hovered.company.slice(0, 3)}
                  </span>
                  <span className="absolute bottom-3 left-3 h-1.5 w-1.5 bg-signal" />
                  <span className="absolute bottom-3 right-3 font-mono text-[0.6rem] uppercase tracking-[0.16em] text-mute">
                    {hovered.company}
                  </span>
                </span>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      )}

      <AnimatePresence>
        {selected && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              onClick={close}
              data-testid="job-backdrop"
              className="fixed inset-0 z-[60] bg-canvas/80 backdrop-blur-md"
            />

            <div className="pointer-events-none fixed inset-0 z-[70] flex items-start justify-center overflow-y-auto p-4 py-10 sm:p-8 sm:py-16">
              <motion.div
                layoutId={`card-${selected.id}`}
                role="dialog"
                aria-modal="true"
                aria-label={`${selected.title} at ${selected.company}`}
                data-testid="job-detail"
                className="pointer-events-auto w-full max-w-3xl border border-rule/20 bg-canvas"
              >
                <div className="flex items-center justify-between border-b border-rule/15 px-6 py-3 sm:px-8">
                  <span className="label text-signal">{selected.company}</span>
                  <button
                    ref={closeRef}
                    type="button"
                    onClick={close}
                    aria-label="Close details"
                    data-testid="job-detail-close"
                    className="-mr-2 flex h-9 w-9 items-center justify-center text-mute transition-colors hover:text-signal"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth={1.5}
                      aria-hidden="true"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>

                <div className="px-6 py-8 sm:px-8 sm:py-10">
                  <h3 className="text-display-md font-semibold text-ink">{selected.title}</h3>

                  <dl className="mt-6 grid grid-cols-2 border-y border-rule/15 sm:grid-cols-3">
                    <div className="border-r border-rule/15 py-4 pr-4">
                      <dt className="label block">Period</dt>
                      <dd className="mt-1.5 font-mono text-sm text-ink">
                        {range(selected.start_date, selected.end_date)}
                      </dd>
                    </div>
                    <div className="py-4 pl-4 sm:border-r sm:border-rule/15 sm:pr-4">
                      <dt className="label block">Duration</dt>
                      <dd className="mt-1.5 font-mono text-sm text-ink">{selected.duration || '—'}</dd>
                    </div>
                    <div className="col-span-2 border-t border-rule/15 py-4 sm:col-span-1 sm:border-t-0 sm:pl-4">
                      <dt className="label block">Status</dt>
                      <dd
                        className={`mt-1.5 font-mono text-sm ${
                          selected.is_current ? 'text-signal' : 'text-ink'
                        }`}
                      >
                        {selected.is_current ? 'Current' : 'Completed'}
                      </dd>
                    </div>
                  </dl>

                  <motion.div
                    initial={reduced ? undefined : { opacity: 0, y: 10 }}
                    animate={reduced ? undefined : { opacity: 1, y: 0 }}
                    transition={{ delay: 0.18, duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
                    className="mt-8"
                  >
                    <RichText html={selected.description} className="text-base" />
                    {selected.more_details && (
                      <RichText html={selected.more_details} className="mt-6 text-base" />
                    )}
                  </motion.div>

                  {selected.technologies?.length > 0 && (
                    <div className="mt-10 border-t border-rule/15 pt-6">
                      <h4 className="label mb-4">Stack</h4>
                      <ul className="flex flex-wrap gap-2">
                        {selected.technologies.map((tech) => (
                          <li
                            key={tech}
                            className="border border-rule/20 px-3 py-1.5 font-mono text-[0.72rem] uppercase tracking-wider text-mute"
                          >
                            {tech}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              </motion.div>
            </div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
};

export default JobList;
