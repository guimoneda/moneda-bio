import React from 'react';

const Navbar = () => {
  return (
    <nav className="bg-gray-800 shadow-lg border-b border-gray-700">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          
          {/* Logo */}
          <div className="flex-shrink-0">
            <span className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-400 to-cyan-400">
              Guilherme Moneda
            </span>
          </div>

          {/* Links */}
          <div className="hidden md:block">
            <div className="ml-10 flex items-baseline space-x-4">
              <a href="/" className="px-3 py-2 rounded-md text-sm font-medium text-white bg-gray-900 hover:bg-gray-700 transition">
                Home
              </a>
              <a href="/jobs" className="px-3 py-2 rounded-md text-sm font-medium text-gray-300 hover:text-white hover:bg-gray-700 transition">
                Jobs
              </a>
              {/* External link to your Admin Panel */}
              <a href="/admin" className="px-3 py-2 rounded-md text-sm font-medium text-indigo-400 hover:text-indigo-300 hover:bg-gray-900 border border-indigo-500 transition">
                Admin Login
              </a>
            </div>
          </div>
          
        </div>
      </div>
    </nav>
  );
};

export default Navbar;