'use client';

import React from 'react';
import Header from '@/components/common/Header';
import Footer from '@/components/common/Footer';
import Sidebar from '@/components/common/Sidebar';

interface MainLayoutProps {
  children: React.ReactNode;
  showSidebar?: boolean;
}

const navItems = [
  { label: 'Setup & Configuration', href: '/setup' },
  { label: 'Account Settings', href: '/account' },
  { label: 'Subscription & Usage', href: '/subscription' },
];

export default function MainLayout({ children, showSidebar = true }: MainLayoutProps) {
  return (
    <div className="min-h-screen flex flex-col bg-white">
      <Header />
      <div className="flex flex-1 pt-[73px]">
        {showSidebar && (
          <div className="hidden lg:block">
            <Sidebar navItems={navItems} />
          </div>
        )}
        <main className="flex-1">
          {children}
        </main>
      </div>
      <Footer />
    </div>
  );
}

