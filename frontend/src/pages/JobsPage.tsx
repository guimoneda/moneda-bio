import React from 'react';
import Navbar from '../components/Navbar';
import JobList from '../components/JobList';
import EducationList from '../components/EducationList'; // <--- Import the new component

const JobsPage = () => {
  return (
    <div className="min-h-screen bg-gray-900">
      <Navbar />
      
      <div className="max-w-7xl mx-auto px-4 py-12 space-y-16"> {/* Added space-y-16 for separation */}
        
        {/* SECTION 1: JOBS */}
        <div>
          <h1 className="text-4xl font-bold text-white mb-8 border-l-4 border-indigo-500 pl-4">
            Professional Experience
          </h1>
          <JobList />
        </div>

        {/* SECTION 2: EDUCATION */}
        <div>
          <h2 className="text-3xl font-bold text-white mb-8 border-l-4 border-indigo-500 pl-4">
            Education
          </h2>
          <EducationList />
        </div>

        <div>
          <h2 className="text-3xl font-bold text-white mb-8 border-l-4 border-indigo-500 pl-4">
            Certifications
          </h2>
          <EducationList />
        </div>

      </div>
    </div>
  );
};

export default JobsPage;