import React from 'react';
import { motion } from 'motion/react'; 

const Hero = () => {
  return (
    <section className="relative w-full min-h-[70vh] flex items-center bg-gray-900 overflow-hidden py-20">
      
      {/* 1. VISUAL GLUE: One giant blob connecting left and right */}
      <div className="absolute inset-0 z-0 flex justify-center items-center pointer-events-none">
          <div className="w-[800px] h-[500px] bg-indigo-900/20 rounded-full blur-[120px] absolute" />
      </div>

      {/* 2. CONSTRAINT: max-w-6xl forces elements to stay closer together on 2K screens */}
      <div className="container mx-auto px-6 max-w-6xl z-10 grid md:grid-cols-2 gap-12 items-center">
        
        {/* Left Content */}
        <motion.div 
          initial={{ opacity: 0, x: -30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8 }}
          className="text-left"
        >
          {/* 3. TYPOGRAPHY: Added 2xl:text-7xl for your 27" monitor */}
          <h1 className="text-5xl md:text-6xl 2xl:text-7xl font-extrabold text-white leading-tight mb-6 tracking-tight">
            Hi, I'm Moneda <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-blue-500">
              Senior QA Engineer
            </span>
          </h1>
          
          <p className="text-gray-300 text-lg md:text-xl 2xl:text-2xl leading-relaxed mb-8 max-w-lg">
            <strong>10+ years</strong> of experience ensuring software excellence. 
            A former Technical Program Manager returning to my engineering roots to build 
            robust automation frameworks using <strong>Python</strong>, <strong>Selenium</strong>, and <strong>Robot Framework</strong>.
          </p>

          <div className="flex flex-wrap gap-4">
            <a href="/jobs" className="px-8 py-4 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-lg transition-all shadow-lg hover:shadow-indigo-500/30 text-lg">
              View My Work
            </a>
            <a href="mailto:contact@guimoneda.com" className="px-8 py-4 bg-gray-800 hover:bg-gray-700 text-gray-200 font-bold rounded-lg border border-gray-700 transition-all text-lg">
              Contact Me
            </a>
          </div>
        </motion.div>

        {/* Right Image/Graphic */}
        <motion.div 
           initial={{ opacity: 0, scale: 0.95 }}
           animate={{ opacity: 1, scale: 1 }}
           transition={{ duration: 0.8, delay: 0.2 }}
           className="relative hidden md:block"
        >
          {/* Made the code box slightly wider/taller for 2K screens */}
          <div className="relative w-full max-w-lg ml-auto bg-gray-900/80 rounded-2xl border border-gray-700/50 p-6 shadow-2xl backdrop-blur-md">
             
             {/* Decorative Window Controls */}
             <div className="flex gap-2 mb-6 border-b border-gray-800 pb-4">
               <div className="w-3 h-3 rounded-full bg-red-500"/>
               <div className="w-3 h-3 rounded-full bg-yellow-500"/>
               <div className="w-3 h-3 rounded-full bg-green-500"/>
             </div>

             {/* Code Text - slightly larger for readability */}
             <div className="space-y-3 font-mono text-sm 2xl:text-base">
               <div className="text-gray-500"># Automation Framework Setup</div>
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