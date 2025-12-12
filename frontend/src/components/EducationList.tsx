import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react'; 

interface EducationItem {
  id: number;
  institution: string;
  degree: string;
  start_date: string;
  end_date: string | null;
  is_active: boolean; // <--- Added the new field
  description: string;
}

const EducationList: React.FC = () => {
  const [schools, setSchools] = useState<EducationItem[]>([]);

  useEffect(() => {
    fetch('/api/education/')
      .then((res) => res.json())
      .then((data) => setSchools(data))
      .catch((err) => console.error(err));
  }, []);

  return (
    <div className="space-y-6">
      {schools.map((school, index) => (
        <motion.div
          key={school.id}
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.1 }}
          className={`bg-gray-800 rounded-xl p-6 border shadow-lg transition-colors ${
            school.is_active 
              ? 'border-green-500/30 hover:border-green-500/50' // Subtle green border if active
              : 'border-gray-700 hover:border-indigo-500'
          }`}
        >
          <div className="flex flex-col md:flex-row md:justify-between md:items-start mb-2">
            <div>
              <h3 className="text-xl font-bold text-white flex items-center gap-3">
                {school.degree}
                {/* Optional: Add a small badge if active */}
                {school.is_active && (
                  <span className="px-2 py-0.5 text-xs font-bold bg-green-900/50 text-green-400 rounded-full border border-green-700/50">
                    CURRENT
                  </span>
                )}
              </h3>
              <p className="text-indigo-400 font-medium text-lg">{school.institution}</p>
            </div>
            
            <div className="text-gray-500 text-sm mt-2 md:mt-0 font-mono flex items-center">
              <span>{school.start_date}</span>
              <span className="mx-2"> &mdash; </span>
              <span className={school.is_active ? "text-green-400 font-bold" : ""}>
                {school.is_active ? 'Present' : school.end_date}
              </span>
            </div>
          </div>
          
          {school.description && (
            <p className="text-gray-400 mt-4 leading-relaxed">
              {school.description}
            </p>
          )}
        </motion.div>
      ))}
    </div>
  );
};

export default EducationList;