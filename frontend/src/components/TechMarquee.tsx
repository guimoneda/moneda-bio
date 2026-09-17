import React from 'react';
import Marquee from './Marquee';
import { useResource } from '../hooks/useResource';
import { Job } from '../lib/jobs';

/**
 * The running band is built from the technologies actually recorded against
 * roles in the API — no hand-maintained list to fall out of sync with the CV.
 */
const TechMarquee: React.FC = () => {
  const state = useResource<Job[]>('/api/jobs/');

  if (state.status !== 'ready') return null;

  const technologies = Array.from(
    new Set(state.data.flatMap((job) => job.technologies ?? []).filter(Boolean))
  );

  // Too few entries and a marquee reads as a glitch rather than a device.
  if (technologies.length < 4) return null;

  return <Marquee items={technologies} />;
};

export default TechMarquee;
