'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import axios from 'axios';
import { ArrowLeft, Menu, Bell } from 'lucide-react';
import { Inter } from 'next/font/google';
import Image from 'next/image';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
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

const inter = Inter({ subsets: ['latin'] });

// Constants
const GOVERNMENT_ID = '1b7854b9-783b-49d8-b8b3-d4e1e17106c0';
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

export default function TransactionDetailsPage() {
  const router = useRouter();
  const params = useParams();
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Get transaction ID from URL params
  const transactionId = params.id as string;

  // State for transaction
  const [transaction, setTransaction] = useState<ApiTransaction | null>(null);

  // Fetch transaction data when component mounts
  useEffect(() => {
    const fetchTransaction = async () => {
      try {
        setIsLoading(true);
        const response = await axios.get<ApiTransaction>(
          `${API_BASE_URL}/governments/${GOVERNMENT_ID}/transactions/${transactionId}`,
        );

        setTransaction(response.data);
        setError(null);
      } catch (err) {
        console.error('Error fetching transaction:', err);
        setError('Failed to load transaction details');
      } finally {
        setIsLoading(false);
      }
    };

    if (transactionId) {
      fetchTransaction();
    } else {
      router.push('/transactions');
    }
  }, [transactionId, router]);

  if (isLoading && !transaction) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="h-12 w-12 animate-spin rounded-full border-b-2 border-t-2 border-blue-500"></div>
      </div>
    );
  }

  if (error && !transaction) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center gap-4 p-4">
        <div className="rounded-md border border-amber-200 bg-amber-50 p-4 text-amber-700">
          {error}
        </div>
        <Button onClick={() => router.push('/transactions')}>Back to Transactions</Button>
      </div>
    );
  }

  if (!transaction) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        Transaction not found
      </div>
    );
  }

  return (
    <div className={`${inter.className} flex min-h-screen bg-white`}>
      {/* Main content */}
      <div className="flex-1 transition-all duration-300">
        {/* Top navbar */}
        <header className="sticky top-0 z-10 flex h-14 items-center gap-4 border-b bg-white px-4 sm:px-6">
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
                    src="/placeholder.svg?height=32&width=32"
                    width={32}
                    height={32}
                    className="rounded-full"
                    alt="Admin avatar"
                  />
                  <span className="sr-only">Toggle user menu</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuLabel>My Account</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem>Profile</DropdownMenuItem>
                <DropdownMenuItem>Settings</DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem>Logout</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </header>

        {/* Transaction details content */}
        <main className="p-4 sm:p-6">
          {/* Top section with navigation */}
          <div className="mb-6 flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
            <div className="flex items-center gap-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => router.push('/transactions')}
              >
                <ArrowLeft className="h-4 w-4" />
              </Button>
              <h1 className="text-2xl font-semibold">Transaction Details</h1>
            </div>
          </div>

          {/* Display any errors */}
          {error && (
            <div className="mb-4 rounded-md border border-amber-200 bg-amber-50 p-4 text-amber-700">
              {error}
            </div>
          )}

          {/* Transaction details card */}
          <Card className={`mb-6 ${transaction.status === 'failed' ? 'opacity-75' : ''}`}>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-xl">{transaction.description}</CardTitle>
                  <CardDescription>
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
                  </CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                {/* Left column */}
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="id">Transaction ID</Label>
                    <Input id="id" value={transaction.id} disabled />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="type">Transaction Type</Label>
                    <Input
                      id="type"
                      value={transaction.tx_type.split('-').map(word => 
                        word.charAt(0).toUpperCase() + word.slice(1)
                      ).join(' ')}
                      disabled
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="amount">Amount</Label>
                    <Input
                      id="amount"
                      value={`₹${transaction.amount.toLocaleString('en-IN')}`}
                      disabled
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="timestamp">Date & Time</Label>
                    <Input
                      id="timestamp"
                      value={new Date(transaction.timestamp).toLocaleString('en-IN', {
                        day: 'numeric',
                        month: 'short',
                        year: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                      disabled
                    />
                  </div>
                </div>

                {/* Right column */}
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="from_id">From ID</Label>
                    <Input id="from_id" value={transaction.from_id} disabled />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="to_id">To ID</Label>
                    <Input id="to_id" value={transaction.to_id} disabled />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="scheme_id">Scheme ID</Label>
                    <Input
                      id="scheme_id"
                      value={transaction.scheme_id || 'N/A'}
                      disabled
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="description">Description</Label>
                    <Input id="description" value={transaction.description} disabled />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </main>
      </div>
    </div>
  );
} 