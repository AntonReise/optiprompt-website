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
  iconSize?: number;
}

const Card: React.FC<CardProps> = ({ 
  title, 
  description, 
  icon, 
  className = '',
  hasLearnMore = false,
  iconSize = 32
}) => {
  return (
    <div className={`flex flex-col p-6 bg-white rounded-2xl shadow-lg hover:shadow-xl transition-shadow duration-300 ${className}`}>
      {icon && (
        <div className="mb-4">
          <Image src={icon} alt={title} width={iconSize} height={iconSize} className="object-contain" />
        </div>
      )}
      <h3 className="text-[18px] font-bold text-black mb-3">{title}</h3>
      <p className="text-[16px] text-black/80 mb-6">{description}</p>
      
      {hasLearnMore && (
        <div className="flex items-center mt-auto">
          <Link href="#" className="text-[16px] font-medium text-black hover:text-blue-600 transition-colors">
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