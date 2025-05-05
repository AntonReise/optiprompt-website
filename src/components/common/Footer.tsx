'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';

const Footer: React.FC = () => {
  return (
    <footer className="bg-black text-white py-10">
      <div className="container mx-auto px-5">
        <div className="grid grid-cols-1 md:grid-cols-5 gap-8">
          <div className="col-span-1 md:col-span-2">
            <Image 
              src="/images/img_optiprompt_2.png" alt="Promptimize Logo" 
              width={159} 
              height={54} 
              className="mb-4"
            />
            <p className="text-[14px] text-[#bcbcbc] max-w-[240px] mb-8">
              The AI prompt optimizer that makes your coding assistant actually understand what you need.
            </p>
            <div className="flex space-x-5">
              <Link href="#" aria-label="Twitter">
                <Image src="/images/img_socials.svg" alt="Twitter" width={24} height={24} />
              </Link>
              <Link href="#" aria-label="LinkedIn">
                <Image src="/images/img_socials_1.svg" alt="LinkedIn" width={24} height={24} />
              </Link>
              <Link href="#" aria-label="GitHub">
                <Image src="/images/img_socials_24x24.svg" alt="GitHub" width={24} height={24} />
              </Link>
            </div>
          </div>
          
          <div className="col-span-1">
            <h3 className="text-[14px] font-bold mb-4">Product</h3>
            <ul className="space-y-4">
              <li><Link href="#" className="text-[14px] text-[#7b7b7b] hover:text-white">Features</Link></li>
              <li><Link href="#" className="text-[14px] text-[#7b7b7b] hover:text-white">Integrations</Link></li>
              <li><Link href="#" className="text-[14px] text-[#7b7b7b] hover:text-white">Updates</Link></li>
              <li><Link href="#" className="text-[14px] text-[#7b7b7b] hover:text-white">FAQ</Link></li>
              <li><Link href="#" className="text-[14px] text-[#7b7b7b] hover:text-white">Pricing</Link></li>
            </ul>
          </div>
          
          <div className="col-span-1">
            <h3 className="text-[14px] font-bold mb-4">Company</h3>
            <ul className="space-y-4">
              <li><Link href="#" className="text-[14px] text-[#7b7b7b] hover:text-white">About</Link></li>
              <li><Link href="#" className="text-[14px] text-[#7b7b7b] hover:text-white">Blog</Link></li>
              <li><Link href="#" className="text-[14px] text-[#7b7b7b] hover:text-white">Careers</Link></li>
              <li><Link href="#" className="text-[14px] text-[#7b7b7b] hover:text-white">Manifesto</Link></li>
              <li><Link href="#" className="text-[14px] text-[#7b7b7b] hover:text-white">Press</Link></li>
              <li><Link href="#" className="text-[14px] text-[#7b7b7b] hover:text-white">Contact</Link></li>
            </ul>
          </div>
          
          <div className="col-span-1">
            <h3 className="text-[14px] font-bold mb-4">Resources</h3>
            <ul className="space-y-4">
              <li><Link href="#" className="text-[14px] text-[#7b7b7b] hover:text-white">Examples</Link></li>
              <li><Link href="#" className="text-[14px] text-[#7b7b7b] hover:text-white">Community</Link></li>
              <li><Link href="#" className="text-[14px] text-[#7b7b7b] hover:text-white">Guides</Link></li>
              <li><Link href="#" className="text-[14px] text-[#7b7b7b] hover:text-white">Docs</Link></li>
            </ul>
          </div>
          
          <div className="col-span-1">
            <h3 className="text-[14px] font-bold mb-4">Legal</h3>
            <ul className="space-y-4">
              <li><Link href="#" className="text-[14px] text-[#7b7b7b] hover:text-white">Privacy</Link></li>
              <li><Link href="#" className="text-[14px] text-[#7b7b7b] hover:text-white">Terms</Link></li>
              <li><Link href="#" className="text-[14px] text-[#7b7b7b] hover:text-white">Security</Link></li>
            </ul>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;