import React from 'react';
import Navbar from '../components/Navbar';
import JobList from '../components/JobList';

const JobsPage = () => {
  return (
    <div className="min-h-screen bg-gray-900">
      <Navbar />
      <div className="max-w-7xl mx-auto px-4 py-12">
        <h1 className="text-4xl font-bold text-white mb-8 border-l-4 border-indigo-500 pl-4">
          All Projects & Experience
        </h1>
        {/* No limit prop = Show everything */}
        <JobList />
      </div>
    </div>
  );
};

export default JobsPage;