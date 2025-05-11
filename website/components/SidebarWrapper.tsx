'use client';

import { usePathname } from 'next/navigation';
import { useState } from 'react';
import { Sidebar } from '@/components/sidebar';

export function SidebarWrapper() {
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const pathname = usePathname();

  // Don't render sidebar on login page
  if (pathname === '/auth/login' || pathname === '/auth/register') {
    return null;
  }

  return (
    <Sidebar
      pathname={pathname}
      isMobileOpen={isMobileOpen}
      setIsMobileOpen={setIsMobileOpen}
    />
  );
}
