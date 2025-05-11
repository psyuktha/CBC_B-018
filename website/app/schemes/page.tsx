'use client';

import { useState, useRef, useEffect } from 'react';
import axios from 'axios';
import {
  Bell,
  Edit,
  Filter,
  Menu,
  Plus,
  Search,
  Trash2,
  X,
  Eye,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';
import { Inter } from 'next/font/google';
import Image from 'next/image';
import Link from 'next/link';
import { toast, useToast } from '@/components/ui/use-toast';
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
import { useRouter } from 'next/navigation';
import { Sheet, SheetContent } from '@/components/ui/sheet';
import { Header } from '@/components/header';

const inter = Inter({ subsets: ['latin'] });

// Constants
const API_BASE_URL = 'http://localhost:8000/api/v1';

// Define types for our API response
interface EligibilityCriteria {
  occupation: string | null;
  min_age: number | null;
  max_age: number | null;
  gender: string | null;
  state: string | null;
  district: string | null;
  city: string | null;
  caste: string | null;
  annual_income: number | null;
}

interface ApiScheme {
  id: string;
  name: string;
  description: string;
  govt_id: string;
  amount: number;
  status: string;
  created_at: string;
  updated_at: string;
  eligibility_criteria: EligibilityCriteria;
  tags: string[];
  beneficiaries: any[];
}

// Define types for our transformed scheme data
interface TransformedScheme {
  id: string;
  name: string;
  description: string;
  amount: number;
  launchDate: string;
  targetGroup: string;
  fundAllocated: string;
  status: string;
  eligibility: {
    occupation: string | null;
    minAge: number | null;
    maxAge: number | null;
    gender: string | null;
    state: string | null;
    district: string | null;
    city: string | null;
    caste: string | null;
    annualIncome: number | null;
    tags: string[];
  };
  createdAt: string;
}

export default function SchemesPage() {
  const [statusFilter, setStatusFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [schemes, setSchemes] = useState<TransformedScheme[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const itemsPerPage = 10;
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const { toast } = useToast();

  // Fetch schemes from API
  const fetchSchemes = async () => {
    try {
      setIsLoading(true);
      const response = await axios.get<ApiScheme[]>(
        `${API_BASE_URL}/governments/${getGovernmentId()}/schemes`,
        {
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
          },
          withCredentials: true
        }
      );

      // Transform API data to match component structure
      const transformedSchemes = response.data.map((scheme) => ({
        id: scheme.id,
        name: scheme.name,
        description: scheme.description,
        amount: scheme.amount,
        launchDate: new Date(scheme.created_at).toLocaleDateString('en-IN', {
          day: 'numeric',
          month: 'short',
          year: 'numeric',
        }),
        targetGroup: scheme.tags?.join(', ') || 'All',
        fundAllocated: `₹${scheme.amount.toLocaleString('en-IN')}`,
        status: scheme.status,
        eligibility: {
          occupation: scheme.eligibility_criteria?.occupation || null,
          minAge: scheme.eligibility_criteria?.min_age || null,
          maxAge: scheme.eligibility_criteria?.max_age || null,
          gender: scheme.eligibility_criteria?.gender || null,
          state: scheme.eligibility_criteria?.state || null,
          district: scheme.eligibility_criteria?.district || null,
          city: scheme.eligibility_criteria?.city || null,
          caste: scheme.eligibility_criteria?.caste || null,
          annualIncome: scheme.eligibility_criteria?.annual_income || null,
          tags: scheme.tags || [],
        },
        createdAt: new Date(scheme.created_at).toLocaleDateString('en-IN'),
      }));

      setSchemes(transformedSchemes);
      setError(null);
    } catch (error) {
      console.error('Error fetching schemes:', error);
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Failed to fetch schemes. Please try again.',
      });
      setError('Failed to load schemes');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchSchemes();
  }, []);

  // Filter schemes based on status and search query
  const filteredSchemes = schemes
    .filter(
      (scheme) =>
        statusFilter === 'all' ||
        scheme.status.toLowerCase() === statusFilter.toLowerCase(),
    )
    .filter((scheme) => {
      if (!searchQuery) return true;

      const query = searchQuery.toLowerCase();
      return (
        scheme.name.toLowerCase().includes(query) ||
        scheme.description.toLowerCase().includes(query) ||
        scheme.targetGroup.toLowerCase().includes(query) ||
        (scheme.eligibility.tags &&
          scheme.eligibility.tags.some((tag: string) =>
            tag.toLowerCase().includes(query),
          ))
      );
    });

  // Calculate pagination
  const totalPages = Math.ceil(filteredSchemes.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentSchemes = filteredSchemes.slice(startIndex, endIndex);

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

  const tableRef = useRef<HTMLTableElement>(null);
  const router = useRouter();

  // Handle soft delete
  const handleSoftDelete = async (schemeId: string) => {
    try {
      setIsLoading(true);
      const governmentId = getGovernmentId();
      const response = await axios.delete<SchemeResponse>(
        `${API_BASE_URL}/governments/${governmentId}/schemes/${schemeId}`,
        {
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
          },
          withCredentials: true
        }
      );

      if (response.data.scheme_id) {
        // Update local state to reflect the deletion
        setSchemes(schemes.map(scheme => 
          scheme.id === schemeId 
            ? { ...scheme, status: 'inactive' }
            : scheme
        ));
        toast({
          title: "Success",
          description: "Scheme has been soft deleted",
        });
      }
    } catch (err) {
      console.error('Error soft deleting scheme:', err);
      if (err instanceof Error && err.message.includes('User ID not found in cookies')) {
        router.push('/login');
      } else {
        toast({
          variant: "destructive",
          title: "Error",
          description: "Failed to soft delete scheme",
        });
      }
    } finally {
      setIsLoading(false);
    }
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

        {/* Schemes content */}
        <main className="p-4 sm:p-6">
          {/* Top section with heading and buttons */}
          <div className="mb-6 flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
            <h1 className="text-2xl font-semibold">Schemes</h1>
            <div className="flex flex-wrap gap-2">
              <Button
                className="bg-[#2563EB] hover:bg-[#1d4ed8]"
                onClick={() => router.push('/schemes/create')}
              >
                <Plus className="mr-2 h-4 w-4" /> Add Scheme
              </Button>
              <Button
                variant="outline"
                className="border-[#2563EB] text-[#2563EB]"
              >
                <Edit className="mr-2 h-4 w-4" /> Edit Scheme
              </Button>
              <Button
                variant="outline"
                className="border-red-300 text-red-500 hover:bg-red-50"
              >
                <Trash2 className="mr-2 h-4 w-4" /> Delete Scheme
              </Button>
            </div>
          </div>

          {/* Search and filter section */}
          <div className="mb-6 flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
            <div className="flex items-center gap-2">
              <Filter className="h-4 w-4 text-gray-500" />
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-[180px] border-gray-200 bg-gray-50">
                  <SelectValue placeholder="Filter by status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Statuses</SelectItem>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="inactive">Inactive</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="relative w-full sm:w-auto">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
              <Input
                type="search"
                placeholder="Search Schemes..."
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
              {/* Schemes table */}
              <div className="mb-6 overflow-hidden rounded-lg border shadow-sm">
                <Table ref={tableRef}>
                  <TableHeader className="bg-[#F5F5F5]">
                    <TableRow>
                      <TableHead className="text-xs font-semibold uppercase">
                        Scheme Name
                      </TableHead>
                      <TableHead className="text-xs font-semibold uppercase">
                        Launch Date
                      </TableHead>
                      <TableHead className="text-xs font-semibold uppercase">
                        Target Group
                      </TableHead>
                      <TableHead className="text-xs font-semibold uppercase">
                        Fund Allocated
                      </TableHead>
                      <TableHead className="text-xs font-semibold uppercase">
                        Status
                      </TableHead>
                      <TableHead className="text-right text-xs font-semibold uppercase">
                        Actions
                      </TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredSchemes.length === 0 ? (
                      <TableRow>
                        <TableCell
                          colSpan={6}
                          className="py-8 text-center text-gray-500"
                        >
                          No schemes found
                          {searchQuery ? ` matching "${searchQuery}"` : ''}
                        </TableCell>
                      </TableRow>
                    ) : (
                      currentSchemes.map((scheme) => (
                        <TableRow
                          key={scheme.id}
                          className={`cursor-pointer transition-colors hover:bg-[#EEEEEE] ${
                            scheme.status === 'inactive' ? 'opacity-75' : ''
                          }`}
                          onClick={() => router.push(`/schemes/${scheme.id}`)}
                        >
                          <TableCell className="py-4 font-medium">
                            {scheme.name}
                          </TableCell>
                          <TableCell className="py-4">
                            {scheme.launchDate}
                          </TableCell>
                          <TableCell className="py-4">
                            {scheme.targetGroup}
                          </TableCell>
                          <TableCell className="py-4">
                            {scheme.fundAllocated}
                          </TableCell>
                          <TableCell className="py-4">
                            <Badge
                              variant="outline"
                              className={`${
                                scheme.status === 'active'
                                  ? 'border-green-200 bg-green-50 text-green-700'
                                  : 'border-gray-200 bg-gray-50 text-gray-700'
                              }`}
                            >
                              {scheme.status.charAt(0).toUpperCase() +
                                scheme.status.slice(1)}
                            </Badge>
                          </TableCell>
                          <TableCell className="py-4 text-right">
                            <div className="flex justify-end gap-2">
                              <Button
                                variant="ghost"
                                size="icon"
                                className="h-8 w-8 text-gray-500 hover:text-[#2563EB]"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  router.push(`/schemes/${scheme.id}`);
                                }}
                              >
                                <Edit className="h-4 w-4" />
                                <span className="sr-only">Edit</span>
                              </Button>
                              <Button
                                variant="ghost"
                                size="icon"
                                className="h-8 w-8 text-gray-500 hover:text-red-500"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleSoftDelete(scheme.id);
                                }}
                                disabled={isLoading || scheme.status === 'inactive'}
                              >
                                <Trash2 className="h-4 w-4" />
                                <span className="sr-only">Delete</span>
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </div>

              {/* Pagination - only show when there are results */}
              {filteredSchemes.length > 0 && (
                <Pagination>
                  <PaginationContent>
                    <PaginationItem>
                      <PaginationPrevious
                        href="#"
                        onClick={(e) => {
                          e.preventDefault();
                          if (currentPage > 1)
                            handlePageChange(currentPage - 1);
                        }}
                        className={
                          currentPage === 1
                            ? 'pointer-events-none opacity-50'
                            : ''
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
