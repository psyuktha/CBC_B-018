'use client';

import { useState, useEffect } from 'react';
import {
  BarChart3,
  Bell,
  ChevronLeft,
  ChevronRight,
  CreditCard,
  Home,
  Menu,
  Search,
  Settings,
  Store,
  Users,
  X,
  Wallet,
} from 'lucide-react';
import { Inter } from 'next/font/google';
import Image from 'next/image';
import Link from 'next/link';
import axios from 'axios';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { Line, Pie } from 'react-chartjs-2';
import { motion } from 'framer-motion';
import { getGovernmentId } from '@/app/utils/auth';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Input } from '@/components/ui/input';
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

// Register ChartJS components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
);

const inter = Inter({ subsets: ['latin'] });
const API_BASE_URL = 'http://localhost:8000/api/v1';

interface Scheme {
  id: string;
  name: string;
  description: string;
  amount: number;
  status: string;
  tags: string[];
  beneficiaries: any[];
  created_at: string;
  updated_at: string;
}

interface Citizen {
  id: string;
  name: string;
  scheme_info: any[];
  // ... other citizen fields
}

interface DashboardStats {
  totalSchemes: number;
  totalBeneficiaries: number;
  totalFundAllocated: number;
  pendingApprovals: number;
  schemesByTag: {
    name: string;
    value: number;
    tags: string[];
  }[];
  monthlyData: {
    name: string;
    amount: number;
  }[];
}

