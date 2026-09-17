import React from 'react';

interface RichTextProps {
  html?: string | null;
  className?: string;
  /** Collapses the output to a single line-clamped block for index rows. */
  clamp?: number;
}

/**
 * Renders the CKEditor HTML stored on the API. Content is authored by the site
 * owner through Django admin, so it is trusted; the `.rich` class in index.css
 * gives it a typographic contract rather than letting tag defaults leak through.
 */
const RichText: React.FC<RichTextProps> = ({ html, className = '', clamp }) => {
  if (!html) return null;

  const clampStyle: React.CSSProperties | undefined = clamp
    ? { display: '-webkit-box', WebkitLineClamp: clamp, WebkitBoxOrient: 'vertical', overflow: 'hidden' }
    : undefined;

  return (
    <div
      className={`rich ${className}`}
      style={clampStyle}
      dangerouslySetInnerHTML={{ __html: html }}
    />
  );
};

export default RichText;
