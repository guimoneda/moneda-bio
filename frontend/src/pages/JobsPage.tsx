import React from 'react';
import JobList from '../components/JobList';
import EducationList from '../components/EducationList';
import CertificationList from '../components/CertificationList';
import SectionHeading from '../components/SectionHeading';

const JobsPage: React.FC = () => (
  <div className="mx-auto max-w-shell px-6 pb-16 pt-32 sm:px-8 sm:pt-40">
    <p className="label mb-6">Curriculum / full record</p>

    <section className="pb-20 sm:pb-28">
      <SectionHeading as="h1" index="01" title="Professional Experience" meta="Click a row for detail" />
      <div className="mt-12">
        <JobList />
      </div>
    </section>

    <section className="pb-20 sm:pb-28">
      <SectionHeading index="02" title="Education" />
      <div className="mt-12">
        <EducationList />
      </div>
    </section>

    <section>
      <SectionHeading index="03" title="Certifications" />
      <div className="mt-12">
        <CertificationList />
      </div>
    </section>
  </div>
);

export default JobsPage;