export default function Dashboard() {
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [stats, setStats] = useState<DashboardStats>({
    totalSchemes: 0,
    totalBeneficiaries: 0,
    totalFundAllocated: 0,
    pendingApprovals: 0,
    schemesByTag: [],
    monthlyData: [],
  });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        // Fetch all schemes
        const { data: schemes } = await axios.get<Scheme[]>(`${API_BASE_URL}/governments/${getGovernmentId()}/schemes`);

        // Fetch all citizens
        const { data: citizens } = await axios.get<Citizen[]>(`${API_BASE_URL}/governments/${getGovernmentId()}/citizens`);

        // Calculate total schemes
        const totalSchemes = schemes.length;

        // Calculate total beneficiaries (citizens with at least one scheme)
        const totalBeneficiaries = citizens.filter(citizen => citizen.scheme_info && citizen.scheme_info.length > 0).length;

        // Calculate total fund allocated
        const totalFundAllocated = schemes.reduce((sum: number, scheme: Scheme) => 
          sum + (scheme.amount || 0), 0);

        // Calculate pending approvals (schemes with status 'pending')
        const pendingApprovals = schemes.filter((scheme: Scheme) => 
          scheme.status === 'pending').length;

        // Group schemes by tags
        const schemesByTag = schemes.reduce((acc: any[], scheme: Scheme) => {
          const tags = scheme.tags || [];
          tags.forEach((tag: string) => {
            const existingTag = acc.find(t => t.name === tag);
            if (existingTag) {
              existingTag.value += 1;
            } else {
              acc.push({
                name: tag,
                value: 1,
                tags: [tag]
              });
            }
          });
          return acc;
        }, []);

        // Generate monthly data (last 12 months)
        const monthlyData = Array.from({ length: 12 }, (_, i) => {
          const date = new Date();
          date.setMonth(date.getMonth() - i);
          return {
            name: date.toLocaleString('default', { month: 'short' }),
            amount: Math.floor(Math.random() * 1000) // This would be replaced with actual data
          };
        }).reverse();

        setStats({
          totalSchemes,
          totalBeneficiaries,
          totalFundAllocated,
          pendingApprovals,
          schemesByTag,
          monthlyData
        });
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  // Prepare data for charts
  const fundsLineData = {
    labels: stats.monthlyData.map((d) => d.name),
    datasets: [
      {
        label: 'Funds Distributed',
        data: stats.monthlyData.map((d) => d.amount),
        borderColor: '#2563EB',
        backgroundColor: '#93C5FD',
        borderWidth: 2,
        pointBackgroundColor: '#2563EB',
        pointRadius: 4,
        pointBorderWidth: 2,
        pointBorderColor: '#FFFFFF',
        tension: 0.3,
        fill: {
          target: 'origin',
          above: 'rgba(147, 197, 253, 0.2)',
        },
      },
    ],
  };

  const fundsLineOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
      tooltip: {
        callbacks: {
          label: (ctx: any) => `₹${ctx.raw} Cr`,
        },
        backgroundColor: '#fff',
        titleColor: '#222',
        bodyColor: '#2563EB',
        borderColor: '#A5D8FF',
        borderWidth: 1,
        padding: 12,
        usePointStyle: true,
      },
    },
    scales: {
      x: {
        grid: { display: false },
        ticks: { color: '#6B7280', font: { family: 'Inter', size: 13 } },
      },
      y: {
        grid: { color: '#F3F4F6' },
        ticks: {
          color: '#6B7280',
          font: { family: 'Inter', size: 13 },
          callback: function (this: any, tickValue: any) {
            return `₹${tickValue}Cr`;
          },
        },
      },
    },
  };

  // Donut chart data
  const donutChartData = {
    labels: stats.schemesByTag.map((s) => s.name),
    datasets: [
      {
        data: stats.schemesByTag.map((s) => s.value),
        backgroundColor: [
          '#FF6384',
          '#36A2EB',
          '#FFCE56',
          '#4BC0C0',
          '#9966FF',
          '#FF9F40',
        ],
        borderWidth: 0,
        hoverOffset: 8,
      },
    ],
  };

  const donutChartOptions = {
    cutout: '70%',
    plugins: {
      legend: { display: false },
      tooltip: {
        callbacks: {
          label: (ctx: any) => `${ctx.label}: ${ctx.raw} schemes`,
        },
        backgroundColor: '#fff',
        titleColor: '#222',
        bodyColor: '#2563EB',
        borderColor: '#FFD6A5',
        borderWidth: 1,
        padding: 12,
        usePointStyle: true,
      },
    },
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

        {/* Dashboard content */}
        <main className="p-4 sm:p-6">
          <div className="mb-6 flex items-center justify-between">
            <h1 className="text-2xl font-bold">Dashboard</h1>
            <Button className="bg-[#2563EB] hover:bg-[#1d4ed8]">
              Generate Report
            </Button>
          </div>
          {/* Stats cards */}
          <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-gray-500">
                  Total Schemes
                </CardTitle>
                <CreditCard className="h-4 w-4 text-gray-500" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.totalSchemes}</div>
                <p className="flex items-center text-xs text-green-500">
                  Active government schemes
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-gray-500">
                  Total Beneficiaries
                </CardTitle>
                <Users className="h-4 w-4 text-gray-500" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {stats.totalBeneficiaries.toLocaleString()}
                </div>
                <p className="flex items-center text-xs text-green-500">
                  Citizens enrolled in schemes
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-gray-500">
                  Total Fund Allocated
                </CardTitle>
                <Wallet className="h-4 w-4 text-gray-500" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  ₹{(stats.totalFundAllocated / 1000).toFixed(1)}K
                </div>
                <p className="flex items-center text-xs text-green-500">
                  Total funds distributed
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-gray-500">
                  Pending Approvals
                </CardTitle>
                <BarChart3 className="h-4 w-4 text-gray-500" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.pendingApprovals}</div>
                <p className="flex items-center text-xs text-red-500">
                  Schemes awaiting approval
                </p>
              </CardContent>
            </Card>
          </div>{' '}
          {/* Charts grid */}
          <div className="mb-6 grid gap-6 md:grid-cols-2">
            {/* Card 1: Monthly Funds Disbursed */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, ease: 'easeOut' }}
              whileHover={{
                boxShadow: '0 8px 32px 0 rgba(37,99,235,0.15)',
                scale: 1.02,
              }}
              className="relative rounded-2xl bg-white/60 p-6 shadow-lg backdrop-blur-md transition-all duration-300 hover:shadow-blue-200"
              style={{ minHeight: 370 }}
            >
              <div className="mb-2 flex items-center justify-between">
                <h2 className="text-lg font-semibold text-gray-800">
                  Monthly Funds Disbursed
                </h2>
              </div>
              <div className="flex h-[240px] w-full items-center">
                <Line data={fundsLineData} options={fundsLineOptions} />
              </div>
            </motion.div>

            {/* Card 2: Schemes by Category */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.9, ease: 'easeOut' }}
              whileHover={{
                boxShadow: '0 8px 32px 0 rgba(255,181,232,0.15)',
                scale: 1.02,
              }}
              className="relative rounded-2xl bg-white/60 p-6 shadow-lg backdrop-blur-md transition-all duration-300 hover:shadow-pink-200"
              style={{ minHeight: 370 }}
            >
              <div className="mb-2 flex items-center justify-between">
                <h2 className="text-lg font-semibold text-gray-800">
                  Schemes by Category
                </h2>
              </div>
              <div className="relative flex h-[240px] w-full items-center justify-center">
                <Pie data={donutChartData} options={donutChartOptions} />
                <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center">
                  <span className="mb-1 text-xs text-gray-500">
                    Total Categories
                  </span>
                  <span className="text-2xl font-bold text-gray-800">
                    {stats.schemesByTag.length}
                  </span>
                </div>
              </div>
            </motion.div>

            {/* Recent Activity */}
            <Card>
              <CardHeader>
                <CardTitle>Recent Activities</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-8">
                  {[...Array(3)].map((_, i) => (
                    <div key={i} className="flex">
                      <div className="mr-4 mt-0.5">
                        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-100 text-blue-600">
                          <BarChart3 className="h-4 w-4" />
                        </div>
                      </div>
                      <div>
                        <p className="text-sm font-medium">
                          New Scheme Created
                        </p>
                        <p className="text-sm text-gray-500">
                          Educational Support for Rural Girls
                        </p>
                        <p className="text-xs text-gray-400">2 hours ago</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Recent Transactions */}
            <Card>
              <CardHeader>
                <CardTitle>Recent Disbursements</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center">
                    <div className="mr-4">
                      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-green-100 text-green-600">
                        ₹
                      </div>
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-medium">
                        MGNREGA Fund Transfer
                      </p>
                      <p className="text-xs text-gray-500">
                        42,500 beneficiaries
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-medium">₹450 Cr</p>
                      <p className="text-xs text-gray-500">June 15, 2023</p>
                    </div>
                  </div>
                  <div className="flex items-center">
                    <div className="mr-4">
                      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-green-100 text-green-600">
                        ₹
                      </div>
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-medium">PM Kisan</p>
                      <p className="text-xs text-gray-500">
                        15,200 beneficiaries
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-medium">₹320 Cr</p>
                      <p className="text-xs text-gray-500">June 12, 2023</p>
                    </div>
                  </div>
                  <div className="flex items-center">
                    <div className="mr-4">
                      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-green-100 text-green-600">
                        ₹
                      </div>
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-medium">
                        Rural Housing Scheme
                      </p>
                      <p className="text-xs text-gray-500">
                        8,750 beneficiaries
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-medium">₹280 Cr</p>
                      <p className="text-xs text-gray-500">June 10, 2023</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </main>
      </div>
    </div>
  );
}
