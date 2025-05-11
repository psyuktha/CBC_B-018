'use client';

import { useState, useEffect } from 'react';
import {
  BarChart3,
  Bell,
  ChevronLeft,
  ChevronRight,
  CreditCard,
  Home,
  Lock,
  Menu,
  Moon,
  Save,
  SettingsIcon,
  Store,
  Sun,
  User,
  Users,
  X,
} from 'lucide-react';
import { Inter } from 'next/font/google';
import Image from 'next/image';
import Link from 'next/link';
import axios from 'axios';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Sheet, SheetContent } from '@/components/ui/sheet';
import { Switch } from '@/components/ui/switch';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Sidebar } from '@/components/sidebar';
import { usePathname } from 'next/navigation';
import { getGovernmentId } from '@/app/utils/auth';
import { Header } from '@/components/header';

const inter = Inter({ subsets: ['latin'] });

interface AccountInfo {
  id: string;
  name: string;
  email: string;
  created_at: string;
  updated_at: string;
  user_type: string;
  jurisdiction: string;
  govt_id: string;
  image_url: string;
}

interface WalletInfo {
  balance: number;
  schemes: string[];
  transactions: string[];
}

interface GovernmentResponse {
  account_info: AccountInfo;
  wallet_info: WalletInfo;
}

const API_BASE_URL = 'http://localhost:8000/api/v1';

