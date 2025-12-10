import React, { useState, useEffect } from 'react';

// 1. Define the shape of your Job data
// (This must match the JSON fields your Django API returns)
interface Job {
  id: number; // or string, depending on your DB
  title: string;
  company: string;
  description: string;
  start_date?: string;
  technologies?: string[];
  // technologies?: string[]; // If your API returns a list of tags
}

interface JobListProps {
  limit?: number; // Optional prop
}

const JobList: React.FC<JobListProps> = ({ limit }) => {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  // Determine which jobs to show
  const displayedJobs = limit ? jobs.slice(0, limit) : jobs;

  useEffect(() => {
    // 2. Fetch from your local Django Backend
    fetch('/api/jobs/') 
      .then((response) => {
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        return response.json();
      })
      .then((data) => {
        setJobs(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error fetching jobs:", err);
        setError("Could not load projects. Ensure Backend is running.");
        setLoading(false);
      });
  }, []);

  if (loading) return <div className="text-gray-400 animate-pulse">Loading latest work...</div>;
  if (error) return <div className="text-red-400">{error}</div>;

  // 3. Render the Grid
  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
      {displayedJobs.map((job) => (
        <div 
          key={job.id} 
          className="bg-gray-800 rounded-xl overflow-hidden shadow-lg border border-gray-700 hover:border-indigo-500 transition-all duration-300 hover:shadow-indigo-500/20"
        >
          <div className="p-6">
            <div className="flex justify-between items-start mb-4">
              <div>
                <h3 className="text-xl font-bold text-white">{job.title}</h3>
                <p className="text-indigo-400 text-sm font-medium">{job.company}</p>
              </div>
              {/* Optional: Add a date badge here if available */}
            </div>
            
            <p className="text-gray-400 text-sm mb-4 line-clamp-3">
              {job.description}
            </p>

            {/* If your API has technologies, loop them here. Otherwise, hardcode a placeholder */}
            <div className="flex flex-wrap gap-2 mt-auto pt-4">
                {/* 1. Check if tags exist */}
                {job.technologies && job.technologies.length > 0 ? (
                    // 2. Slice to take only the first 3
                    job.technologies.slice(0, 3).map((technologies, index) => (
                    <span 
                        key={index} 
                        className="px-2 py-1 text-xs font-medium bg-gray-700 text-gray-300 rounded-md"
                    >
                        {technologies}
                    </span>
                    ))
                ) : (
                    // Optional: Fallback if no tags exist
                    <span className="text-xs text-gray-600">No tags</span> 
                )}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default JobList;