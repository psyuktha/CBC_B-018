'use client';

import { useState, useRef } from 'react';
import {
  Bell,
  Download,
  Edit,
  Eye,
  Filter,
  Menu,
  Plus,
  Search,
  Trash2,
} from 'lucide-react';
import Image from 'next/image';
import { Inter } from 'next/font/google';

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
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from '@/components/ui/pagination';
import { Header } from '@/components/header';

const inter = Inter({ subsets: ['latin'] });

// Sample application data
const applications = [
  {
    id: 'APP-001',
    userId: 'USR-1234',
    userName: 'Rahul Sharma',
    scheme: 'PM Kisan Samman Nidhi',
    dateApplied: '2023-06-15',
    status: 'Approved',
  },
  {
    id: 'APP-002',
    userId: 'USR-2345',
    userName: 'Priya Patel',
    scheme: 'PM Awas Yojana',
    dateApplied: '2023-06-12',
    status: 'Pending',
  },
  {
    id: 'APP-003',
    userId: 'USR-3456',
    userName: 'Amit Kumar',
    scheme: 'PM Mudra Yojana',
    dateApplied: '2023-06-10',
    status: 'Rejected',
  },
  {
    id: 'APP-004',
    userId: 'USR-4567',
    userName: 'Sanjay Gupta',
    scheme: 'MGNREGA',
    dateApplied: '2023-06-08',
    status: 'Approved',
  },
  {
    id: 'APP-005',
    userId: 'USR-5678',
    userName: 'Neha Singh',
    scheme: 'PM Kisan Samman Nidhi',
    dateApplied: '2023-06-05',
    status: 'Approved',
  },
  {
    id: 'APP-006',
    userId: 'USR-6789',
    userName: 'Rajesh Verma',
    scheme: 'PM Jeevan Jyoti Bima Yojana',
    dateApplied: '2023-06-02',
    status: 'Pending',
  },
  {
    id: 'APP-007',
    userId: 'USR-7890',
    userName: 'Meena Kumari',
    scheme: 'PM Awas Yojana',
    dateApplied: '2023-05-29',
    status: 'Approved',
  },
  {
    id: 'APP-008',
    userId: 'USR-8901',
    userName: 'Suresh Reddy',
    scheme: 'PM Mudra Yojana',
    dateApplied: '2023-05-26',
    status: 'Rejected',
  },
  {
    id: 'APP-009',
    userId: 'USR-9012',
    userName: 'Pooja Mehta',
    scheme: 'MGNREGA',
    dateApplied: '2023-05-23',
    status: 'Approved',
  },
  {
    id: 'APP-010',
    userId: 'USR-0123',
    userName: 'Vijay Malhotra',
    scheme: 'PM Kisan Samman Nidhi',
    dateApplied: '2023-05-20',
    status: 'Pending',
  },
];