export default function SettingsPage() {
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [userDetails, setUserDetails] = useState<AccountInfo | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchUserDetails = async () => {
      try {
        const response = await axios.get<GovernmentResponse>(
          `${API_BASE_URL}/governments/${getGovernmentId()}`,
          {
            headers: {
              'Content-Type': 'application/json',
              'Accept': 'application/json',
            },
            withCredentials: true
          }
        );
        setUserDetails(response.data.account_info);
      } catch (error) {
        console.error('Error fetching user details:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchUserDetails();
  }, []);

  return (
    <div className={`${inter.className} flex min-h-screen bg-white`}>
      {/* Mobile sidebar */}
      <Sheet open={isMobileOpen} onOpenChange={setIsMobileOpen}>
        <SheetContent side="left" className="w-[240px] p-0">
          <div className="flex h-14 items-center border-b px-3">
            <div className="flex items-center gap-2">
              <span className="text-lg font-semibold">Payzee</span>
            </div>
            <Button
              variant="ghost"
              size="icon"
              className="ml-auto"
              onClick={() => setIsMobileOpen(false)}
            >
              <X className="h-4 w-4" />
              <span className="sr-only">Close sidebar</span>
            </Button>
          </div>
        </SheetContent>
      </Sheet>

      {/* Main content */}
      <div className={`flex-1 transition-all duration-300`}>
        <Header isMobileOpen={isMobileOpen} setIsMobileOpen={setIsMobileOpen} />

        {/* Settings content */}
        <main className="p-4 sm:p-6">
          {/* Top section with heading */}
          <div className="mb-6">
            <h1 className="text-2xl font-semibold">Settings</h1>
          </div>

          {/* Settings tabs */}
          <Tabs defaultValue="profile" className="w-full">
            <TabsList className="mb-4">
              <TabsTrigger value="profile" className="flex items-center gap-2">
                <User className="h-4 w-4" />
                Profile
              </TabsTrigger>
              <TabsTrigger value="password" className="flex items-center gap-2">
                <Lock className="h-4 w-4" />
                Password
              </TabsTrigger>
              <TabsTrigger
                value="notifications"
                className="flex items-center gap-2"
              >
                <Bell className="h-4 w-4" />
                Notifications
              </TabsTrigger>
              <TabsTrigger value="system" className="flex items-center gap-2">
                <SettingsIcon className="h-4 w-4" />
                System
              </TabsTrigger>
            </TabsList>

            {/* Profile Settings */}
            <TabsContent value="profile">
              <Card className="shadow-sm">
                <CardHeader>
                  <CardTitle>Profile Settings</CardTitle>
                  <CardDescription>
                    Update your personal information
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex flex-col gap-6 md:flex-row">
                    <div className="flex flex-col items-center gap-4">
                      <div className="relative">
                        <Image
                          src={userDetails?.image_url || "/placeholder.svg?height=100&width=100"}
                          width={100}
                          height={100}
                          className="h-24 w-24 rounded-full object-cover"
                          alt="Profile avatar"
                        />
                        <Button
                          variant="outline"
                          size="sm"
                          className="absolute -bottom-2 -right-2 h-8 w-8 rounded-full p-0"
                        >
                          <User className="h-4 w-4" />
                          <span className="sr-only">Change avatar</span>
                        </Button>
                      </div>
                      <p className="text-sm text-gray-500">
                        Upload a new avatar
                      </p>
                    </div>
                    <div className="flex-1 space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="name">Organization Name</Label>
                        <Input
                          id="name"
                          placeholder="Organization Name"
                          defaultValue={userDetails?.name || ''}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="jurisdiction">Jurisdiction</Label>
                        <Input
                          id="jurisdiction"
                          placeholder="Jurisdiction"
                          defaultValue={userDetails?.jurisdiction || ''}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="govt_id">Government ID</Label>
                        <Input
                          id="govt_id"
                          placeholder="Government ID"
                          defaultValue={userDetails?.govt_id || ''}
                          disabled
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="email">Email</Label>
                        <Input
                          id="email"
                          type="email"
                          placeholder="organization@example.com"
                          defaultValue={userDetails?.email || ''}
                        />
                      </div>
                    </div>
                  </div>
                </CardContent>
                <CardFooter className="flex justify-end">
                  <Button className="bg-[#2563EB] hover:bg-[#1d4ed8]">
                    <Save className="mr-2 h-4 w-4" /> Save Changes
                  </Button>
                </CardFooter>
              </Card>
            </TabsContent>

            {/* Password Settings */}
            <TabsContent value="password">
              <Card className="shadow-sm">
                <CardHeader>
                  <CardTitle>Password Settings</CardTitle>
                  <CardDescription>Update your password</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="current-password">Current Password</Label>
                    <Input id="current-password" type="password" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="new-password">New Password</Label>
                    <Input id="new-password" type="password" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="confirm-password">
                      Confirm New Password
                    </Label>
                    <Input id="confirm-password" type="password" />
                  </div>
                </CardContent>
                <CardFooter className="flex justify-end">
                  <Button className="bg-[#2563EB] hover:bg-[#1d4ed8]">
                    <Save className="mr-2 h-4 w-4" /> Update Password
                  </Button>
                </CardFooter>
              </Card>
            </TabsContent>

            {/* Notification Settings */}
            <TabsContent value="notifications">
              <Card className="shadow-sm">
                <CardHeader>
                  <CardTitle>Notification Settings</CardTitle>
                  <CardDescription>
                    Configure your notification preferences
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label htmlFor="email-notifications">
                          Email Notifications
                        </Label>
                        <p className="text-sm text-gray-500">
                          Receive notifications via email
                        </p>
                      </div>
                      <Switch id="email-notifications" defaultChecked />
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label htmlFor="push-notifications">
                          Push Notifications
                        </Label>
                        <p className="text-sm text-gray-500">
                          Receive notifications in the dashboard
                        </p>
                      </div>
                      <Switch id="push-notifications" defaultChecked />
                    </div>
                    <div className="space-y-4">
                      <Label>Notification Types</Label>
                      <div className="space-y-2">
                        <div className="flex items-center space-x-2">
                          <Checkbox id="new-beneficiary" defaultChecked />
                          <Label htmlFor="new-beneficiary">
                            New Beneficiary Registration
                          </Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Checkbox id="new-vendor" defaultChecked />
                          <Label htmlFor="new-vendor">
                            New Vendor Registration
                          </Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Checkbox id="transaction" defaultChecked />
                          <Label htmlFor="transaction">
                            Transaction Alerts
                          </Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Checkbox id="system" defaultChecked />
                          <Label htmlFor="system">System Updates</Label>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
                <CardFooter className="flex justify-end">
                  <Button className="bg-[#2563EB] hover:bg-[#1d4ed8]">
                    <Save className="mr-2 h-4 w-4" /> Save Preferences
                  </Button>
                </CardFooter>
              </Card>
            </TabsContent>

            {/* System Settings */}
            <TabsContent value="system">
              <Card className="shadow-sm">
                <CardHeader>
                  <CardTitle>System Settings</CardTitle>
                  <CardDescription>
                    Configure system preferences
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>Theme Mode</Label>
                      <p className="text-sm text-gray-500">
                        Toggle between light and dark mode
                      </p>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Button
                        variant={isDarkMode ? 'outline' : 'default'}
                        size="sm"
                        className={!isDarkMode ? 'bg-[#2563EB]' : ''}
                        onClick={() => setIsDarkMode(false)}
                      >
                        <Sun className="mr-2 h-4 w-4" /> Light
                      </Button>
                      <Button
                        variant={!isDarkMode ? 'outline' : 'default'}
                        size="sm"
                        className={isDarkMode ? 'bg-[#2563EB]' : ''}
                        onClick={() => setIsDarkMode(true)}
                      >
                        <Moon className="mr-2 h-4 w-4" /> Dark
                      </Button>
                    </div>
                  </div>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label htmlFor="auto-logout">Auto Logout</Label>
                        <p className="text-sm text-gray-500">
                          Automatically log out after inactivity
                        </p>
                      </div>
                      <Switch id="auto-logout" defaultChecked />
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label htmlFor="two-factor">
                          Two-Factor Authentication
                        </Label>
                        <p className="text-sm text-gray-500">
                          Enable additional security
                        </p>
                      </div>
                      <Switch id="two-factor" />
                    </div>
                  </div>
                </CardContent>
                <CardFooter className="flex justify-end">
                  <Button className="bg-[#2563EB] hover:bg-[#1d4ed8]">
                    <Save className="mr-2 h-4 w-4" /> Save Settings
                  </Button>
                </CardFooter>
              </Card>
            </TabsContent>
          </Tabs>
        </main>
      </div>
    </div>
  );
}
