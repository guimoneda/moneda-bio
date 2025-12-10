import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react'; 

// 1. Updated Interface to use 'technologies'
interface Job {
  id: number;
  title: string;
  company: string;
  description: string;
  technologies: string[]; // Renamed from tags
  image?: string;         // Optional: URL for the background image
}

interface JobListProps {
  limit?: number;
}

const JobList: React.FC<JobListProps> = ({ limit }) => {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [selectedId, setSelectedId] = useState<number | null>(null);

  useEffect(() => {
    // Relative path fetch
    fetch('/api/jobs/')
      .then((res) => res.json())
      .then((data) => setJobs(data))
      .catch((err) => console.error(err));
  }, []);

  const displayedJobs = limit ? jobs.slice(0, limit) : jobs;

  return (
    <div className="relative"> 
      {/* --- THE GRID VIEW --- */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {displayedJobs.map((job) => (
          <motion.div
            layoutId={`card-${job.id}`} 
            key={job.id}
            onClick={() => setSelectedId(job.id)}
            className="bg-gray-800 rounded-xl overflow-hidden shadow-lg border border-gray-700 cursor-pointer relative group flex flex-col h-full"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
             {/* Background Image Placeholder (Opacity change on hover) */}
            <div 
              className="absolute inset-0 bg-cover bg-center opacity-20 group-hover:opacity-40 transition-opacity duration-500"
              style={{ backgroundImage: `url(${job.image || 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&w=800&q=80'})` }} 
            />
            
            <div className="p-6 relative z-10 flex flex-col flex-grow">
              <motion.h3 className="text-xl font-bold text-white">{job.title}</motion.h3>
              <motion.p className="text-indigo-400 text-sm font-medium mb-2">{job.company}</motion.p>
              
              <p className="text-gray-400 text-sm line-clamp-3 mb-4">
                {job.description}
              </p>

              {/* YOUR UPDATED TECHNOLOGIES SECTION */}
              <div className="flex flex-wrap gap-2 mt-auto">
                {job.technologies && job.technologies.slice(0, 3).map((tech, index) => (
                   <span 
                     key={index} 
                     className="px-2 py-1 text-xs font-medium bg-gray-700 text-gray-300 rounded-md"
                   >
                     {tech}
                   </span>
                ))}
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* --- THE EXPANDED OVERLAY --- */}
      <AnimatePresence>
        {selectedId && (
          <>
            {/* Dark Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedId(null)}
              className="fixed inset-0 bg-black/80 z-40 backdrop-blur-sm"
            />

            {/* Expanded Card */}
            <div className="fixed inset-0 flex items-center justify-center z-50 pointer-events-none p-4">
              <motion.div
                layoutId={`card-${selectedId}`} 
                className="bg-gray-900 w-full max-w-2xl max-h-[85vh] overflow-y-auto rounded-2xl shadow-2xl border border-gray-700 pointer-events-auto"
              >
                {(() => {
                  const job = jobs.find(j => j.id === selectedId);
                  if (!job) return null;
                  
                  return (
                    <div className="relative">
                      {/* Close Button */}
                      <button 
                         onClick={() => setSelectedId(null)}
                         className="absolute top-4 right-4 z-20 bg-black/50 hover:bg-black/80 text-white rounded-full p-2 transition-colors"
                       >
                         <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                           <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                         </svg>
                       </button>

                      {/* Header Image */}
                      <div 
                        className="h-64 bg-cover bg-center relative"
                        style={{ backgroundImage: `url(${job.image || 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&w=800&q=80'})` }}
                      >
                         <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-transparent to-transparent"></div>
                      </div>

                      <div className="p-8">
                        <motion.h3 className="text-3xl font-bold text-white mb-2">{job.title}</motion.h3>
                        <motion.p className="text-indigo-400 text-lg font-medium mb-6">{job.company}</motion.p>
                        
                        <motion.div 
                          initial={{ opacity: 0 }} 
                          animate={{ opacity: 1 }} 
                          transition={{ delay: 0.2 }}
                          className="text-gray-300 space-y-4 leading-relaxed text-lg"
                        >
                          <p>{job.description}</p>
                          {/* This is where you'd put extra 'longDescription' if you add it to DB later */}
                        </motion.div>

                        {/* Full List of Technologies (Your styling, but slightly larger for modal) */}
                        <div className="mt-8 pt-6 border-t border-gray-700">
                           <h4 className="text-gray-400 text-sm uppercase tracking-wider mb-3">Technologies Used</h4>
                           <div className="flex flex-wrap gap-2">
                             {job.technologies && job.technologies.map((tech, index) => (
                               <span 
                                 key={index} 
                                 className="px-3 py-1.5 text-sm font-medium bg-gray-700 text-gray-300 rounded-md"
                               >
                                 {tech}
                               </span>
                             ))}
                           </div>
                        </div>
                      </div>
                    </div>
                  );
                })()}
              </motion.div>
            </div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
};

export default JobList;