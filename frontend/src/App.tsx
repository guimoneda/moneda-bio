import React, { useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes, useLocation } from 'react-router-dom';
import { AnimatePresence, motion } from 'motion/react';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import HomePage from './pages/HomePage';
import JobsPage from './pages/JobsPage';
import { ThemeProvider } from './lib/theme';
import { useReducedMotion } from './hooks/useReducedMotion';

const Shell: React.FC = () => {
  const location = useLocation();
  const reduced = useReducedMotion();

  // Client-side navigation should behave like a page load, not leave the reader
  // halfway down the next document.
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: reduced ? 'auto' : 'smooth' });
  }, [location.pathname, reduced]);

  return (
    <div className="flex min-h-screen flex-col bg-canvas text-ink">
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:fixed focus:left-6 focus:top-6 focus:z-[80] focus:bg-signal focus:px-5 focus:py-3 focus:font-mono focus:text-sm focus:uppercase focus:text-signal-ink"
      >
        Skip to content
      </a>

      <Navbar />

      <main id="main" className="flex-grow">
        <AnimatePresence mode="wait">
          <motion.div
            key={location.pathname}
            initial={reduced ? false : { opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={reduced ? undefined : { opacity: 0 }}
            transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
          >
            <Routes location={location}>
              <Route path="/" element={<HomePage />} />
              <Route path="/jobs" element={<JobsPage />} />
            </Routes>
          </motion.div>
        </AnimatePresence>
      </main>

      <Footer />
    </div>
  );
};

const App: React.FC = () => (
  <ThemeProvider>
    <Router>
      <Shell />
    </Router>
  </ThemeProvider>
);

export default App;
