'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import Button from '@/components/ui/Button';
import { useAuth } from '@/contexts/AuthContext';

const Header: React.FC = () => {
  // useAuth will return safe defaults if not in provider
  const { user, loading, signOut, isAuthenticated } = useAuth();

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
          <Link href="/setup" className="text-[16px] text-[#00000099] hover:text-black font-normal">
            Setup
          </Link>
          <Link href="#pricing" className="text-[16px] text-[#00000099] hover:text-black font-normal">
            Pricing
          </Link>
          <Link href="#faq" className="text-[16px] text-[#00000099] hover:text-black font-normal">
            FAQ
          </Link>
        </nav>
        
        <div className="flex items-center space-x-4">
          {!loading && (
            <>
              {isAuthenticated ? (
                <>
                  <Link href="/account">
                    <Button 
                      variant="secondary" 
                      className="rounded-[10px] bg-white border border-gray-300 text-black hover:bg-gray-50 px-4 py-2 text-[14px] font-medium"
                    >
                      Account
                    </Button>
                  </Link>
                  <Button 
                    variant="primary" 
                    onClick={signOut}
                    className="rounded-[10px] bg-black text-white px-6 py-2 text-[16px] font-medium"
                  >
                    Sign Out
                  </Button>
                </>
              ) : (
                <Link href="/login">
                  <Button 
                    variant="primary" 
                    className="rounded-[10px] bg-black text-white px-6 py-2 text-[16px] font-medium flex items-center"
                  >
                    <Image src="/images/chat-icon.svg" alt="Login" width={20} height={20} className="mr-2" />
                    Login
                  </Button>
                </Link>
              )}
            </>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header; 