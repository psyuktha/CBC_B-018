'use client';

import { useState, useEffect } from 'react';
import axios from 'axios';
import {
  Bell,
  Filter,
  Menu,
  Search,
  X,
  Eye,
} from 'lucide-react';
import { Inter } from 'next/font/google';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { toast } from '@/components/ui/use-toast';
import { getGovernmentId } from '@/app/utils/auth';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Input } from '@/components/ui/input';
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from '@/components/ui/pagination';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Sheet, SheetContent } from '@/components/ui/sheet';
import { Header } from '@/components/header';

const inter = Inter({ subsets: ['latin'] });

// Constants
const API_BASE_URL = 'http://localhost:8000/api/v1';

// Define types for our API response
interface AccountInfo {
  id: string;
  name: string;
  email: string;
  created_at: string;
  updated_at: string;
  user_type: string;
  image_url: string;
  gender: string;
}

interface BusinessInfo {
  business_name: string;
  business_id: string;
  license_type: string;
  occupation: string;
  phone: string;
  address: string;
}

interface WalletInfo {
  balance: number;
  transactions: string[];
}

interface ApiVendor {
  account_info: AccountInfo;
  business_info: BusinessInfo;
  wallet_info: WalletInfo;
}

export default function VendorsPage() {
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [licenseFilter, setLicenseFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [vendors, setVendors] = useState<ApiVendor[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const itemsPerPage = 10;
  const router = useRouter();

  // Fetch vendors from API
  const fetchVendors = async () => {
    try {
      setIsLoading(true);
      const response = await axios.get<ApiVendor[]>(
        `${API_BASE_URL}/governments/${getGovernmentId()}/vendors`,
        {
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
          },
          withCredentials: true
        }
      );
      setVendors(response.data);
      setError(null);
    } catch (error) {
      console.error('Error fetching vendors:', error);
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Failed to fetch vendors. Please try again.',
      });
      setError('Failed to load vendors');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchVendors();
  }, []);

  // Filter vendors based on license type and search query
  const filteredVendors = vendors
    .filter(
      (vendor) =>
        licenseFilter === 'all' ||
        vendor.business_info.license_type.toLowerCase() === licenseFilter.toLowerCase(),
    )
    .filter((vendor) => {
      if (!searchQuery) return true;

      const query = searchQuery.toLowerCase();
      return (
        vendor.account_info.name.toLowerCase().includes(query) ||
        vendor.business_info.business_name.toLowerCase().includes(query) ||
        vendor.business_info.business_id.toLowerCase().includes(query) ||
        vendor.business_info.occupation.toLowerCase().includes(query)
      );
    });

  // Calculate pagination
  const totalPages = Math.ceil(filteredVendors.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentVendors = filteredVendors.slice(startIndex, endIndex);

  // Handle page change
  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  // Generate page numbers
  const getPageNumbers = () => {
    const pageNumbers = [];
    const maxVisiblePages = 5;

    if (totalPages <= maxVisiblePages) {
      for (let i = 1; i <= totalPages; i++) {
        pageNumbers.push(i);
      }
    } else {
      const startPage = Math.max(
        1,
        currentPage - Math.floor(maxVisiblePages / 2),
      );
      const endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);

      if (startPage > 1) {
        pageNumbers.push(1);
        if (startPage > 2) {
          pageNumbers.push('...');
        }
      }

      for (let i = startPage; i <= endPage; i++) {
        pageNumbers.push(i);
      }

      if (endPage < totalPages) {
        if (endPage < totalPages - 1) {
          pageNumbers.push('...');
        }
        pageNumbers.push(totalPages);
      }
    }

    return pageNumbers;
  };

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

        {/* Vendors content */}
        <main className="p-4 sm:p-6">
          {/* Top section with heading */}
          <div className="mb-6 flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
            <h1 className="text-2xl font-semibold">Vendors</h1>
          </div>

          {/* Search and filter section */}
          <div className="mb-6 flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
            <div className="flex items-center gap-2">
              <Filter className="h-4 w-4 text-gray-500" />
              <Select value={licenseFilter} onValueChange={setLicenseFilter}>
                <SelectTrigger className="w-[180px] border-gray-200 bg-gray-50">
                  <SelectValue placeholder="Filter by license" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Licenses</SelectItem>
                  <SelectItem value="government">Government</SelectItem>
                  <SelectItem value="public">Public</SelectItem>
                  <SelectItem value="private">Private</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="relative w-full sm:w-auto">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
              <Input
                type="search"
                placeholder="Search Vendors..."
                className="w-full border-gray-200 bg-gray-50 pl-8 sm:w-[300px]"
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setCurrentPage(1); // Reset to first page on search
                }}
              />
              {searchQuery && (
                <Button
                  variant="ghost"
                  size="icon"
                  className="absolute right-0 top-0 h-full"
                  onClick={() => {
                    setSearchQuery('');
                    setCurrentPage(1);
                  }}
                >
                  <X className="h-4 w-4" />
                  <span className="sr-only">Clear search</span>
                </Button>
              )}
            </div>
          </div>

          {/* Loading state */}
          {isLoading ? (
            <div className="flex h-64 items-center justify-center">
              <div className="h-12 w-12 animate-spin rounded-full border-b-2 border-t-2 border-blue-500"></div>
            </div>
          ) : error ? (
            <div className="mb-6 rounded-md border border-amber-200 bg-amber-50 p-4 text-amber-700">
              {error}
            </div>
          ) : (
            <>
              {/* Vendors table */}
              <div className="mb-6 overflow-hidden rounded-lg border shadow-sm">
                <Table>
                  <TableHeader className="bg-[#F5F5F5]">
                    <TableRow>
                      <TableHead className="text-xs font-semibold uppercase">
                        Vendor Name
                      </TableHead>
                      <TableHead className="text-xs font-semibold uppercase">
                        Business Name
                      </TableHead>
                      <TableHead className="text-xs font-semibold uppercase">
                        Business ID
                      </TableHead>
                      <TableHead className="text-xs font-semibold uppercase">
                        License Type
                      </TableHead>
                      <TableHead className="text-xs font-semibold uppercase">
                        Balance
                      </TableHead>
                      <TableHead className="text-right text-xs font-semibold uppercase">
                        Actions
                      </TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredVendors.length === 0 ? (
                      <TableRow>
                        <TableCell
                          colSpan={6}
                          className="py-8 text-center text-gray-500"
                        >
                          No vendors found
                          {searchQuery ? ` matching "${searchQuery}"` : ''}
                        </TableCell>
                      </TableRow>
                    ) : (
                      currentVendors.map((vendor) => (
                        <TableRow
                          key={vendor.account_info.id}
                          className="cursor-pointer transition-colors hover:bg-[#EEEEEE]"
                        >
                          <TableCell className="py-4">
                            <div className="flex items-center gap-3">
                              <Image
                                src={vendor.account_info.image_url}
                                width={32}
                                height={32}
                                className="h-10 w-10 rounded-full object-cover"
                                alt={vendor.account_info.name}
                              />
                              <div>
                                <div className="font-medium">
                                  {vendor.account_info.name}
                                </div>
                                <div className="text-sm text-gray-500">
                                  {vendor.account_info.email}
                                </div>
                              </div>
                            </div>
                          </TableCell>
                          <TableCell className="py-4">
                            {vendor.business_info.business_name}
                          </TableCell>
                          <TableCell className="py-4">
                            {vendor.business_info.business_id}
                          </TableCell>
                          <TableCell className="py-4">
                            <Badge
                              variant="outline"
                              className={`${
                                vendor.business_info.license_type === 'government'
                                  ? 'border-blue-200 bg-blue-50 text-blue-700'
                                  : vendor.business_info.license_type === 'public'
                                  ? 'border-green-200 bg-green-50 text-green-700'
                                  : 'border-purple-200 bg-purple-50 text-purple-700'
                              }`}
                            >
                              {vendor.business_info.license_type.charAt(0).toUpperCase() +
                                vendor.business_info.license_type.slice(1)}
                            </Badge>
                          </TableCell>
                          <TableCell className="py-4">
                            ₹{vendor.wallet_info.balance.toLocaleString('en-IN')}
                          </TableCell>
                          <TableCell className="py-4 text-right">
                            <div className="flex justify-end gap-2">
                              <Button
                                variant="ghost"
                                size="icon"
                                className="h-8 w-8 text-gray-500 hover:text-[#2563EB]"
                                onClick={() => router.push(`/vendors/${vendor.account_info.id}`)}
                              >
                                <Eye className="h-4 w-4" />
                                <span className="sr-only">View</span>
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </div>

              {/* Pagination */}
              {filteredVendors.length > 0 && (
                <Pagination>
                  <PaginationContent>
                    <PaginationItem>
                      <PaginationPrevious
                        href="#"
                        onClick={(e) => {
                          e.preventDefault();
                          if (currentPage > 1) handlePageChange(currentPage - 1);
                        }}
                        className={
                          currentPage === 1 ? 'pointer-events-none opacity-50' : ''
                        }
                      />
                    </PaginationItem>
                    {getPageNumbers().map((page, index) => (
                      <PaginationItem key={index}>
                        {page === '...' ? (
                          <PaginationEllipsis />
                        ) : (
                          <PaginationLink
                            href="#"
                            onClick={(e) => {
                              e.preventDefault();
                              handlePageChange(page as number);
                            }}
                            isActive={currentPage === page}
                          >
                            {page}
                          </PaginationLink>
                        )}
                      </PaginationItem>
                    ))}
                    <PaginationItem>
                      <PaginationNext
                        href="#"
                        onClick={(e) => {
                          e.preventDefault();
                          if (currentPage < totalPages)
                            handlePageChange(currentPage + 1);
                        }}
                        className={
                          currentPage === totalPages
                            ? 'pointer-events-none opacity-50'
                            : ''
                        }
                      />
                    </PaginationItem>
                  </PaginationContent>
                </Pagination>
              )}
            </>
          )}
        </main>
      </div>
    </div>
  );
}
