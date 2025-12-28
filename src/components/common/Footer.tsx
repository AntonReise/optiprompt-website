'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';

const Footer: React.FC = () => {
  return (
    <footer className="bg-black text-white py-8">
      <div className="container mx-auto px-5">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
          <div className="flex flex-col md:flex-row items-start md:items-center gap-6 md:gap-12">
            <Image 
              src="/images/img_optiprompt_2.png" alt="OptiPrompt Logo" 
              width={159} 
              height={54} 
              className="mb-2 md:mb-0"
            />
            <p className="text-[14px] text-[#bcbcbc] max-w-[300px]">
              The AI prompt optimizer that makes your coding assistant actually understand what you need.
            </p>
          </div>
          
          <div className="flex flex-col md:flex-row items-start md:items-center gap-6 md:gap-8">
            <div className="flex flex-col gap-2">
              <p className="text-[14px] text-[#bcbcbc]">
                Contact email: <a href="mailto:anton.reise@outlook.com" className="text-white hover:underline">anton.reise@outlook.com</a>
              </p>
              <p className="text-[14px] text-[#bcbcbc]">
                Contact number: <a href="tel:+4917621199167" className="text-white hover:underline">+49 176 21199167</a>
              </p>
            </div>
            
            <div className="flex gap-6">
              <Link href="#" className="text-[14px] text-[#7b7b7b] hover:text-white">
                Privacy
              </Link>
              <Link href="#" className="text-[14px] text-[#7b7b7b] hover:text-white">
                Terms
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;