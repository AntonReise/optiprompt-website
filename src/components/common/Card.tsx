'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';

interface CardProps {
  title: string;
  description: string;
  icon?: string;
  className?: string;
  hasLearnMore?: boolean;
}

const Card: React.FC<CardProps> = ({ 
  title, 
  description, 
  icon, 
  className = '',
  hasLearnMore = true
}) => {
  return (
    <div className={`flex flex-col ${className}`}>
      {icon && (
        <div className="mb-2">
          <Image src={icon} alt={title} width={24} height={24} />
        </div>
      )}
      <h3 className="text-[18px] font-bold text-black mb-2">{title}</h3>
      <p className="text-[16px] text-black mb-4">{description}</p>
      
      {hasLearnMore && (
        <div className="flex items-center mt-auto">
          <Link href="#" className="text-[16px] font-medium text-black">
            Learn more
          </Link>
          <Image 
            src="/images/img_icons.svg" alt="Arrow" 
            width={20} 
            height={20} 
            className="ml-2"
          />
        </div>
      )}
    </div>
  );
};

export default Card;