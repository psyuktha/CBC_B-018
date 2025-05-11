'use client';

import { useState, useEffect, use } from 'react';
import axios from 'axios';
import {
  Bell,
  Menu,
  ArrowLeft,
  Mail,
  Phone,
  MapPin,
  Calendar,
  User,
  Wallet,
  FileText,
  IndianRupee,
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
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';

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

interface Scheme {
  id: string;
  name: string;
  description: string;
  amount: number;
  status: string;
  created_at: string;
}

interface ApiCitizen {
  account_info: AccountInfo;
  personal_info: PersonalInfo;
  wallet_info: WalletInfo;
  scheme_info?: string[];
}

export default function BeneficiaryDetailsPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const resolvedParams = use(params);
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [beneficiary, setBeneficiary] = useState<ApiCitizen | null>(null);
  const [schemes, setSchemes] = useState<Scheme[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  // Fetch beneficiary details and their schemes from API
  useEffect(() => {
    const fetchBeneficiaryDetails = async () => {
      try {
        setIsLoading(true);
        const response = await axios.get(
          `${API_BASE_URL}/governments/${getGovernmentId()}/citizens/${resolvedParams.id}`,
          {
            headers: {
              'Content-Type': 'application/json',
              'Accept': 'application/json',
            },
            withCredentials: true
          }
        );
        setBeneficiary(response.data);
        setError(null);
      } catch (error) {
        console.error('Error fetching beneficiary details:', error);
        toast({
          variant: 'destructive',
          title: 'Error',
          description: 'Failed to fetch beneficiary details. Please try again.',
        });
        setError('Failed to load beneficiary details');
      } finally {
        setIsLoading(false);
      }
    };

    const fetchSchemes = async () => {
      try {
        const response = await axios.get(
          `${API_BASE_URL}/governments/${getGovernmentId()}/schemes`,
          {
            headers: {
              'Content-Type': 'application/json',
              'Accept': 'application/json',
            },
            withCredentials: true
          }
        );
        setSchemes(response.data);
      } catch (error) {
        console.error('Error fetching schemes:', error);
        toast({
          variant: 'destructive',
          title: 'Error',
          description: 'Failed to fetch schemes. Please try again.',
        });
      }
    };

    fetchBeneficiaryDetails();
    fetchSchemes();
  }, [resolvedParams.id]);

  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="h-12 w-12 animate-spin rounded-full border-b-2 border-t-2 border-blue-500"></div>
      </div>
    );
  }

  if (error || !beneficiary) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="text-center">
          <h2 className="mb-2 text-xl font-semibold text-gray-900">
            {error || 'Beneficiary not found'}
          </h2>
          <Button
            variant="outline"
            onClick={() => router.push('/beneficiaries')}
            className="mt-4"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Beneficiaries
          </Button>
        </div>
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

        {/* Beneficiary details content */}
        <main className="p-4 sm:p-6">
          {/* Back button and title */}
          <div className="mb-6 flex items-center gap-4">
            <Button
              variant="outline"
              onClick={() => router.push('/beneficiaries')}
              className="h-8"
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back
            </Button>
            <h1 className="text-2xl font-semibold">Beneficiary Details</h1>
          </div>

          {/* Main content grid */}
          <div className="grid gap-6 md:grid-cols-2">
            {/* Personal Information Card */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <User className="h-5 w-5" />
                  Personal Information
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-4">
                  <Image
                    src={beneficiary.account_info.image_url}
                    width={80}
                    height={80}
                    className="h-12 w-12 rounded-full object-cover"
                    alt={beneficiary.account_info.name}
                  />
                  <div>
                    <h3 className="text-lg font-semibold">
                      {beneficiary.account_info.name}
                    </h3>
                    <p className="text-sm text-gray-500">
                      {beneficiary.account_info.email}
                    </p>
                  </div>
                </div>
                <div className="mt-6 space-y-4">
                  <div className="flex items-center gap-2">
                    <Phone className="h-4 w-4 text-gray-500" />
                    <span>{beneficiary.personal_info.phone}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <MapPin className="h-4 w-4 text-gray-500" />
                    <span>{beneficiary.personal_info.address}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-gray-500" />
                    <span>
                      {new Date(beneficiary.personal_info.dob).toLocaleDateString()}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <FileText className="h-4 w-4 text-gray-500" />
                    <span>
                      {beneficiary.personal_info.id_type}:{' '}
                      {beneficiary.personal_info.id_number}
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Financial Information Card */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Wallet className="h-5 w-5" />
                  Financial Information
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div>
                    <h4 className="mb-2 text-sm font-medium text-gray-500">
                      Annual Income
                    </h4>
                    <div className="flex items-center gap-2">
                      <IndianRupee className="h-4 w-4 text-gray-500" />
                      <span className="text-lg font-semibold">
                        {beneficiary.personal_info.annual_income.toLocaleString(
                          'en-IN',
                        )}
                      </span>
                    </div>
                  </div>
                  <div>
                    <h4 className="mb-2 text-sm font-medium text-gray-500">
                      Government Wallet Balance
                    </h4>
                    <div className="flex items-center gap-2">
                      <IndianRupee className="h-4 w-4 text-gray-500" />
                      <span className="text-lg font-semibold">
                        {beneficiary.wallet_info.govt_wallet.balance.toLocaleString(
                          'en-IN',
                        )}
                      </span>
                    </div>
                  </div>
                  <div>
                    <h4 className="mb-2 text-sm font-medium text-gray-500">
                      Personal Wallet Balance
                    </h4>
                    <div className="flex items-center gap-2">
                      <IndianRupee className="h-4 w-4 text-gray-500" />
                      <span className="text-lg font-semibold">
                        {beneficiary.wallet_info.personal_wallet.balance.toLocaleString(
                          'en-IN',
                        )}
                      </span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Enrolled Schemes Card */}
            <Card className="md:col-span-2">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="h-5 w-5" />
                  Enrolled Schemes
                </CardTitle>
              </CardHeader>
              <CardContent>
                {schemes.length > 0 ? (
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Scheme Name</TableHead>
                        <TableHead>Enrollment Date</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Amount Received</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {schemes.map((scheme) => (
                        <TableRow key={scheme.id}>
                          <TableCell className="font-medium">
                            {scheme.name}
                          </TableCell>
                          <TableCell>
                            {new Date(scheme.created_at).toLocaleDateString('en-IN', {
                              day: 'numeric',
                              month: 'short',
                              year: 'numeric',
                            })}
                          </TableCell>
                          <TableCell>
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
                          <TableCell>
                            ₹{scheme.amount.toLocaleString('en-IN')}
                          </TableCell>
                          <TableCell className="text-right">
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-8 w-8 text-gray-500 hover:text-[#2563EB]"
                              onClick={() => router.push(`/schemes/${scheme.id}`)}
                            >
                              <Eye className="h-4 w-4" />
                              <span className="sr-only">View scheme details</span>
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                ) : (
                  <div className="text-center text-gray-500">
                    No schemes enrolled yet
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </main>
      </div>
    </div>
  );
} 