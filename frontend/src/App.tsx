import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import JobList from './components/JobList';
import JobsPage from './pages/JobsPage';
import SocialLinks from './components/SocialLinks';

// Home Component
const Home = () => (
  <>
    <Navbar />
    <Hero />
    <div className="max-w-7xl mx-auto px-4 py-12">
      <h2 className="text-3xl font-bold text-white mb-6 border-l-4 border-indigo-500 pl-4">
        Latest Projects
      </h2>
      <JobList limit={3} />
    </div>
  </>
);

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

        {/* 3. Footer: 
           Now placed INSIDE the App component, so it renders!
        */}
        <footer className="bg-red-600 py-12 border-t border-yellow-400 z-50 relative">
          <div className="container mx-auto px-4 flex flex-col items-center">
            <h2 className="text-2xl font-bold text-white mb-6">Let's Connect</h2>
            
            {/* Your SocialLinks Component */}
            <SocialLinks />
            
            <p className="text-gray-600 mt-8 text-sm">
              © 2026 Moneda. All rights reserved.
            </p>
          </div>
        </footer>

      </div>
    </Router>
  );
}

export default App;