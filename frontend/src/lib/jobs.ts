export interface Job {
  id: number;
  title: string;
  company: string;
  description: string;
  more_details?: string | null;
  technologies: string[];
  start_date: string;
  end_date?: string | null;
  is_current?: boolean;
  duration?: string;
  image?: string | null;
  image_url?: string | null;
}

/** Newest first. Ordering lives on the client, as it always has. */
export const byNewest = (jobs: Job[]): Job[] =>
  [...jobs].sort((a, b) => new Date(b.start_date).getTime() - new Date(a.start_date).getTime());

/**
 * Figures shown in the hero are derived from the API rather than hard-coded, so
 * they cannot drift out of date as roles are added through Django admin.
 */
export interface DerivedStats {
  roles: number;
  technologies: number;
  /** Year of the earliest role. Stated as a fact rather than a duration. */
  since: string;
}

export const deriveStats = (jobs: Job[]): DerivedStats | null => {
  if (!jobs.length) return null;

  const earliest = jobs.reduce(
    (min, job) => (job.start_date < min ? job.start_date : min),
    jobs[0].start_date
  );
  const startYear = Number(earliest.slice(0, 4));
  const technologies = new Set(jobs.flatMap((job) => job.technologies ?? []));

  return {
    roles: jobs.length,
    technologies: technologies.size,
    since: String(startYear),
  };
};
