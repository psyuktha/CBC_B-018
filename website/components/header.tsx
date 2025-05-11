import { useState, useEffect } from 'react';
import { Bell, Menu, X } from 'lucide-react';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import axios from 'axios';
import { getGovernmentId } from '@/app/utils/auth';

interface HeaderProps {
  isMobileOpen: boolean;
  setIsMobileOpen: (open: boolean) => void;
}

interface GovernmentInfo {
  account_info: {
    id: string;
    name: string;
    email: string;
    image_url: string;
  };
}

const API_BASE_URL = 'http://localhost:8000/api/v1';

export function Header({ isMobileOpen, setIsMobileOpen }: HeaderProps) {
  const [governmentInfo, setGovernmentInfo] = useState<GovernmentInfo | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchGovernmentInfo = async () => {
      try {
        const response = await axios.get<GovernmentInfo>(
          `${API_BASE_URL}/governments/${getGovernmentId()}`,
          {
            headers: {
              'Content-Type': 'application/json',
              'Accept': 'application/json',
            },
            withCredentials: true
          }
        );
        setGovernmentInfo(response.data);
      } catch (error) {
        console.error('Error fetching government info:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchGovernmentInfo();
  }, []);

  console.log(governmentInfo);

  return (
    <header className="top-0 z-10 flex h-14 items-center gap-4 border-b bg-white px-4 sm:px-6">
      <Button
        variant="ghost"
        size="icon"
        className="md:hidden"
        onClick={() => setIsMobileOpen(true)}
      >
        <Menu className="h-5 w-5" />
        <span className="sr-only">Toggle menu</span>
      </Button>
      <div className="flex items-center gap-2 md:hidden">
        <span className="text-lg font-semibold">Payzee</span>
      </div>
      <div className="ml-auto flex items-center gap-4">
        <Button variant="ghost" size="icon" className="relative">
          <Bell className="h-5 w-5" />
          <span className="sr-only">Notifications</span>
          <Badge className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-black p-0 text-white">
            3
          </Badge>
        </Button>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="rounded-full">
              <Image
                src={governmentInfo?.account_info?.image_url || "/placeholder.svg?height=32&width=32"}
                width={32}
                height={32}
                className="h-8 w-8 rounded-full object-cover"
                alt={governmentInfo?.account_info?.name || "Government avatar"}
              />
              <span className="sr-only">Toggle user menu</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>
              {governmentInfo?.account_info?.name || "Government"}
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem>Profile</DropdownMenuItem>
            <DropdownMenuItem>Settings</DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem>Logout</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
} 