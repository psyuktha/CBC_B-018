'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import {
  ChevronLeft,
  ChevronRight,
  Home,
  BarChart3,
  Users,
  Store,
  CreditCard,
  Settings,
  FileText,
  LucideIcon,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent } from '@/components/ui/sheet';

export interface SidebarItem {
  name: string;
  icon: LucideIcon;
  active: boolean;
  href: string;
}

interface SidebarProps {
  pathname: string;
  isMobileOpen?: boolean;
  setIsMobileOpen?: (value: boolean) => void;
}

export function Sidebar({
  pathname,
  isMobileOpen = false,
  setIsMobileOpen,
}: SidebarProps) {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [internalMobileOpen, setInternalMobileOpen] = useState(false);

  // Use the provided state or fallback to internal state
  const mobileOpen = setIsMobileOpen ? isMobileOpen : internalMobileOpen;
  const handleMobileOpenChange = setIsMobileOpen || setInternalMobileOpen;

  // Update the SidebarItem array in components/sidebar.tsx
  const sidebarItems: SidebarItem[] = [
    { name: 'Dashboard', icon: Home, active: pathname === '/', href: '/' },
    {
      name: 'Schemes',
      icon: BarChart3,
      active: pathname.startsWith('/schemes'),
      href: '/schemes',
    },
    {
      name: 'Applications',
      icon: FileText, // You'll need to import this icon
      active: pathname.startsWith('/applications'),
      href: '/applications',
    },
    {
      name: 'Beneficiaries',
      icon: Users,
      active: pathname.startsWith('/beneficiaries'),
      href: '/beneficiaries',
    },
    {
      name: 'Vendors',
      icon: Store,
      active: pathname.startsWith('/vendors'),
      href: '/vendors',
    },
    {
      name: 'Transactions',
      icon: CreditCard,
      active: pathname.startsWith('/transactions'),
      href: '/transactions',
    },
    {
      name: 'Settings',
      icon: Settings,
      active: pathname.startsWith('/settings'),
      href: '/settings',
    },
  ];

  return (
    <>
      {/* Sidebar for desktop */}
      <aside
        className={`relative flex min-h-full flex-col border-r bg-white transition-all duration-300 ${
          isCollapsed ? 'w-[70px]' : 'w-[240px]'
        } hidden md:flex`}
      >
        <div className="flex h-14 items-center border-b px-3">
          <div
            className={`flex items-center gap-2 ${isCollapsed ? 'w-full justify-center' : ''}`}
          >
            <Image
              src="/logo.png"
              alt="Payzee Logo"
              width={isCollapsed ? 32 : 28}
              height={isCollapsed ? 32 : 28}
              className="object-contain"
            />
            {!isCollapsed && (
              <span className="text-lg font-semibold">Payzee</span>
            )}
          </div>
          <Button
            variant="ghost"
            size="icon"
            className={`ml-auto ${isCollapsed ? 'hidden' : ''}`}
            onClick={() => setIsCollapsed(true)}
          >
            <ChevronLeft className="h-4 w-4" />
            <span className="sr-only">Collapse sidebar</span>
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className={`ml-auto ${!isCollapsed ? 'hidden' : ''}`}
            onClick={() => setIsCollapsed(false)}
          >
            <ChevronRight className="h-4 w-4" />
            <span className="sr-only">Expand sidebar</span>
          </Button>
        </div>
        <nav className="flex-1 overflow-auto py-4">
          <ul className="grid gap-1 px-2">
            {sidebarItems.map((item) => (
              <li key={item.name}>
                <Link
                  href={item.href}
                  className={`flex items-center gap-3 rounded-md px-3 py-2 text-sm transition-colors ${
                    item.active
                      ? 'bg-black text-white'
                      : 'text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  <item.icon
                    className={`h-4 w-4 ${isCollapsed ? 'mx-auto' : ''}`}
                  />
                  {!isCollapsed && <span>{item.name}</span>}
                  {isCollapsed && <span className="sr-only">{item.name}</span>}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      </aside>{' '}
      {/* Mobile sidebar */}
      <div className="md:hidden md:pl-[240px]">
        <Sheet open={mobileOpen} onOpenChange={handleMobileOpenChange}>
          <SheetContent side="left" className="w-[240px] p-0">
            {' '}
            <div className="flex h-14 items-center border-b px-3">
              <div className="flex items-center gap-2">
                <Image
                  src="/logo.png"
                  alt="Payzee Logo"
                  width={28}
                  height={28}
                  className="object-contain"
                />
                <span className="text-lg font-semibold">Payzee</span>
              </div>
            </div>
            <nav className="flex-1 overflow-auto py-4">
              <ul className="grid gap-1 px-2">
                {sidebarItems.map((item) => (
                  <li key={item.name}>
                    <Link
                      href={item.href}
                      className={`flex items-center gap-3 rounded-md px-3 py-2 text-sm transition-colors ${
                        item.active
                          ? 'bg-black text-white'
                          : 'text-gray-700 hover:bg-gray-100'
                      }`}
                      onClick={() => handleMobileOpenChange(false)}
                    >
                      <item.icon className="h-4 w-4" />
                      <span>{item.name}</span>
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
          </SheetContent>
        </Sheet>
      </div>
    </>
  );
}
