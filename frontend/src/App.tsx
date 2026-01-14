import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import JobList from './components/JobList';
import JobsPage from './pages/JobsPage';
import SocialLinks from './components/SocialLinks';

// Home Component with Responsive Logic
const Home = () => {
  // State to control how many cards are fetched/shown
  const [limit, setLimit] = useState(3);

  useEffect(() => {
    // Function to check screen size
    const updateLimit = () => {
      // 1280px matches Tailwind's 'xl' breakpoint
      if (window.innerWidth >= 1280) {
        setLimit(4); // Show 4 cards on 2K/Large screens
      } else {
        setLimit(3); // Show 3 cards on laptops/tablets
      }
    };

    // Run immediately on load
    updateLimit();

    // Listen for resize events
    window.addEventListener('resize', updateLimit);

    // Cleanup listener when component unmounts
    return () => window.removeEventListener('resize', updateLimit);
  }, []);

  return (
    <>
      <Navbar />
      <Hero />
      <div className="max-w-7xl mx-auto px-4 py-12">
        
        {/* Header Container with Flexbox for "Square 1" Layout */}
        <div className="flex flex-row justify-between items-end mb-8 border-l-4 border-indigo-500 pl-4">
          
          {/* Title */}
          <h2 className="text-3xl font-bold text-white leading-none">
            Latest Projects
          </h2>

          {/* The "View All" Link (Square 1 Position) */}
          <Link 
            to="/jobs" 
            className="text-indigo-400 hover:text-indigo-300 font-medium flex items-center gap-2 transition-colors group text-sm md:text-base mb-1"
          >
            View Full History
            {/* Small arrow that moves on hover */}
            <span className="group-hover:translate-x-1 transition-transform">→</span>
          </Link>

        </div>

        {/* Pass the dynamic limit to JobList */}
        <JobList limit={limit} />
        
      </div>
    </>
  );
};

// Main App
function App() {
  return (
    <Router>
      {/* 1. Main Wrapper: 
         'min-h-screen' makes the app at least as tall as the window.
         'flex-col' stacks content vertically.
      */}
      <div className="flex flex-col min-h-screen bg-gray-900 text-white">
        
        {/* 2. Content Area: 
           'flex-grow' pushes the footer down if the content is short.
        */}
        <div className="flex-grow">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/jobs" element={<JobsPage />} />
          </Routes>
        </div>

        {/* 3. Footer Area */}
        <footer className="bg-gray-900 py-12 border-t border-gray-800">
          <div className="container mx-auto px-4 flex flex-col items-center">
            <h2 className="text-2xl font-bold text-white mb-6">Let's Connect</h2>
            
            {/* Your SocialLinks Component */}
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