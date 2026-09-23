import React, { useEffect, useState } from 'react';
import SocialLinks from './SocialLinks';
import Reveal from './Reveal';

/**
 * The one place the owner's location is declared. An IANA zone, not a fixed
 * offset, so daylight saving is handled for us.
 */
const OWNER_TIME_ZONE = 'America/New_York';

/** Local time in the owner's zone — a small live signal that the site is tended. */
const useClock = (): { time: string; zone: string } => {
  const [now, setNow] = useState(() => new Date());

  useEffect(() => {
    const id = window.setInterval(() => setNow(new Date()), 1000 * 30);
    return () => window.clearInterval(id);
  }, []);

  const parts = new Intl.DateTimeFormat('en-US', {
    hour: '2-digit',
    minute: '2-digit',
    // h23 rather than hour12:false: the latter renders midnight as 24:00 in
    // some implementations. en-US resolves the zone to a real abbreviation
    // (EDT/EST); en-GB would render it as a GMT offset instead.
    hourCycle: 'h23',
    timeZone: OWNER_TIME_ZONE,
    // Derived, never written down: hard-coding an abbreviation puts it one
    // daylight-saving change away from lying.
    timeZoneName: 'short',
  }).formatToParts(now);

  const value = (type: string) => parts.find((part) => part.type === type)?.value ?? '';

  return {
    time: `${value('hour')}:${value('minute')}`,
    zone: value('timeZoneName'),
  };
};

const Footer: React.FC = () => {
  const { time, zone } = useClock();

  return (
    <footer className="mt-24 border-t border-rule/15">
      <div className="mx-auto max-w-shell px-6 py-20 sm:px-8 sm:py-28">
        <Reveal>
          <p className="label mb-8">Get in touch</p>

          <h2 className="text-display-lg font-bold uppercase text-ink">Let&rsquo;s Connect</h2>

          <a
            href="mailto:contact@guimoneda.com"
            className="group mt-8 inline-flex items-baseline gap-4 border-b border-rule/25 pb-2 transition-colors hover:border-signal"
          >
            <span className="font-display text-display-sm text-mute transition-colors group-hover:text-signal">
              contact@guimoneda.com
            </span>
            <span
              className="text-signal transition-transform duration-500 ease-instrument group-hover:translate-x-1"
              aria-hidden="true"
            >
              &#8594;
            </span>
          </a>
        </Reveal>

        <Reveal delay={0.1} className="mt-20 grid gap-12 lg:grid-cols-12">
          <div className="lg:col-span-5">
            <p className="label mb-6">Elsewhere</p>
            <SocialLinks />
          </div>

          <div className="lg:col-span-4 lg:col-start-9">
            <p className="label mb-6">Colophon</p>
            <dl className="border-t border-rule/15 font-mono text-meta">
              <div className="flex justify-between border-b border-rule/15 py-3">
                <dt className="text-mute">Type</dt>
                <dd className="text-ink">Bricolage&nbsp;/&nbsp;Inter&nbsp;Tight</dd>
              </div>
              <div className="flex justify-between border-b border-rule/15 py-3">
                <dt className="text-mute">Built with</dt>
                <dd className="text-ink">React&nbsp;&middot;&nbsp;Django</dd>
              </div>
              <div className="flex justify-between border-b border-rule/15 py-3">
                <dt className="text-mute">Local time</dt>
                <dd className="text-ink">
                  {time} <span className="text-mute">{zone}</span>
                </dd>
              </div>
            </dl>
          </div>
        </Reveal>
      </div>

      <div className="border-t border-rule/15">
        <div className="mx-auto flex max-w-shell flex-wrap items-center justify-between gap-3 px-6 py-6 sm:px-8">
          <p className="label">&copy; 2026 Moneda. All rights reserved.</p>
          <p className="label">Guilherme Moneda &mdash; Delivery, Quality &amp; Operations</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
