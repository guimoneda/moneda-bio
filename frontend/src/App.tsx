import React from 'react';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import JobList from './components/JobList';

function App() {
  return (
    <div className="min-h-screen bg-gray-900">
      <Navbar />
      <Hero />
      
      {/* Placeholder for the Job List we will build next */}
      <div className="max-w-7xl mx-auto px-4 py-12">
        <h2 className="text-3xl font-bold text-white mb-6 border-l-4 border-indigo-500 pl-4">
          Latest Projects
        </h2>
        <JobList limit={3} />
      </div>
    </div>
  );
}

export default App;