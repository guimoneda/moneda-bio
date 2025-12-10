import React, { useState, useEffect } from 'react';

// 1. Define the shape of your Job data
// (This must match the JSON fields your Django API returns)
interface Job {
  id: number; // or string, depending on your DB
  title: string;
  company: string;
  description: string;
  start_date?: string;
  // technologies?: string[]; // If your API returns a list of tags
}

const JobList: React.FC = () => {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // 2. Fetch from your local Django Backend
    // Note: If running in Docker locally, your browser still sees 'localhost:8000'
    fetch('http://localhost:8000/api/jobs/') 
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
      {/* We use .slice(0, 3) to only show the first 3 items. 
         Remove this slice if you want to show them all.
      */}
      {jobs.slice(0, 3).map((job) => (
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
            <div className="flex flex-wrap gap-2 mt-auto">
               <span className="px-2 py-1 text-xs font-medium bg-gray-700 text-gray-300 rounded-md">
                 React
               </span>
               <span className="px-2 py-1 text-xs font-medium bg-gray-700 text-gray-300 rounded-md">
                 Django
               </span>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default JobList;