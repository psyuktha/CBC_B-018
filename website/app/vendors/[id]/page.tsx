'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import axios from 'axios';
import { ArrowLeft, Menu, Bell, Phone, Mail, MapPin, Building2, CreditCard } from 'lucide-react';
import { Inter } from 'next/font/google';
import Image from 'next/image';
import { getGovernmentId } from '@/app/utils/auth';
import { Header } from '@/components/header';

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

export default function VendorDetailsPage() {
  const router = useRouter();
  const params = useParams();
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Get vendor ID from URL params
  const vendorId = params.id as string;

  // State for vendor
  const [vendor, setVendor] = useState<ApiVendor | null>(null);

  // Fetch vendor data when component mounts
  useEffect(() => {
    const fetchVendor = async () => {
      try {
        setIsLoading(true);
        const governmentId = getGovernmentId();
        const response = await axios.get<ApiVendor>(
          `${API_BASE_URL}/governments/${governmentId}/vendors/${vendorId}`,
          {
            headers: {
              'Content-Type': 'application/json',
              'Accept': 'application/json',
            },
            withCredentials: true
          }
        );

        setVendor(response.data);
        setError(null);
      } catch (err) {
        console.error('Error fetching vendor:', err);
        if (err instanceof Error && err.message.includes('User ID not found in cookies')) {
          router.push('/login');
        } else {
          setError('Failed to load vendor details');
        }
      } finally {
        setIsLoading(false);
      }
    };

    if (vendorId) {
      fetchVendor();
    } else {
      router.push('/vendors');
    }
  }, [vendorId, router]);

  if (isLoading && !vendor) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="h-12 w-12 animate-spin rounded-full border-b-2 border-t-2 border-blue-500"></div>
      </div>
    );
  }

  if (error && !vendor) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center gap-4 p-4">
        <div className="rounded-md border border-amber-200 bg-amber-50 p-4 text-amber-700">
          {error}
        </div>
        <Button onClick={() => router.push('/vendors')}>Back to Vendors</Button>
      </div>
    );
  }

  if (!vendor) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        Vendor not found
      </div>
    );
  }

  return (
    <div className={`${inter.className} flex min-h-screen bg-white`}>
      {/* Main content */}
      <div className="flex-1 transition-all duration-300">
        {/* Top navbar */}
        <Header isMobileOpen={isMobileOpen} setIsMobileOpen={setIsMobileOpen} />

        {/* Vendor details content */}
        <main className="p-4 sm:p-6">
          {/* Top section with navigation */}
          <div className="mb-6 flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
            <div className="flex items-center gap-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => router.push('/vendors')}
              >
                <ArrowLeft className="h-4 w-4" />
              </Button>
              <h1 className="text-2xl font-semibold">Vendor Details</h1>
            </div>
          </div>

          {/* Display any errors */}
          {error && (
            <div className="mb-4 rounded-md border border-amber-200 bg-amber-50 p-4 text-amber-700">
              {error}
            </div>
          )}

          {/* Vendor profile section */}
          <div className="mb-6 grid gap-6 md:grid-cols-3">
            {/* Profile card */}
            <Card className="md:col-span-1">
              <CardHeader>
                <div className="flex flex-col items-center gap-4">
                  <Image
                    src={vendor.account_info.image_url}
                    width={120}
                    height={120}
                    className="h-24 w-24 rounded-full object-cover"
                    alt={vendor.account_info.name}
                  />
                  <div className="text-center">
                    <CardTitle className="text-xl">{vendor.account_info.name}</CardTitle>
                    <CardDescription className="mt-1">
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
                    </CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center gap-2 text-sm text-gray-500">
                    <Mail className="h-4 w-4" />
                    <span>{vendor.account_info.email}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-500">
                    <Phone className="h-4 w-4" />
                    <span>{vendor.business_info.phone}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-500">
                    <MapPin className="h-4 w-4" />
                    <span>{vendor.business_info.address}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-500">
                    <Building2 className="h-4 w-4" />
                    <span>{vendor.business_info.occupation}</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Business and wallet info */}
            <div className="md:col-span-2 space-y-6">
              {/* Business info card */}
              <Card>
                <CardHeader>
                  <CardTitle>Business Information</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid gap-4 md:grid-cols-2">
                    <div className="space-y-2">
                      <Label>Business Name</Label>
                      <Input value={vendor.business_info.business_name} disabled />
                    </div>
                    <div className="space-y-2">
                      <Label>Business ID</Label>
                      <Input value={vendor.business_info.business_id} disabled />
                    </div>
                    <div className="space-y-2">
                      <Label>License Type</Label>
                      <Input
                        value={vendor.business_info.license_type.charAt(0).toUpperCase() +
                          vendor.business_info.license_type.slice(1)}
                        disabled
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Occupation</Label>
                      <Input value={vendor.business_info.occupation} disabled />
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Wallet info card */}
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle>Wallet Information</CardTitle>
                    <CreditCard className="h-5 w-5 text-gray-500" />
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label>Current Balance</Label>
                      <div className="text-2xl font-semibold">
                        ₹{vendor.wallet_info.balance.toLocaleString('en-IN')}
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label>Transaction History</Label>
                      <div className="rounded-md border p-4">
                        {vendor.wallet_info.transactions.length > 0 ? (
                          <div className="space-y-2">
                            {vendor.wallet_info.transactions.map((txId) => (
                              <div
                                key={txId}
                                className="flex items-center justify-between rounded-md bg-gray-50 p-2 text-sm"
                              >
                                <span className="font-medium">{txId}</span>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => router.push(`/transactions/${txId}`)}
                                >
                                  View
                                </Button>
                              </div>
                            ))}
                          </div>
                        ) : (
                          <div className="text-center text-sm text-gray-500">
                            No transactions found
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
} 