import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import JobList from './components/JobList';
import JobsPage from './pages/JobsPage';

//Create a "Home" component
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

// Main App
function App() {
  return (
    <Router>
      <Routes>
        {/* Rule 1: If URL is "/", show Home */}
        <Route path="/" element={<Home />} />
        
        {/* Rule 2: If URL is "/jobs", show JobsPage */}
        <Route path="/jobs" element={<JobsPage />} />
      </Routes>
    </Router>
  );
}

export default App;