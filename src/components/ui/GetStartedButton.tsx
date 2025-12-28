'use client';

import React from 'react';
import Link from 'next/link';
import { useAuth } from '@/contexts/AuthContext';
import Button from '@/components/ui/Button';

interface GetStartedButtonProps {
  variant?: 'primary' | 'secondary';
  className?: string;
  children?: React.ReactNode;
  icon?: React.ReactNode;
}

const GetStartedButton: React.FC<GetStartedButtonProps> = ({ 
  variant = 'primary', 
  className = '',
  children = 'Get Started',
  icon
}) => {
  const { isAuthenticated, loading } = useAuth();
  
  // Determine the redirect URL based on authentication status
  const href = loading ? '#' : (isAuthenticated ? '/setup' : '/login?next=/setup');
  
  return (
    <Link href={href}>
      <Button 
        variant={variant}
        className={className}
        disabled={loading}
      >
        {icon && <span className="mr-3">{icon}</span>}
        {children}
      </Button>
    </Link>
  );
};

export default GetStartedButton;

