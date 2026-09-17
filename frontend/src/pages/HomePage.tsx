import React from 'react';
import { Link } from 'react-router-dom';
import Hero from '../components/Hero';
import TechMarquee from '../components/TechMarquee';
import JobList from '../components/JobList';
import SectionHeading from '../components/SectionHeading';

const HomePage: React.FC = () => (
  <>
    <Hero />
    <TechMarquee />

    <section className="mx-auto max-w-shell px-6 py-24 sm:px-8 sm:py-32">
      <SectionHeading
        index="02"
        title="Selected Work"
        meta="Three most recent"
        action={
          <Link
            to="/jobs"
            className="group inline-flex items-center gap-2 font-mono text-meta uppercase text-mute transition-colors hover:text-signal"
          >
            Full history
            <span className="transition-transform duration-500 ease-instrument group-hover:translate-x-1">
              &#8594;
            </span>
          </Link>
        }
      />

      <div className="mt-12">
        <JobList limit={3} />
      </div>
    </section>
  </>
);

export default HomePage;