export default function Applications() {
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [statusFilter, setStatusFilter] = useState('all');
  const [schemeFilter, setSchemeFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const tableRef = useRef<HTMLTableElement>(null);

  const itemsPerPage = 5;

  // Filter applications based on status, scheme, and search query
  const filteredApplications = applications.filter((application) => {
    const matchesStatus =
      statusFilter === 'all' ||
      application.status.toLowerCase() === statusFilter.toLowerCase();
    const matchesScheme =
      schemeFilter === 'all' || application.scheme.includes(schemeFilter);
    const matchesSearch =
      searchQuery === '' ||
      application.userName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      application.userId.toLowerCase().includes(searchQuery.toLowerCase()) ||
      application.id.toLowerCase().includes(searchQuery.toLowerCase());

    return matchesStatus && matchesScheme && matchesSearch;
  });

  // Calculate total pages
  const totalPages = Math.ceil(filteredApplications.length / itemsPerPage);

  // Get current page applications
  const currentApplications = filteredApplications.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage,
  );

  // Handle page change
  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    if (tableRef.current) {
      tableRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  };

  // Generate page numbers for pagination
  const getPageNumbers = () => {
    const pages = [];

    if (totalPages <= 5) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      if (currentPage <= 3) {
        pages.push(1, 2, 3, 4, '...', totalPages);
      } else if (currentPage >= totalPages - 2) {
        pages.push(
          1,
          '...',
          totalPages - 3,
          totalPages - 2,
          totalPages - 1,
          totalPages,
        );
      } else {
        pages.push(
          1,
          '...',
          currentPage - 1,
          currentPage,
          currentPage + 1,
          '...',
          totalPages,
        );
      }
    }

    return pages;
  };

  // Get unique schemes for filter
  const schemes = Array.from(new Set(applications.map((app) => app.scheme)));

  return (
    <div className={`${inter.className} flex min-h-screen bg-white`}>
      <div className="flex-1 transition-all duration-300">
        <Header isMobileOpen={isMobileOpen} setIsMobileOpen={setIsMobileOpen} />

        {/* Applications content */}
        <main className="p-4 sm:p-6">
          {/* Top section with heading and buttons */}
          <div className="mb-6 flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
            <h1 className="text-2xl font-semibold">Applications</h1>
            <div className="flex flex-wrap gap-2">
              <Button className="bg-[#2563EB] hover:bg-[#1d4ed8]">
                <Plus className="mr-2 h-4 w-4" /> New Application
              </Button>
              <Button
                variant="outline"
                className="border-gray-300 text-gray-700"
              >
                <Download className="mr-2 h-4 w-4" /> Export
              </Button>
            </div>
          </div>

          {/* Search and filter section */}
          <div className="mb-6 flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
            <div className="flex flex-wrap items-center gap-2">
              <Filter className="h-4 w-4 text-gray-500" />
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-[140px] border-gray-200 bg-gray-50">
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Statuses</SelectItem>
                  <SelectItem value="approved">Approved</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="rejected">Rejected</SelectItem>
                </SelectContent>
              </Select>

              <Select value={schemeFilter} onValueChange={setSchemeFilter}>
                <SelectTrigger className="w-[180px] border-gray-200 bg-gray-50">
                  <SelectValue placeholder="Scheme" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Schemes</SelectItem>
                  {schemes.map((scheme) => (
                    <SelectItem key={scheme} value={scheme}>
                      {scheme}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="relative w-full sm:w-auto">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
              <Input
                type="search"
                placeholder="Search applications..."
                className="w-full border-gray-200 bg-gray-50 pl-8 sm:w-[300px]"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>

          {/* Applications table */}
          <div className="mb-6 overflow-hidden rounded-lg border shadow-sm">
            <Table ref={tableRef}>
              <TableHeader className="bg-[#F5F5F5]">
                <TableRow>
                  <TableHead className="text-xs font-semibold uppercase">
                    ID
                  </TableHead>
                  <TableHead className="text-xs font-semibold uppercase">
                    User
                  </TableHead>
                  <TableHead className="text-xs font-semibold uppercase">
                    Scheme
                  </TableHead>
                  <TableHead className="text-xs font-semibold uppercase">
                    Date Applied
                  </TableHead>
                  <TableHead className="text-xs font-semibold uppercase">
                    Status
                  </TableHead>
                  {/*<TableHead className="text-right text-xs font-semibold uppercase">*/}
                  {/*  Actions*/}
                  {/*</TableHead>*/}
                </TableRow>
              </TableHeader>
              <TableBody>
                {currentApplications.map((application) => (
                  <TableRow
                    key={application.id}
                    className="transition-colors hover:bg-[#EEEEEE]"
                  >
                    <TableCell className="py-4 font-medium">
                      {application.id}
                    </TableCell>
                    <TableCell className="py-4">
                      <div>
                        <div className="font-medium">
                          {application.userName}
                        </div>
                        <div className="text-sm text-gray-500">
                          {application.userId}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className="py-4">{application.scheme}</TableCell>
                    <TableCell className="py-4">
                      {new Date(application.dateApplied).toLocaleDateString()}
                    </TableCell>
                    <TableCell className="py-4">
                      <Badge
                        variant="outline"
                        className={`${
                          application.status === 'Approved'
                            ? 'border-green-200 bg-green-50 text-green-700'
                            : application.status === 'Pending'
                              ? 'border-yellow-200 bg-yellow-50 text-yellow-700'
                              : 'border-red-200 bg-red-50 text-red-700'
                        }`}
                      >
                        {application.status}
                      </Badge>
                    </TableCell>
                    {/*<TableCell className="py-4 text-right">*/}
                    {/*  <div className="flex justify-end gap-2">*/}
                    {/*    <Button*/}
                    {/*      variant="ghost"*/}
                    {/*      size="icon"*/}
                    {/*      className="h-8 w-8 text-gray-500 hover:text-[#2563EB]"*/}
                    {/*    >*/}
                    {/*      <Eye className="h-4 w-4" />*/}
                    {/*      <span className="sr-only">View</span>*/}
                    {/*    </Button>*/}
                    {/*    <Button*/}
                    {/*      variant="ghost"*/}
                    {/*      size="icon"*/}
                    {/*      className="h-8 w-8 text-gray-500 hover:text-[#2563EB]"*/}
                    {/*    >*/}
                    {/*      <Edit className="h-4 w-4" />*/}
                    {/*      <span className="sr-only">Edit</span>*/}
                    {/*    </Button>*/}
                    {/*    <Button*/}
                    {/*      variant="ghost"*/}
                    {/*      size="icon"*/}
                    {/*      className="h-8 w-8 text-gray-500 hover:text-red-500"*/}
                    {/*    >*/}
                    {/*      <Trash2 className="h-4 w-4" />*/}
                    {/*      <span className="sr-only">Delete</span>*/}
                    {/*    </Button>*/}
                    {/*  </div>*/}
                    {/*</TableCell>*/}
                  </TableRow>
                ))}
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
