import React from 'react';
import Reveal from './Reveal';
import RichText from './RichText';
import { useResource } from '../hooks/useResource';
import { pad, range } from '../lib/format';

interface EducationItem {
  id?: number;
  institution: string;
  degree: string;
  start_date: string;
  end_date: string | null;
  is_active: boolean;
  description?: string;
}

/** Education as a ledger: index, subject, status, institution, span. */
const EducationList: React.FC = () => {
  const state = useResource<EducationItem[]>('/api/education/');

  if (state.status === 'loading') {
    return (
      <ul className="border-t border-rule/15" aria-busy="true">
        {Array.from({ length: 2 }).map((_, i) => (
          // eslint-disable-next-line react/no-array-index-key
          <li key={i} className="flex items-center gap-6 border-b border-rule/15 py-8">
            <span className="h-3 w-6 animate-pulse bg-rule/10" />
            <span className="h-6 w-1/3 animate-pulse bg-rule/10" />
          </li>
        ))}
      </ul>
    );
  }

  if (state.status === 'error') {
    return (
      <p className="border-y border-rule/15 py-10 text-mute" role="alert">
        <span className="label mr-3 text-signal">Unavailable</span>
        Education could not be loaded ({state.error}).
      </p>
    );
  }

  return (
    <ol className="border-t border-rule/15" data-testid="education-index">
      {state.data.map((item, i) => (
        <Reveal
          as="li"
          key={item.id ?? `${item.institution}-${item.degree}`}
          delay={i * 0.06}
          className="group border-b border-rule/15 py-8 md:py-10"
        >
          <div className="md:grid md:grid-cols-12 md:gap-6">
            <span className="label col-span-1 mb-3 block text-signal/70 md:mb-0">{pad(i + 1)}</span>

            <div className="col-span-7">
              <h3 className="flex flex-wrap items-center gap-x-4 gap-y-2 font-display text-display-sm font-semibold text-ink">
                {item.degree}
                {item.is_active && (
                  <span className="inline-flex items-center gap-2 border border-signal/40 px-2.5 py-1 font-mono text-[0.6rem] uppercase tracking-[0.16em] text-signal">
                    <span className="h-1 w-1 animate-blink bg-signal" aria-hidden="true" />
                    In progress
                  </span>
                )}
              </h3>
              <p className="mt-2 font-mono text-meta uppercase text-mute">{item.institution}</p>
              <RichText html={item.description} className="mt-5 max-w-prose" />
            </div>

            <span className="col-span-4 mt-4 block font-mono text-meta text-mute md:mt-0 md:text-right">
              {range(item.start_date, item.end_date)}
            </span>
          </div>
        </Reveal>
      ))}
    </ol>
  );
};

export default EducationList;
