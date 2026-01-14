import React from 'react';
import { Link } from 'react-router-dom';

const Navbar = () => {
  return (
    <nav className="w-full bg-gray-900 border-b border-gray-800 sticky top-0 z-50 backdrop-blur-sm bg-gray-900/90">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          
          {/* BRAND LOGO AREA */}
          <div className="flex-shrink-0">
            <Link to="/" className="group flex items-center gap-1">
              {/* Optional: A small terminal icon or code icon could go here */}
              <span className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-blue-500 group-hover:from-indigo-300 group-hover:to-blue-400 transition-all">
                &lt;Moneda /&gt;
              </span>
            </Link>
          </div>

          {/* Desktop Menu */}
          <div className="hidden md:block">
            <div className="ml-10 flex items-baseline space-x-8">
              <Link to="/" className="text-gray-300 hover:text-white px-3 py-2 rounded-md text-sm font-medium transition-colors">
                Home
              </Link>
              <Link to="/jobs" className="text-gray-300 hover:text-white px-3 py-2 rounded-md text-sm font-medium transition-colors">
                Experience
              </Link>
              {/* Highlighted Login/Admin Button */}
              <Link to="/admin" className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors">
                Admin
              </Link>
            </div>
          </div>
          
          {/* Mobile menu button code would go here... */}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;