import React from 'react';

const Hero = () => {
  return (
    <div className="relative bg-gray-900 overflow-hidden">
      <div className="max-w-7xl mx-auto">
        <div className="relative z-10 pb-8 bg-gray-900 sm:pb-16 md:pb-20 lg:max-w-2xl lg:w-full lg:pb-28 xl:pb-32">
          
          <main className="mt-10 mx-auto max-w-7xl px-4 sm:mt-12 sm:px-6 md:mt-16 lg:mt-20 lg:px-8 xl:mt-28">
            <div className="sm:text-center lg:text-left">
              <h1 className="text-4xl tracking-tight font-extrabold text-white sm:text-5xl md:text-6xl">
                <span className="block xl:inline">Hi, I'm Guilherme</span>{' '}
                <span className="block text-indigo-500 xl:inline">Full Stack Developer</span>
              </h1>
              <p className="mt-3 text-base text-gray-400 sm:mt-5 sm:text-lg sm:max-w-xl sm:mx-auto md:mt-5 md:text-xl lg:mx-0">
                Building secure, scalable web applications with Django and React. 
                Currently exploring Home Labs, NAS Infrastructure, and Cloudflare Security.
              </p>
              <div className="mt-5 sm:mt-8 sm:flex sm:justify-center lg:justify-start">
                <div className="rounded-md shadow">
                  <a href="/jobs" className="w-full flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 md:py-4 md:text-lg">
                    View My Work
                  </a>
                </div>
                <div className="mt-3 sm:mt-0 sm:ml-3">
                  <a href="mailto:contact@guimoneda.com" className="w-full flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-md text-indigo-700 bg-indigo-100 hover:bg-indigo-200 md:py-4 md:text-lg">
                    Contact Me
                  </a>
                </div>
              </div>
            </div>
          </main>
        </div>
      </div>
      
      {/* Decorative Image/Blob on the right */}
      <div className="lg:absolute lg:inset-y-0 lg:right-0 lg:w-1/2 bg-gray-800 flex items-center justify-center">
         {/* Placeholder for your avatar */}
         <img 
            className="h-56 w-full object-cover sm:h-72 md:h-96 lg:w-full lg:h-full opacity-60 hover:opacity-100 transition duration-500" 
            src="https://images.unsplash.com/photo-1555066931-4365d14bab8c?ixlib=rb-1.2.1&auto=format&fit=crop&w=1950&q=80" 
            alt="Coding setup" 
         />
      </div>
    </div>
  );
};

<footer className="bg-gray-900 py-12 border-t border-gray-800">
  <div className="container mx-auto px-4 flex flex-col items-center">
    <h2 className="text-2xl font-bold text-white mb-6">Let's Connect</h2>
    <SocialLinks />
    <p className="text-gray-600 mt-8 text-sm">© 2026 Guilherme. All rights reserved.</p>
  </div>
</footer>

export default Hero;