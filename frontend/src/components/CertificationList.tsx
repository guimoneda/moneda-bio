import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react'; 

interface CertificationItem {
  id: number;
  name: string;
  issuing_organization: string;
  issue_date: string;
  expiration_date: string | null;
  credential_url: string | null;
  is_active: boolean; 
  description: string;
}

const CertificationList: React.FC = () => {
  const [certs, setCerts] = useState<CertificationItem[]>([]);

  useEffect(() => {
    fetch('/api/certifications/')
      .then((res) => res.json())
      .then((data) => setCerts(data))
      .catch((err) => console.error(err));
  }, []);

  return (
    <div className="space-y-6">
      {certs.map((cert, index) => (
        <motion.div
          key={cert.id}
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.1 }}
          className={`bg-gray-800 rounded-xl p-6 border shadow-lg transition-colors ${
            cert.is_active 
              ? 'border-blue-500/30 hover:border-blue-500/50' 
              : 'border-gray-700 hover:border-indigo-500'
          }`}
        >
          <div className="flex flex-col mb-2">
            
            {/* ROW 1: Cert Name & Badge */}
            <div className="flex justify-between items-start mb-1">
              <h3 className="text-xl font-bold text-white flex items-center gap-3">
                {cert.name}
                {cert.is_active && (
                  <span className="px-2 py-0.5 text-xs font-bold bg-blue-900/50 text-blue-400 rounded-full border border-blue-700/50">
                    ACTIVE
                  </span>
                )}
              </h3>
            </div>
            
            {/* ROW 2: Organization | Date Grid */}
            <div className="flex flex-col md:flex-row md:justify-between md:items-center">
              
              <div className="flex items-center gap-2">
                <p className="text-indigo-400 font-medium text-lg">
                  {cert.issuing_organization}
                </p>
                {/* Optional: Verification Link Icon */}
                {cert.credential_url && (
                    <a 
                        href={cert.credential_url} 
                        target="_blank" 
                        rel="noreferrer"
                        className="text-gray-500 hover:text-white transition-colors"
                        title="Verify Credential"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                        </svg>
                    </a>
                )}
              </div>
              
              {/* DATE DISPLAY */}
              <div className="mt-2 md:mt-0 text-gray-500 text-sm font-mono grid grid-cols-[auto_20px_auto] items-center gap-2">
                 <span className="text-right">
                    Issued: {cert.issue_date}
                 </span>
                 
                 {/* Only show expiration if it exists */}
                 {cert.expiration_date ? (
                     <>
                        <span className="text-center text-gray-600">/</span>
                        <span className="text-left text-red-400/80">
                            Expires: {cert.expiration_date}
                        </span>
                     </>
                 ) : (
                     <span className="col-span-2 text-left text-green-500/80 ml-2">
                         (No Expiration)
                     </span>
                 )}
              </div>

            </div>
          </div>
          
          {cert.description && (
            <div 
              className="text-gray-400 mt-4 leading-relaxed border-t border-gray-700/50 pt-4 [&_p]:mb-4 [&_b]:font-bold [&_strong]:font-bold [&_strong]:text-white"
              dangerouslySetInnerHTML={{ __html: cert.description }}
            />
          )}
        </motion.div>
      ))}
    </div>
  );
};

export default CertificationList;