'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import Button from '@/components/ui/Button';

const Header: React.FC = () => {
  return (
    <header className="bg-white shadow-sm py-5 px-12 fixed top-0 left-0 right-0 z-50">
      <div className="flex justify-between items-center">
        <div className="flex items-center">
          <Link href="/">
            <Image 
              src="/images/img_optiprompt_1.png" alt="Promptimize Logo" 
              width={159} 
              height={55.07} 
              className="h-[55.07px] w-[159px]"
            />
          </Link>
        </div>
        
        <nav className="hidden md:flex items-center space-x-8">
          <Link href="/" className="text-[16px] text-[#00000099] hover:text-black font-normal">
            Home
          </Link>
          <Link href="#features" className="text-[16px] text-[#00000099] hover:text-black font-normal">
            Features
          </Link>
          <Link href="#pricing" className="text-[16px] text-[#00000099] hover:text-black font-normal">
            Pricing
          </Link>
          <Link href="#faq" className="text-[16px] text-[#00000099] hover:text-black font-normal">
            FAQ
          </Link>
          <Link href="/contact" className="text-[16px] text-[#00000099] hover:text-black font-normal">
            Contact
          </Link>
        </nav>
        
        <div className="flex items-center space-x-4">
          <Link href="https://marketplace.visualstudio.com/items?itemName=optiprompt-extension" target="_blank" rel="noopener noreferrer">
            <Button 
              variant="secondary" className="rounded-[10px] bg-white border border-black text-black px-4 py-2 text-[16px] font-medium flex items-center"
            >
              <Image src="/images/vscode-icon.svg" alt="VS Code" width={20} height={20} className="mr-2" />
              Download
            </Button>
          </Link>
          
          <Link href="/signup">
            <Button 
              variant="primary" className="rounded-[10px] bg-black text-white px-4 py-2 text-[16px] font-medium"
            >
              Sign Up
            </Button>
          </Link>
        </div>
      </div>
    </header>
  );
};

export default Header;