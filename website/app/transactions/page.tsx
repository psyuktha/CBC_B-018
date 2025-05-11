'use client';

import { useState, useEffect } from 'react';
import {
  BarChart3,
  Bell,
  ChevronLeft,
  ChevronRight,
  CreditCard,
  Filter,
  Home,
  Menu,
  Search,
  Settings,
  Store,
  Users,
  X,
  Eye,
} from 'lucide-react';
import { Inter } from 'next/font/google';
import Image from 'next/image';
import Link from 'next/link';
import axios from 'axios';
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
import { Sheet, SheetContent } from '@/components/ui/sheet';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Sidebar } from '@/components/sidebar';
import { Header } from '@/components/header';

const inter = Inter({ subsets: ['latin'] });

// Constants
const API_BASE_URL = 'http://localhost:8000/api/v1';

// Define types for our API response
interface ApiTransaction {
  id: string;
  from_id: string;
  to_id: string;
  amount: number;
  tx_type: 'citizen-to-vendor' | 'government-to-citizen';
  scheme_id: string | null;
  description: string;
  timestamp: string;
  status: 'completed' | 'pending' | 'failed';
}

// Define types for our transformed transaction data
interface TransformedTransaction {
  id: string;
  fromId: string;
  toId: string;
  amount: number;
  type: string;
  schemeId: string | null;
  description: string;
  date: string;
  status: string;
}

export default function TransactionsPage() {
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [regionFilter, setRegionFilter] = useState('all');
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [statusFilter, setStatusFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [transactions, setTransactions] = useState<TransformedTransaction[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const itemsPerPage = 10;
  const router = useRouter();

  // Fetch transactions from API
  const fetchTransactions = async () => {
    try {
      setIsLoading(true);
      const response = await axios.get<ApiTransaction[]>(
        `${API_BASE_URL}/governments/${getGovernmentId()}/transactions`,
        {
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
          },
          withCredentials: true
        }
      );

      // Transform API data to match component structure
      const transformedTransactions = response.data.map((transaction) => ({
        id: transaction.id,
        fromId: transaction.from_id,
        toId: transaction.to_id,
        amount: transaction.amount,
        type: transaction.tx_type,
        schemeId: transaction.scheme_id,
        description: transaction.description,
        date: new Date(transaction.timestamp).toLocaleDateString('en-IN', {
          day: 'numeric',
          month: 'short',
          year: 'numeric',
        }),
        status: transaction.status,
      }));

      setTransactions(transformedTransactions);
      setError(null);
    } catch (error) {
      console.error('Error fetching transactions:', error);
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Failed to fetch transactions. Please try again.',
      });
      setError('Failed to load transactions');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchTransactions();
  }, []);

  // Filter transactions based on status and search query
  const filteredTransactions = transactions
    .filter(
      (transaction) =>
        statusFilter === 'all' ||
        transaction.status.toLowerCase() === statusFilter.toLowerCase(),
    )
    .filter((transaction) => {
      if (!searchQuery) return true;

      const query = searchQuery.toLowerCase();
      return (
        transaction.description.toLowerCase().includes(query) ||
        transaction.type.toLowerCase().includes(query) ||
        transaction.id.toLowerCase().includes(query)
      );
    });

  // Calculate pagination
  const totalPages = Math.ceil(filteredTransactions.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentTransactions = filteredTransactions.slice(startIndex, endIndex);

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

  // Get unique transaction types for filter
  const transactionTypes = [
    'all',
    ...new Set(transactions.map((transaction) => transaction.type)),
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
      <div className="flex-1 transition-all duration-300">
        <Header isMobileOpen={isMobileOpen} setIsMobileOpen={setIsMobileOpen} />

        <main className="p-4 sm:p-6">
          {/* Top section with heading */}
          <div className="mb-6 flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
            <h1 className="text-2xl font-semibold">Transactions</h1>
            {/* No buttons for transactions page as it's read-only */}
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
                  <SelectItem value="completed">Completed</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="failed">Failed</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="relative w-full sm:w-auto">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
              <Input
                type="search"
                placeholder="Search Transactions..."
                className="w-full border-gray-200 bg-gray-50 pl-8 sm:w-[300px]"
              />
            </div>
          </div>

          {/* Transactions table */}
          <div className="mb-6 overflow-hidden rounded-lg border shadow-sm">
            <Table>
              <TableHeader className="bg-[#F5F5F5]">
                <TableRow>
                  <TableHead className="text-xs font-semibold uppercase">
                    Transaction ID
                  </TableHead>
                  <TableHead className="text-xs font-semibold uppercase">
                    Description
                  </TableHead>
                  <TableHead className="text-xs font-semibold uppercase">
                    Type
                  </TableHead>
                  <TableHead className="text-xs font-semibold uppercase">
                    Amount
                  </TableHead>
                  <TableHead className="text-xs font-semibold uppercase">
                    Date
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
                {filteredTransactions.length === 0 ? (
                  <TableRow>
                    <TableCell
                      colSpan={7}
                      className="py-8 text-center text-gray-500"
                    >
                      No transactions found
                      {searchQuery ? ` matching "${searchQuery}"` : ''}
                    </TableCell>
                  </TableRow>
                ) : (
                  currentTransactions.map((transaction) => (
                  <TableRow
                    key={transaction.id}
                      className={`cursor-pointer transition-colors hover:bg-[#EEEEEE] ${
                        transaction.status === 'failed' ? 'opacity-75' : ''
                      }`}
                  >
                    <TableCell className="py-4 font-medium">
                      {transaction.id}
                    </TableCell>
                    <TableCell className="py-4">
                        {transaction.description}
                      </TableCell>
                      <TableCell className="py-4">
                        {transaction.type.split('-').map(word => 
                          word.charAt(0).toUpperCase() + word.slice(1)
                        ).join(' ')}
                      </TableCell>
                      <TableCell className="py-4">
                        ₹{transaction.amount.toLocaleString('en-IN')}
                    </TableCell>
                    <TableCell className="py-4">
                        {transaction.date}
                    </TableCell>
                    <TableCell className="py-4">
                        <Badge
                          variant="outline"
                          className={`${
                            transaction.status === 'completed'
                              ? 'border-green-200 bg-green-50 text-green-700'
                              : transaction.status === 'pending'
                              ? 'border-yellow-200 bg-yellow-50 text-yellow-700'
                              : 'border-red-200 bg-red-50 text-red-700'
                          }`}
                        >
                          {transaction.status.charAt(0).toUpperCase() +
                            transaction.status.slice(1)}
                      </Badge>
                    </TableCell>
                      <TableCell className="py-4 text-right">
                        <div className="flex justify-end gap-2">
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 text-gray-500 hover:text-[#2563EB]"
                            onClick={() => router.push(`/transactions/${transaction.id}`)}
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
        </main>
      </div>
    </div>
  );
}
