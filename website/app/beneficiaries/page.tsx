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
}

interface PersonalInfo {
  phone: string;
  id_type: string;
  id_number: string;
  address: string;
  dob: string;
  gender: string;
  occupation: string;
  caste: string;
  annual_income: number;
}

interface WalletInfo {
  govt_wallet: {
    balance: number;
    transactions: string[];
  };
  personal_wallet: {
    balance: number;
    transactions: string[];
  };
}

interface ApiCitizen {
  account_info: AccountInfo;
  personal_info: PersonalInfo;
  wallet_info: WalletInfo;
  scheme_info?: string[];
}

export default function BeneficiariesPage() {
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [occupationFilter, setOccupationFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [citizens, setCitizens] = useState<ApiCitizen[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const itemsPerPage = 10;
  const router = useRouter();

  const fetchBeneficiaries = async () => {
    try {
      setIsLoading(true);
      const response = await axios.get<ApiCitizen[]>(
        `${API_BASE_URL}/governments/${getGovernmentId()}/citizens`,
        {
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
          },
          withCredentials: true
        }
      );
      
      // Filter citizens who have at least one scheme
      const beneficiaries = response.data.filter(citizen => 
        citizen.scheme_info && citizen.scheme_info.length > 0
      );
      
      setCitizens(beneficiaries);
      setError(null);
    } catch (error) {
      console.error('Error fetching beneficiaries:', error);
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Failed to fetch beneficiaries. Please try again.',
      });
      setError('Failed to load beneficiaries');
    } finally {
      setIsLoading(false);
    }
  };

  // Add useEffect to fetch beneficiaries when component mounts
  useEffect(() => {
    fetchBeneficiaries();
  }, []);

  // Filter beneficiaries based on occupation and search query
  const filteredBeneficiaries = citizens
    .filter(
      (citizen) =>
        occupationFilter === 'all' ||
        citizen.personal_info.occupation.toLowerCase() === occupationFilter.toLowerCase(),
    )
    .filter((citizen) => {
      if (!searchQuery) return true;

      const query = searchQuery.toLowerCase();
      return (
        citizen.account_info.name.toLowerCase().includes(query) ||
        citizen.account_info.email.toLowerCase().includes(query) ||
        citizen.personal_info.id_number.toLowerCase().includes(query) ||
        citizen.personal_info.phone.toLowerCase().includes(query)
      );
    });

  // Calculate pagination
  const totalPages = Math.ceil(filteredBeneficiaries.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentBeneficiaries = filteredBeneficiaries.slice(startIndex, endIndex);

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

  // Get unique occupations for filter
  const occupations = [
    'all',
    ...new Set(citizens.map((citizen) => citizen.personal_info.occupation)),
  ];

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

        {/* Beneficiaries content */}
        <main className="p-4 sm:p-6">
          {/* Top section with heading */}
          <div className="mb-6 flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
            <h1 className="text-2xl font-semibold">Beneficiaries</h1>
          </div>

          {/* Search and filter section */}
          <div className="mb-6 flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
            <div className="flex items-center gap-2">
              <Filter className="h-4 w-4 text-gray-500" />
              <Select value={occupationFilter} onValueChange={setOccupationFilter}>
                <SelectTrigger className="w-[180px] border-gray-200 bg-gray-50">
                  <SelectValue placeholder="Filter by occupation" />
                </SelectTrigger>
                <SelectContent>
                  {occupations.map((occupation) => (
                    <SelectItem key={occupation} value={occupation}>
                      {occupation.charAt(0).toUpperCase() + occupation.slice(1)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="relative w-full sm:w-auto">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
              <Input
                type="search"
                placeholder="Search Beneficiaries..."
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
              {/* Beneficiaries table */}
              <div className="mb-6 overflow-hidden rounded-lg border shadow-sm">
            <Table>
              <TableHeader className="bg-[#F5F5F5]">
                <TableRow>
                  <TableHead className="text-xs font-semibold uppercase">
                        Beneficiary
                      </TableHead>
                      <TableHead className="text-xs font-semibold uppercase">
                        ID Number
                  </TableHead>
                  <TableHead className="text-xs font-semibold uppercase">
                        Occupation
                  </TableHead>
                  <TableHead className="text-xs font-semibold uppercase">
                        Annual Income
                  </TableHead>
                  <TableHead className="text-xs font-semibold uppercase">
                        Govt. Wallet
                  </TableHead>
                  <TableHead className="text-xs font-semibold uppercase">
                        Schemes
                  </TableHead>
                  <TableHead className="text-right text-xs font-semibold uppercase">
                    Actions
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                    {filteredBeneficiaries.length === 0 ? (
                      <TableRow>
                        <TableCell
                          colSpan={7}
                          className="py-8 text-center text-gray-500"
                        >
                          No beneficiaries found
                          {searchQuery ? ` matching "${searchQuery}"` : ''}
                        </TableCell>
                      </TableRow>
                    ) : (
                      currentBeneficiaries.map((citizen) => (
                  <TableRow
                          key={citizen.account_info.id}
                          className="cursor-pointer transition-colors hover:bg-[#EEEEEE]"
                  >
                          <TableCell className="py-4">
                            <div className="flex items-center gap-3">
                              <Image
                                src={citizen.account_info.image_url}
                                width={40}
                                height={40}
                                className="h-10 w-10 rounded-full object-cover"
                                alt={citizen.account_info.name}
                              />
                              <div>
                                <div className="font-medium">
                                  {citizen.account_info.name}
                                </div>
                                <div className="text-sm text-gray-500">
                                  {citizen.account_info.email}
                                </div>
                              </div>
                            </div>
                          </TableCell>
                          <TableCell className="py-4">
                            {citizen.personal_info.id_number}
                          </TableCell>
                          <TableCell className="py-4">
                            {citizen.personal_info.occupation.charAt(0).toUpperCase() +
                              citizen.personal_info.occupation.slice(1)}
                          </TableCell>
                          <TableCell className="py-4">
                            ₹{citizen.personal_info.annual_income.toLocaleString('en-IN')}
                    </TableCell>
                    <TableCell className="py-4">
                            ₹{citizen.wallet_info.govt_wallet.balance.toLocaleString('en-IN')}
                    </TableCell>
                    <TableCell className="py-4">
                            <Badge variant="secondary">
                              {citizen.scheme_info?.length || 0} Schemes
                            </Badge>
                    </TableCell>
                    <TableCell className="py-4 text-right">
                      <div className="flex justify-end gap-2">
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 text-gray-500 hover:text-[#2563EB]"
                                onClick={() => router.push(`/beneficiaries/${citizen.account_info.id}`)}
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
              {filteredBeneficiaries.length > 0 && (
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
