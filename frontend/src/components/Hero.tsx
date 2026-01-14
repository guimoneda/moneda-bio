import React from 'react';
import { motion } from 'motion/react'; 

const Hero = () => {
  return (
    <section className="relative w-full min-h-[600px] flex items-center bg-gray-900 overflow-hidden">
      
      {/* Background Elements */}
      <div className="absolute inset-0 z-0">
          <div className="absolute top-[-20%] right-[-10%] w-[600px] h-[600px] bg-indigo-600/20 rounded-full blur-[120px]" />
          <div className="absolute bottom-[-10%] left-[-10%] w-[400px] h-[400px] bg-blue-600/10 rounded-full blur-[100px]" />
      </div>

      <div className="container mx-auto px-4 z-10 grid md:grid-cols-2 gap-12 items-center">
        
        {/* Left Content */}
        <motion.div 
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8 }}
          className="text-left"
        >
          <h1 className="text-4xl md:text-6xl font-extrabold text-white leading-tight mb-6">
            Hi, I'm Moneda <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-blue-500">
              Senior QA Engineer
            </span>
          </h1>
          
          <p className="text-gray-300 text-lg md:text-xl leading-relaxed mb-8 max-w-lg">
            <strong>10+ years</strong> of experience ensuring software excellence. 
            A former Technical Program Manager returning to my engineering roots to build 
            robust automation frameworks using <strong>Python</strong>, <strong>Selenium</strong>, and <strong>Robot Framework</strong>.
          </p>

          {/* YOUR UPDATED BUTTONS */}
          <div className="mt-5 sm:mt-8 sm:flex sm:justify-start">
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

        </motion.div>

        {/* Right Image/Graphic */}
        <motion.div 
           initial={{ opacity: 0, x: 50 }}
           animate={{ opacity: 1, x: 0 }}
           transition={{ duration: 0.8, delay: 0.2 }}
           className="relative hidden md:block"
        >
          <div className="relative w-full h-[400px] bg-gray-800/50 rounded-2xl border border-gray-700 p-4 shadow-2xl backdrop-blur-sm">
             {/* Decorative Code Snippet UI */}
             <div className="flex gap-2 mb-4">
               <div className="w-3 h-3 rounded-full bg-red-500"/>
               <div className="w-3 h-3 rounded-full bg-yellow-500"/>
               <div className="w-3 h-3 rounded-full bg-green-500"/>
             </div>
             <div className="space-y-2 font-mono text-sm">
               <div className="text-gray-400"># Automation Framework Setup</div>
               <div className="text-purple-400">class <span className="text-yellow-300">TestAutomation</span>:</div>
               <div className="text-gray-300 pl-4">def <span className="text-blue-400">__init__</span>(self):</div>
               <div className="text-green-400 pl-8">self.tools = ["Selenium", "Appium", "Python"]</div>
               <div className="text-green-400 pl-8">self.goal = "Zero Defects"</div>
               <br />
               <div className="text-gray-300 pl-4">def <span className="text-blue-400">run_test</span>(self):</div>
               <div className="text-green-400 pl-8">return "Quality Assured"</div>
             </div>
          </div>
        </motion.div>

      </div>
    </section>
  );
};

export default Hero;