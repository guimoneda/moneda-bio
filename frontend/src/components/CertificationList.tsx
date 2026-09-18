import React from 'react';
import Reveal from './Reveal';
import RichText from './RichText';
import { useResource } from '../hooks/useResource';
import { monthYear, pad } from '../lib/format';

interface CertificationItem {
  id: number;
  name: string;
  issuing_organization: string;
  issue_date: string;
  expiration_date: string | null;
  credential_url: string | null;
  is_active: boolean;
  description?: string;
}

const isExpired = (cert: CertificationItem): boolean =>
  Boolean(cert.expiration_date) && new Date(cert.expiration_date as string) < new Date();

/** Certifications as a ledger, with validity expressed in the one accent colour. */
const CertificationList: React.FC = () => {
  const state = useResource<CertificationItem[]>('/api/certifications/');

  if (state.status === 'loading') {
    return (
      <ul className="border-t border-rule/15" aria-busy="true">
        {Array.from({ length: 3 }).map((_, i) => (
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
        Certifications could not be loaded ({state.error}).
      </p>
    );
  }

  return (
    <ol className="border-t border-rule/15" data-testid="certification-index">
      {state.data.map((cert, i) => {
        const expired = isExpired(cert);

        return (
          <Reveal
            as="li"
            key={cert.id}
            delay={i * 0.06}
            className="group border-b border-rule/15 py-8 md:py-10"
          >
            <div className="md:grid md:grid-cols-12 md:gap-6">
              <span className="label col-span-1 mb-3 block text-signal/70 md:mb-0">{pad(i + 1)}</span>

              <div className="col-span-7">
                <h3 className="flex flex-wrap items-center gap-x-4 gap-y-2 font-display text-display-sm font-semibold text-ink">
                  {cert.name}
                  {cert.is_active && !expired && (
                    <span className="inline-flex items-center gap-2 border border-signal/40 px-2.5 py-1 font-mono text-[0.6rem] uppercase tracking-[0.16em] text-signal">
                      Active
                    </span>
                  )}
                </h3>

                <p className="mt-2 flex flex-wrap items-center gap-x-4 font-mono text-meta uppercase text-mute">
                  {cert.issuing_organization}
                  {cert.credential_url && (
                    <a
                      href={cert.credential_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 text-signal underline decoration-signal/30 underline-offset-4 transition-colors hover:decoration-signal"
                    >
                      Verify
                      <span aria-hidden="true">&#8599;</span>
                    </a>
                  )}
                </p>

                <RichText html={cert.description} className="mt-5 max-w-prose" />
              </div>

              <div className="col-span-4 mt-4 font-mono text-meta text-mute md:mt-0 md:text-right">
                <span className="block">Issued {monthYear(cert.issue_date)}</span>
                <span className={`mt-1 block ${expired ? 'text-signal' : 'text-mute/70'}`}>
                  {cert.expiration_date
                    ? `${expired ? 'Expired' : 'Valid to'} ${monthYear(cert.expiration_date)}`
                    : 'No expiry'}
                </span>
              </div>
            </div>
          </Reveal>
        );
      })}
    </ol>
  );
};

export default CertificationList;
