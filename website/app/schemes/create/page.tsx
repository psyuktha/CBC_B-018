'use client';

import { useState, FormEvent, ChangeEvent } from 'react';
import { useRouter } from 'next/navigation';
import axios from 'axios';
import { ArrowLeft, Menu, Plus, Bell } from 'lucide-react';
import { Inter } from 'next/font/google';
import Image from 'next/image';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';

const inter = Inter({ subsets: ['latin'] });

// Constants
const GOVERNMENT_ID = '18278f37-44dd-4ec3-9459-d22961c0ee33';
const API_BASE_URL = 'http://localhost:8000/api/v1';

interface SchemeResponse {
  message: string;
  scheme_id: string;
}

export default function CreateSchemePage() {
  const router = useRouter();
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // State for scheme form
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    amount: 0,
    status: 'active',
    eligibility: {
      occupation: null as string | null,
      min_age: null as number | null,
      max_age: null as number | null,
      gender: null as string | null,
      state: null as string | null,
      district: null as string | null,
      city: null as string | null,
      caste: null as string | null,
      annual_income: null as number | null,
      tags: [] as string[],
    },
  });

  // Handle form field changes
  const handleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: name === 'amount' ? Number(value) : value,
    });
  };

  // Handle eligibility field changes
  const handleEligibilityChange = (
    field: keyof typeof formData.eligibility,
    value: string | number | null | string[],
  ) => {
    setFormData({
      ...formData,
      eligibility: {
        ...formData.eligibility,
        [field]: value,
      },
    });
  };

  // Handle tag changes
  const handleTagChange = (tag: string) => {
    const currentTags = formData.eligibility.tags || [];
    const updatedTags = currentTags.includes(tag)
      ? currentTags.filter((t) => t !== tag)
      : [...currentTags, tag];

    handleEligibilityChange('tags', updatedTags);
  };

  // Handle form submission
  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    if (!formData.name || !formData.description) {
      setError('Scheme name and description are required');
      return;
    }

    try {
      setIsLoading(true);
      setError(null);

      // Transform form data to API format
      const schemePayload = {
        name: formData.name,
        description: formData.description,
        amount: formData.amount,
        status: formData.status,
        eligibility_criteria: {
          occupation: formData.eligibility.occupation,
          min_age: formData.eligibility.min_age,
          max_age: formData.eligibility.max_age,
          gender: formData.eligibility.gender,
          state: formData.eligibility.state,
          district: formData.eligibility.district,
          city: formData.eligibility.city,
          caste: formData.eligibility.caste,
          annual_income: formData.eligibility.annual_income,
        },
        tags: formData.eligibility.tags,
      };

      // Make API call to create the scheme
      const response = await axios.post<SchemeResponse>(
        `${API_BASE_URL}/governments/${GOVERNMENT_ID}/schemes`,
        schemePayload,
      );

      if (response.data.scheme_id) {
        // Redirect to schemes page on success
        router.push('/schemes');
      } else {
        throw new Error('Invalid response from server');
      }
    } catch (err) {
      console.error('Error creating scheme:', err);
      setError('Failed to create scheme. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  // Common tags for schemes
  const commonTags = [
    'food',
    'essentials',
    'subsidy',
    'poverty',
    'agriculture',
    'rural',
    'employment',
    'youth',
    'skills',
    'training',
    'digital',
    'literacy',
    'technology',
    'startups',
    'business',
    'entrepreneurs',
    'health',
    'insurance',
    'medical',
    'education',
    'women',
    'children',
  ];

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

        {/* Create scheme content */}
        <main className="p-4 sm:p-6">
          {/* Top section with navigation */}
          <div className="mb-6 flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
            <div className="flex items-center gap-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => router.push('/schemes')}
              >
                <ArrowLeft className="h-4 w-4" />
              </Button>
              <h1 className="text-2xl font-semibold">Create New Scheme</h1>
            </div>
          </div>

          {/* Display any errors */}
          {error && (
            <div className="mb-4 rounded-md border border-amber-200 bg-amber-50 p-4 text-amber-700">
              {error}
            </div>
          )}

          {/* Scheme creation card */}
          <Card className="mb-6">
            <CardHeader>
              <CardTitle className="text-xl">Scheme Information</CardTitle>
              <CardDescription>
                Create a new government scheme for citizens
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                  {/* Left column */}
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="name">Scheme Name *</Label>
                      <Input
                        id="name"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="description">Description *</Label>
                      <Textarea
                        id="description"
                        name="description"
                        value={formData.description}
                        onChange={handleChange}
                        className="min-h-[100px]"
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="amount">Amount (₹) *</Label>
                      <Input
                        id="amount"
                        name="amount"
                        type="number"
                        value={formData.amount}
                        onChange={handleChange}
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="status">Status *</Label>
                      <Select
                        value={formData.status}
                        onValueChange={(value) =>
                          setFormData({ ...formData, status: value })
                        }
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select status" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="active">Active</SelectItem>
                          <SelectItem value="inactive">Inactive</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  {/* Right column - Eligibility */}
                  <div className="space-y-6">
                    <div>
                      <h3 className="mb-4 text-lg font-medium">
                        Eligibility Criteria
                      </h3>

                      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                        <div className="space-y-2">
                          <Label htmlFor="eligibility-occupation">Occupation</Label>
                          <Input
                            id="eligibility-occupation"
                            value={formData.eligibility.occupation || ''}
                            onChange={(e) =>
                              handleEligibilityChange('occupation', e.target.value || null)
                            }
                          />
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="eligibility-min_age">Minimum Age</Label>
                          <Input
                            id="eligibility-min_age"
                            type="number"
                            value={formData.eligibility.min_age || ''}
                            onChange={(e) =>
                              handleEligibilityChange('min_age', e.target.value ? Number(e.target.value) : null)
                            }
                          />
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="eligibility-max_age">Maximum Age</Label>
                          <Input
                            id="eligibility-max_age"
                            type="number"
                            value={formData.eligibility.max_age || ''}
                            onChange={(e) =>
                              handleEligibilityChange('max_age', e.target.value ? Number(e.target.value) : null)
                            }
                          />
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="eligibility-annual_income">Annual Income (₹)</Label>
                          <Input
                            id="eligibility-annual_income"
                            type="number"
                            value={formData.eligibility.annual_income || ''}
                            onChange={(e) =>
                              handleEligibilityChange('annual_income', e.target.value ? Number(e.target.value) : null)
                            }
                          />
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="eligibility-gender">Gender</Label>
                          <Select
                            value={formData.eligibility.gender || ''}
                            onValueChange={(value) =>
                              handleEligibilityChange('gender', value)
                            }
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="Select gender" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="Any">Any</SelectItem>
                              <SelectItem value="Male">Male</SelectItem>
                              <SelectItem value="Female">Female</SelectItem>
                              <SelectItem value="Other">Other</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="eligibility-state">State</Label>
                          <Input
                            id="eligibility-state"
                            value={formData.eligibility.state || ''}
                            onChange={(e) =>
                              handleEligibilityChange('state', e.target.value || null)
                            }
                            placeholder="e.g. Karnataka"
                          />
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="eligibility-district">District</Label>
                          <Input
                            id="eligibility-district"
                            value={formData.eligibility.district || ''}
                            onChange={(e) =>
                              handleEligibilityChange('district', e.target.value || null)
                            }
                            placeholder="e.g. Bangalore Urban"
                          />
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="eligibility-city">City</Label>
                          <Input
                            id="eligibility-city"
                            value={formData.eligibility.city || ''}
                            onChange={(e) =>
                              handleEligibilityChange('city', e.target.value || null)
                            }
                            placeholder="e.g. Bangalore"
                          />
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="eligibility-caste">Caste</Label>
                          <Input
                            id="eligibility-caste"
                            value={formData.eligibility.caste || ''}
                            onChange={(e) =>
                              handleEligibilityChange('caste', e.target.value || null)
                            }
                            placeholder="e.g. SC/ST/OBC"
                          />
                        </div>
                      </div>

                      {/* Tags */}
                      <div className="mt-6">
                        <Label>Tags (select all that apply)</Label>
                        <div className="mt-2 flex flex-wrap gap-2">
                          {commonTags.map((tag) => (
                            <div
                              key={tag}
                              className="flex items-center space-x-2"
                            >
                              <Checkbox
                                id={`tag-${tag}`}
                                checked={formData.eligibility.tags.includes(
                                  tag,
                                )}
                                onCheckedChange={() => handleTagChange(tag)}
                              />
                              <label
                                htmlFor={`tag-${tag}`}
                                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                              >
                                {tag}
                              </label>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </form>
            </CardContent>
            <CardFooter className="flex justify-between border-t p-4">
              <Button variant="outline" onClick={() => router.push('/schemes')}>
                Cancel
              </Button>
              <Button
                className="bg-[#2563EB] hover:bg-[#1d4ed8]"
                onClick={handleSubmit}
                disabled={isLoading}
              >
                {isLoading ? (
                  <div className="h-4 w-4 animate-spin rounded-full border-b-2 border-t-2 border-white"></div>
                ) : (
                  <>
                    <Plus className="mr-2 h-4 w-4" /> Create Scheme
                  </>
                )}
              </Button>
            </CardFooter>
          </Card>
        </main>
      </div>
    </div>
  );
}
