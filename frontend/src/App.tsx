import React, { useEffect, useState } from 'react';
import './App.css';

// 1. Define what a "Job" looks like (Must match your Django Serializer)
interface Job {
  id: number;
  company: string;
  title: string;
  start_date: string;
  end_date: string | null;
  description: string;
  is_current: boolean;
}

function App() {
  console.log("--- VERSION 2.0 LOADED ---");  // <--- Add this line
  // 2. Create state variables to hold the data
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // 3. The "Effect" Hook: Runs once when the page loads
  useEffect(() => {
    fetch('/api/jobs/')
      .then(response => {
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        return response.json();
      })
      .then(data => {
        setJobs(data);
        setLoading(false);
      })
      .catch(err => {
        console.error("Error fetching jobs:", err);
        setError('Failed to load job history. Please try again later.');
        setLoading(false);
      });
  }, []); // Empty array [] means "Run only once"

  return (
    <div className="App">
      <header>
        <h1>Guilherme Moneda</h1>
        <p className="subtitle">My Professional Journey</p>
      </header>

      <main>
        {loading && <p>Loading resume...</p>}
        
        {error && <p style={{color: 'red'}}>{error}</p>}

        {jobs.map(job => (
          <div key={job.id} className="job-card">
            <div className="job-header">
              <div>
                <span className="job-title">{job.title}</span>
                {job.is_current && <span className="current-badge">Current</span>}
              </div>
              <span className="job-dates">
                {job.start_date} — {job.end_date ? job.end_date : 'Present'}
              </span>
            </div>
            
            <div className="job-company">{job.company}</div>
            
            <div className="job-description">
              {job.description}
            </div>
          </div>
        ))}
      </main>
    </div>
  );
}

export default App;