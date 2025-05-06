'use client';

import React, { useState } from 'react';
import Image from 'next/image';

interface AccordionProps {
  title: string;
  children?: React.ReactNode;
}

const Accordion: React.FC<AccordionProps> = ({ title, children }) => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleAccordion = () => {
    setIsOpen(!isOpen);
  };

  return (
    <div className="bg-white rounded-2xl shadow-md hover:shadow-lg transition-shadow duration-300 overflow-hidden">
      <button
        className="w-full flex justify-between items-center py-6 px-8 text-left"
        onClick={toggleAccordion}
      >
        <h3 className="text-[18px] font-bold text-black">{title}</h3>
        <Image 
          src="/images/img_frame.svg" alt={isOpen ? "Close" : "Open"} 
          width={24} 
          height={24} 
          className={`transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`}
        />
      </button>
      
      <div 
        className={`px-8 overflow-hidden transition-all duration-300 ${
          isOpen ? 'max-h-[500px] pb-6 opacity-100' : 'max-h-0 opacity-0'
        }`}
      >
        {children}
      </div>
    </div>
  );
};

export default Accordion;