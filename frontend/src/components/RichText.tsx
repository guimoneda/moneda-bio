import React from 'react';

interface RichTextProps {
  html?: string | null;
  className?: string;
}

/**
 * Renders the CKEditor HTML stored on the API. Content is authored by the site
 * owner through Django admin, so it is trusted; the `.rich` class in index.css
 * gives it a typographic contract rather than letting tag defaults leak through.
 */
const RichText: React.FC<RichTextProps> = ({ html, className = '' }) => {
  if (!html) return null;

  return <div className={`rich ${className}`} dangerouslySetInnerHTML={{ __html: html }} />;
};

export default RichText;
