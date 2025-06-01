"use client";

import AppNavbar from '@/components/AppNavbar';
import AppFooter from '@/components/AppFooter';

export default function BillingLayout({ children }) {
  return (
    <div className="flex flex-col min-h-screen">
      <AppNavbar />
      <main className="flex-1">
        {children}
      </main>
      <AppFooter />
    </div>
  );
}