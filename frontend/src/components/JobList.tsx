import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react'; 

interface Job {
  id: number;
  title: string;
  company: string;
  description: string;
  technologies: string[];
  start_date: string;
  duration?: string;
  image?: string; 
  image_url?: string; 
}

interface JobListProps {
  limit?: number;
}

const JobList: React.FC<JobListProps> = ({ limit }) => {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [selectedId, setSelectedId] = useState<number | null>(null);

  useEffect(() => {
    fetch('/api/jobs/')
      .then((res) => res.json())
      .then((data: Job[]) => {
        // Sort: Newest start_date first
        const sortedJobs = data.sort((a, b) => 
          new Date(b.start_date).getTime() - new Date(a.start_date).getTime()
        );
        setJobs(sortedJobs);
      })
      .catch((err) => console.error(err));
  }, []);

  const getJobImage = (job: Job) => {
    if (job.image) return job.image; 
    if (job.image_url) return job.image_url;
    // Fallback image if none provided
    return 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&w=800&q=80';
  }

  const displayedJobs = limit ? jobs.slice(0, limit) : jobs;

  return (
    <div className="relative"> 
      
      {/* --- THE MINIMALIST GRID VIEW --- */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {displayedJobs.map((job) => (
          <motion.div
            layoutId={`card-${job.id}`} 
            key={job.id}
            onClick={() => setSelectedId(job.id)}
            // COMPACT CARD: Fixed height 280px, tighter borders, subtle hover lift
            className="bg-gray-800 rounded-lg overflow-hidden shadow-md border border-gray-700/50 cursor-pointer relative group flex flex-col h-[280px] hover:border-indigo-500/50 transition-colors"
            whileHover={{ y: -4 }} 
            whileTap={{ scale: 0.98 }}
          >
             {/* Background Image: Very subtle opacity */}
            <div 
              className="absolute inset-0 bg-cover bg-center opacity-[0.07] group-hover:opacity-20 transition-opacity duration-500 grayscale"
              style={{ backgroundImage: `url(${getJobImage(job)})` }} 
            />
            
            {/* COMPACT PADDING: p-5 */}
            <div className="p-5 relative z-10 flex flex-col flex-grow">
              
              {/* Header: Title Left, Date Right */}
              <div className="flex justify-between items-start mb-1">
                <motion.h3 className="text-lg font-bold text-white leading-tight pr-4">
                  {job.title}
                </motion.h3>
                {job.duration && (
                  <span className="text-[10px] font-mono text-gray-500 bg-gray-900 border border-gray-800 px-1.5 py-0.5 rounded whitespace-nowrap">
                    {job.duration}
                  </span>
                )}
              </div>

              {/* Company: Small Uppercase Label */}
              <motion.p className="text-indigo-400 text-xs font-semibold mb-3 uppercase tracking-wide">
                {job.company}
              </motion.p>
              
              {/* Description: Max 3 lines */}
              <div 
                className="text-gray-400 text-sm leading-snug line-clamp-3 mb-4 [&_p]:mb-0 [&_p]:inline"
                dangerouslySetInnerHTML={{ __html: job.description }}
              />

              {/* Footer: Tech Tags (Tiny) */}
              <div className="flex flex-wrap gap-1.5 mt-auto">
                {job.technologies && job.technologies.slice(0, 3).map((tech, index) => (
                   <span 
                     key={index} 
                     className="px-2 py-0.5 text-[10px] font-medium bg-gray-900/80 text-gray-400 border border-gray-700 rounded"
                   >
                     {tech}
                   </span>
                ))}
                {job.technologies && job.technologies.length > 3 && (
                    <span className="px-2 py-0.5 text-[10px] text-gray-600">+more</span>
                )}
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* --- THE EXPANDED OVERLAY (MODAL) --- */}
      <AnimatePresence>
        {selectedId && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedId(null)}
              className="fixed inset-0 bg-black/80 z-40 backdrop-blur-sm"
            />

            {/* Modal Container */}
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

                      {/* Modal Header Image */}
                      <div 
                        className="h-64 bg-cover bg-center relative"
                        style={{ backgroundImage: `url(${getJobImage(job)})` }}
                      >
                          <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-transparent to-transparent"></div>
                      </div>

                      {/* Modal Content */}
                      <div className="p-8">
                        <motion.h3 className="text-3xl font-bold text-white mb-2">{job.title}</motion.h3>
                        
                        <div className="flex items-center gap-4 mb-6">
                            <motion.p className="text-indigo-400 text-lg font-medium">
                                {job.company}
                            </motion.p>
                            
                            {job.duration && (
                                <span className="text-sm font-mono text-gray-300 bg-gray-800 px-3 py-1 rounded-full border border-gray-600">
                                    {job.duration}
                                </span>
                            )}
                        </div>
                        
                        <motion.div 
                          initial={{ opacity: 0 }} 
                          animate={{ opacity: 1 }} 
                          transition={{ delay: 0.2 }}
                          className="text-gray-300 leading-relaxed text-lg" 
                        >
                          <div 
                            className="[&_p]:mb-4 [&_b]:font-bold [&_strong]:font-bold [&_strong]:text-white"
                            dangerouslySetInnerHTML={{ __html: job.description }} 
                          />
                        </motion.div>

                        <div className="mt-8 pt-6 border-t border-gray-700">
                           <h4 className="text-gray-400 text-sm uppercase tracking-wider mb-3">Technologies</h4>
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