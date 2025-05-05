'use client';

import React from 'react';

interface TagProps {
  children: React.ReactNode;
  className?: string;
}

const Tag: React.FC<TagProps> = ({ children, className = '' }) => {
  return (
    <div className={`inline-flex items-center px-3 py-1 text-xs font-medium rounded-lg border border-gray-200 ${className}`}>
      {children}
    </div>
  );
};

export default Tag;