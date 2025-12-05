'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import Image from 'next/image';

interface NavItem {
  label: string;
  href: string;
  icon?: string;
}

interface SidebarProps {
  navItems: NavItem[];
}

const Sidebar: React.FC<SidebarProps> = ({ navItems }) => {
  const pathname = usePathname();

  return (
    <aside className="w-64 bg-white border-r border-gray-200 sticky top-[73px] h-[calc(100vh-73px)] overflow-y-auto z-40">
      <nav className="pt-10 pb-6 px-6">
        <div className="mb-6">
          <h2 className="text-xs font-semibold text-gray-500 uppercase tracking-wider px-4 mb-2">
            Navigation
          </h2>
        </div>
        <ul className="space-y-1">
          {navItems.map((item) => {
            const isActive = pathname === item.href || (item.href !== '/' && pathname?.startsWith(item.href));

            return (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className={`
                    flex items-center px-4 py-3 text-[16px] font-normal rounded-[10px] transition-colors
                    ${isActive
                      ? 'bg-[#2563EB] text-white font-medium'
                      : 'text-[#00000099] hover:text-black hover:bg-gray-50'
                    }
                  `}
                >
                  {item.icon && (
                    <Image
                      src={item.icon}
                      alt=""
                      width={20}
                      height={20}
                      className={`mr-3 ${isActive ? 'brightness-0 invert' : ''}`}
                    />
                  )}
                  <span>{item.label}</span>
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>
    </aside>
  );
};

export default Sidebar;

