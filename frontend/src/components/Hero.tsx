import React from 'react';
import { motion } from 'motion/react'; 

const Hero = () => {
  return (
    <section className="relative w-full min-h-[65vh] flex items-center bg-gray-900 overflow-hidden py-16">
      
      {/* Background Blob - Kept layout glue */}
      <div className="absolute inset-0 z-0 flex justify-center items-center pointer-events-none">
          <div className="w-[800px] h-[500px] bg-indigo-900/20 rounded-full blur-[120px] absolute" />
      </div>

      <div className="container mx-auto px-6 max-w-6xl z-10 grid md:grid-cols-2 gap-12 items-center">
        
        {/* Left Content */}
        <motion.div 
          initial={{ opacity: 0, x: -30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8 }}
          className="text-left"
        >
          
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-white leading-tight mb-6 tracking-tight">
            Hi, I'm Moneda <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-blue-500">
              Senior QA Engineer
            </span>
          </h1>
          
          {/* [LEFT] HERO text */}
          <p className="text-gray-300 text-lg md:text-xl leading-relaxed mb-8 max-w-lg">
            <strong>10+ years</strong> of experience ensuring software excellence. 
            A former Technical Program Manager returning to my engineering roots to build 
            robust automation frameworks using <strong>Python</strong>, <strong>Selenium</strong>, and <strong>Robot Framework</strong>.
          </p>

          <div className="flex flex-wrap gap-4">
            <a href="/jobs" className="px-8 py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-lg transition-all shadow-lg hover:shadow-indigo-500/30 text-base md:text-lg">
              View My Work
            </a>
            <a href="mailto:contact@guimoneda.com" className="px-8 py-3 bg-gray-800 hover:bg-gray-700 text-gray-200 font-bold rounded-lg border border-gray-700 transition-all text-base md:text-lg">
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
          
          <div className="relative w-full max-w-lg ml-auto bg-gray-900/80 rounded-2xl border border-gray-700/50 p-6 shadow-2xl backdrop-blur-md">
             
             {/* Window Controls */}
             <div className="flex gap-2 mb-4 border-b border-gray-800 pb-4">
               <div className="w-3 h-3 rounded-full bg-red-500"/>
               <div className="w-3 h-3 rounded-full bg-yellow-500"/>
               <div className="w-3 h-3 rounded-full bg-green-500"/>
             </div>

             
             <div className="space-y-3 font-mono text-sm md:text-base">
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