import React from 'react'; // Removed useState, useEffect imports
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import JobList from './components/JobList';
import JobsPage from './pages/JobsPage';
import SocialLinks from './components/SocialLinks';

// Home Component - Simplified
const Home = () => {
  // No need for state or useEffect anymore!
  
  return (
    <>
      <Navbar />
      <Hero />
      <div className="max-w-7xl mx-auto px-4 py-12">
        
        {/* Header Section */}
        <div className="flex flex-row justify-between items-end mb-8 border-l-4 border-indigo-500 pl-4">
          <h2 className="text-3xl font-bold text-white leading-none">
            Latest Projects
          </h2>

          <Link 
            to="/jobs" 
            className="text-indigo-400 hover:text-indigo-300 font-medium flex items-center gap-2 transition-colors group text-sm md:text-base mb-1"
          >
            View Full History
            <span className="group-hover:translate-x-1 transition-transform">→</span>
          </Link>
        </div>

        {/* FORCE LIMIT TO 3 */}
        <JobList limit={3} />
        
      </div>
    </>
  );
};

// ... (Rest of App function stays exactly the same)
function App() {
  return (
    <Router>
      <div className="flex flex-col min-h-screen bg-gray-900 text-white">
        <div className="flex-grow">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/jobs" element={<JobsPage />} />
          </Routes>
        </div>
        <footer className="bg-gray-900 py-12 border-t border-gray-800">
          <div className="container mx-auto px-4 flex flex-col items-center">
            <h2 className="text-2xl font-bold text-white mb-6">Let's Connect</h2>
            <SocialLinks />
            <p className="text-gray-600 mt-8 text-sm">
              &copy; 2026 Moneda. All rights reserved.
            </p>
          </div>
        </footer>
      </div>
    </Router>
  );
}

export default App;