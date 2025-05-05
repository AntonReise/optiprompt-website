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
    <div className="border border-black">
      <button
        className="w-full flex justify-between items-center py-7 px-4 text-left"
        onClick={toggleAccordion}
      >
        <h3 className="text-[18px] font-bold">{title}</h3>
        <Image 
          src="/images/img_frame.svg" alt={isOpen ?"Close" : "Open"} 
          width={24} 
          height={24} 
          className={`transition-transform ${isOpen ? 'rotate-180' : ''}`}
        />
      </button>
      
      {isOpen && (
        <div className="px-4 pb-4">
          {children}
        </div>
      )}
    </div>
  );
};

export default Accordion;