'use client';

import { useState, useEffect, ChangeEvent, FormEvent } from 'react';
import { useParams, useRouter } from 'next/navigation';
import axios from 'axios';
import { ArrowLeft, Menu, Save, Bell, Trash2 } from 'lucide-react';
import { Inter } from 'next/font/google';
import Image from 'next/image';
import { useToast } from "@/components/ui/use-toast";
import { Header } from '@/components/header';
import { getGovernmentId } from '@/app/utils/auth';

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
import { Sheet, SheetContent } from '@/components/ui/sheet';
import { Textarea } from '@/components/ui/textarea';

const inter = Inter({ subsets: ['latin'] });

// Constants
const API_BASE_URL = 'http://localhost:8000/api/v1';

// Define types for our scheme data
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

interface SchemeResponse {
  message: string;
  scheme_id: string;
}

interface ApiScheme {
  id: string;
  name: string;
  description: string;
  amount: number;
  status: string;
  govt_id: string;
  created_at: string;
  updated_at: string;
  eligibility_criteria: {
    occupation: string | null;
    min_age: number | null;
    max_age: number | null;
    gender: string | null;
    state: string | null;
    district: string | null;
    city: string | null;
    caste: string | null;
    annual_income: number | null;
  };
  tags: string[];
}

interface FormDataType {
  name: string;
  description: string;
  amount: number;
  status: string;
  eligibility: {
    occupation: string | null;
    min_age: number | null;
    max_age: number | null;
    gender: string | null;
    state: string | null;
    district: string | null;
    city: string | null;
    caste: string | null;
    annual_income: number | null;
    tags: string[];
  };
}

export default function SchemeDetailsPage() {
  const router = useRouter();
  const params = useParams();
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  // Get scheme ID from URL params
  const schemeId = params.id as string;

  // State for API scheme
  const [scheme, setScheme] = useState<ApiScheme | null>(null);
  const [formData, setFormData] = useState<FormDataType>({
    name: '',
    description: '',
    amount: 0,
    status: 'active',
    eligibility: {
      occupation: null,
      min_age: null,
      max_age: null,
      gender: null,
      state: null,
      district: null,
      city: null,
      caste: null,
      annual_income: null,
      tags: [],
    },
  });

  // Fetch scheme data when component mounts
  useEffect(() => {
    const fetchScheme = async () => {
      try {
        setIsLoading(true);
        const governmentId = getGovernmentId();
        const response = await axios.get<ApiScheme>(
          `${API_BASE_URL}/governments/${governmentId}/schemes/${schemeId}`,
          {
            headers: {
              'Content-Type': 'application/json',
              'Accept': 'application/json',
            },
            withCredentials: true
          }
        );

        const fetchedScheme = response.data;
        setScheme(fetchedScheme);

        setFormData({
          name: fetchedScheme.name,
          description: fetchedScheme.description,
          amount: fetchedScheme.amount,
          status: fetchedScheme.status,
          eligibility: {
            occupation: fetchedScheme.eligibility_criteria?.occupation || null,
            min_age: fetchedScheme.eligibility_criteria?.min_age || null,
            max_age: fetchedScheme.eligibility_criteria?.max_age || null,
            gender: fetchedScheme.eligibility_criteria?.gender || null,
            state: fetchedScheme.eligibility_criteria?.state || null,
            district: fetchedScheme.eligibility_criteria?.district || null,
            city: fetchedScheme.eligibility_criteria?.city || null,
            caste: fetchedScheme.eligibility_criteria?.caste || null,
            annual_income: fetchedScheme.eligibility_criteria?.annual_income || null,
            tags: fetchedScheme.tags || [],
          },
        });

        setError(null);
      } catch (err) {
        console.error('Error fetching scheme:', err);
        if (err instanceof Error && err.message.includes('User ID not found in cookies')) {
          router.push('/login');
        } else {
          setError('Failed to load scheme details');
        }
      } finally {
        setIsLoading(false);
      }
    };

    if (schemeId) {
      fetchScheme();
    } else {
      router.push('/schemes');
    }
  }, [schemeId, router]);

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
    field: keyof FormDataType['eligibility'],
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

    try {
      setIsLoading(true);

      // Transform the data back to API format
      const updatePayload = {
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

      // Make API call to update the scheme
      const governmentId = getGovernmentId();
      await axios.put(
        `${API_BASE_URL}/governments/${governmentId}/schemes/${schemeId}`,
        updatePayload,
        {
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
          },
          withCredentials: true
        }
      );

      if (scheme) {
        // Update local state with the updated data
        setScheme({
          ...scheme,
          name: formData.name,
          description: formData.description,
          amount: formData.amount,
          status: formData.status,
          eligibility_criteria: updatePayload.eligibility_criteria,
          tags: formData.eligibility.tags,
        });
      }

      setIsEditing(false);
      setError(null);
      toast({
        title: "Success",
        description: "Scheme updated successfully",
      });
    } catch (err) {
      console.error('Error updating scheme:', err);
      if (err instanceof Error && err.message.includes('User ID not found in cookies')) {
        router.push('/login');
      } else {
        toast({
          variant: "destructive",
          title: "Error",
          description: "Failed to update scheme",
        });
      }
    } finally {
      setIsLoading(false);
    }
  };

  // Handle soft delete
  const handleSoftDelete = async () => {
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

      if (response.data.scheme_id && scheme) {
        // Update local state to reflect the deletion
        const updatedScheme: ApiScheme = {
          ...scheme,
          status: 'inactive'
        };
        setScheme(updatedScheme);
        toast({
          title: "Success",
          description: "Scheme has been soft deleted",
        });
        router.push('/schemes');
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

  // Common tags for schemes
  const commonTags: string[] = [
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

  if (isLoading && !scheme) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="h-12 w-12 animate-spin rounded-full border-b-2 border-t-2 border-blue-500"></div>
      </div>
    );
  }

  if (error && !scheme) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center gap-4 p-4">
        <div className="rounded-md border border-amber-200 bg-amber-50 p-4 text-amber-700">
          {error}
        </div>
        <Button onClick={() => router.push('/schemes')}>Back to Schemes</Button>
      </div>
    );
  }

  if (!scheme) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        Scheme not found
      </div>
    );
  }

  return (
    <div className={`${inter.className} flex min-h-screen bg-white`}>
      {/* Main content */}
      <div className={`flex-1 transition-all duration-300`}>
        {/* Top navbar */}
        <Header isMobileOpen={isMobileOpen} setIsMobileOpen={setIsMobileOpen} />

        {/* Scheme details content */}
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
              <h1 className="text-2xl font-semibold">
                {isEditing ? 'Edit Scheme' : 'Scheme Details'}
              </h1>
            </div>
            <div className="flex gap-2">
              {!isEditing ? (
                <>
                  <Button
                    className="bg-[#2563EB] hover:bg-[#1d4ed8]"
                    onClick={() => setIsEditing(true)}
                  >
                    Edit Scheme
                  </Button>
                  <Button
                    variant="destructive"
                    onClick={handleSoftDelete}
                    disabled={isLoading || scheme.status === 'inactive'}
                  >
                    <Trash2 className="mr-2 h-4 w-4" />
                    Delete Scheme
                  </Button>
                </>
              ) : (
                <>
                  <Button
                    className="bg-[#2563EB] hover:bg-[#1d4ed8]"
                    onClick={handleSubmit}
                    disabled={isLoading}
                  >
                    <Save className="mr-2 h-4 w-4" />
                    Save Changes
                  </Button>
                  <Button variant="outline" onClick={() => setIsEditing(false)}>
                    Cancel
                  </Button>
                </>
              )}
            </div>
          </div>

          {/* Display any errors */}
          {error && (
            <div className="mb-4 rounded-md border border-amber-200 bg-amber-50 p-4 text-amber-700">
              {error}
            </div>
          )}

          {/* Scheme details card */}
          <Card className={`mb-6 ${scheme.status === 'inactive' ? 'opacity-75' : ''}`}>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-xl">{scheme.name}</CardTitle>
              <CardDescription>
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
              </CardDescription>
                </div>
                {!isEditing && (
                  <div className="flex items-center gap-2">
                    <Label htmlFor="status-toggle" className="text-sm">Status:</Label>
                    <Select
                      value={scheme.status}
                      onValueChange={async (value) => {
                        try {
                          setIsLoading(true);
                          const updatePayload = {
                            ...scheme,
                            status: value,
                          };
                          const governmentId = getGovernmentId();
                          await axios.put(
                            `${API_BASE_URL}/governments/${governmentId}/schemes/${schemeId}`,
                            updatePayload,
                            {
                              headers: {
                                'Content-Type': 'application/json',
                                'Accept': 'application/json',
                              },
                              withCredentials: true
                            }
                          );
                          setScheme({
                            ...scheme,
                            status: value,
                          });
                          toast({
                            title: "Success",
                            description: "Scheme status updated successfully",
                          });
                        } catch (err) {
                          console.error('Error updating scheme status:', err);
                          if (err instanceof Error && err.message.includes('User ID not found in cookies')) {
                            router.push('/login');
                          } else {
                            toast({
                              variant: "destructive",
                              title: "Error",
                              description: "Failed to update scheme status",
                            });
                          }
                        }
                      }}
                    >
                      <SelectTrigger className="w-[120px]">
                        <SelectValue placeholder="Select status" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="active">Active</SelectItem>
                        <SelectItem value="inactive">Inactive</SelectItem>
                      </SelectContent>
                    </Select>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={async () => {
                        try {
                          const updatePayload = {
                            ...scheme,
                            status: scheme.status,
                          };
                          const governmentId = getGovernmentId();
                          await axios.put(
                            `${API_BASE_URL}/governments/${governmentId}/schemes/${schemeId}`,
                            updatePayload,
                            {
                              headers: {
                                'Content-Type': 'application/json',
                                'Accept': 'application/json',
                              },
                              withCredentials: true
                            }
                          );
                          setScheme({
                            ...scheme,
                            status: scheme.status,
                          });
                          toast({
                            title: "Success",
                            description: "Scheme status updated successfully",
                          });
                        } catch (err) {
                          console.error('Error updating scheme status:', err);
                          if (err instanceof Error && err.message.includes('User ID not found in cookies')) {
                            router.push('/login');
                          } else {
                            toast({
                              variant: "destructive",
                              title: "Error",
                              description: "Failed to update scheme status",
                            });
                          }
                        }
                      }}
                    >
                      <Save className="h-4 w-4" />
                      <span className="sr-only">Save</span>
                    </Button>
                  </div>
                )}
              </div>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                  {/* Left column */}
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="id">Scheme ID</Label>
                      <Input id="id" value={scheme.id} disabled />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="name">Scheme Name</Label>
                      <Input
                        id="name"
                        name="name"
                        value={isEditing ? formData.name : scheme.name}
                        onChange={handleChange}
                        disabled={!isEditing}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="description">Description</Label>
                      <Textarea
                        id="description"
                        name="description"
                        value={
                          isEditing ? formData.description : scheme.description
                        }
                        onChange={handleChange}
                        disabled={!isEditing}
                        className="min-h-[100px]"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="amount">Amount (₹)</Label>
                      <Input
                        id="amount"
                        name="amount"
                        type="number"
                        value={isEditing ? formData.amount : scheme.amount}
                        onChange={handleChange}
                        disabled={!isEditing}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="status">Status</Label>
                      {isEditing ? (
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
                      ) : (
                        <Input
                          id="status"
                          value={
                            scheme.status.charAt(0).toUpperCase() +
                            scheme.status.slice(1)
                          }
                          disabled
                        />
                      )}
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="createdAt">Created At</Label>
                      <Input
                        id="createdAt"
                        value={new Date(scheme.created_at).toLocaleDateString(
                          'en-IN',
                          {
                            day: 'numeric',
                            month: 'short',
                            year: 'numeric',
                          },
                        )}
                        disabled
                      />
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
                            type="text"
                            placeholder="e.g. Farmer"
                            value={
                              isEditing
                                ? formData.eligibility.occupation || ''
                                : scheme.eligibility_criteria.occupation || ''
                            }
                            onChange={(e) =>
                              handleEligibilityChange(
                                'occupation',
                                e.target.value || null,
                              )
                            }
                            disabled={!isEditing}
                          />
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="eligibility-annual_income">Annual Income (₹)</Label>
                          <Input
                            id="eligibility-annual_income"
                            type="number"
                            value={
                              isEditing
                                ? formData.eligibility.annual_income || ''
                                : scheme.eligibility_criteria.annual_income || ''
                            }
                            onChange={(e) =>
                              handleEligibilityChange(
                                'annual_income',
                                e.target.value ? Number(e.target.value) : null,
                              )
                            }
                            disabled={!isEditing}
                          />
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="eligibility-min_age">Minimum Age</Label>
                          <Input
                            id="eligibility-min_age"
                            type="number"
                            value={
                              isEditing
                                ? formData.eligibility.min_age || ''
                                : scheme.eligibility_criteria.min_age || ''
                            }
                            onChange={(e) =>
                              handleEligibilityChange(
                                'min_age',
                                e.target.value ? Number(e.target.value) : null,
                              )
                            }
                            disabled={!isEditing}
                          />
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="eligibility-max_age">Maximum Age</Label>
                          <Input
                            id="eligibility-max_age"
                            type="number"
                            value={
                              isEditing
                                ? formData.eligibility.max_age || ''
                                : scheme.eligibility_criteria.max_age || ''
                            }
                            onChange={(e) =>
                              handleEligibilityChange(
                                'max_age',
                                e.target.value ? Number(e.target.value) : null,
                              )
                            }
                            disabled={!isEditing}
                          />
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="eligibility-gender">Gender</Label>
                          {isEditing ? (
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
                          ) : (
                            <Input
                              id="eligibility-gender"
                              value={scheme.eligibility_criteria.gender || ''}
                              disabled
                            />
                          )}
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="eligibility-caste">Caste</Label>
                          <Input
                            id="eligibility-caste"
                            value={
                              isEditing
                                ? formData.eligibility.caste || ''
                                : scheme.eligibility_criteria.caste || ''
                            }
                            onChange={(e) =>
                              handleEligibilityChange(
                                'caste',
                                e.target.value || null,
                              )
                            }
                            disabled={!isEditing}
                          />
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="eligibility-state">State</Label>
                          <Input
                            id="eligibility-state"
                            value={
                              isEditing
                                ? formData.eligibility.state || ''
                                : scheme.eligibility_criteria.state || ''
                            }
                            onChange={(e) =>
                              handleEligibilityChange(
                                'state',
                                e.target.value || null,
                              )
                            }
                            disabled={!isEditing}
                          />
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="eligibility-district">District</Label>
                          <Input
                            id="eligibility-district"
                            value={
                              isEditing
                                ? formData.eligibility.district || ''
                                : scheme.eligibility_criteria.district || ''
                            }
                            onChange={(e) =>
                              handleEligibilityChange(
                                'district',
                                e.target.value || null,
                              )
                            }
                            disabled={!isEditing}
                          />
                        </div>

                        <div className="space-y-2 md:col-span-2">
                          <Label htmlFor="eligibility-city">City</Label>
                          <Input
                            id="eligibility-city"
                            value={
                              isEditing
                                ? formData.eligibility.city || ''
                                : scheme.eligibility_criteria.city || ''
                            }
                            onChange={(e) =>
                              handleEligibilityChange(
                                'city',
                                e.target.value || null,
                              )
                            }
                            disabled={!isEditing}
                          />
                        </div>
                      </div>

                      {/* Tags */}
                      {isEditing ? (
                        <div className="mt-6">
                          <Label>Tags</Label>
                          <div className="mt-2 flex flex-wrap gap-2">
                            {commonTags.map((tag: string) => (
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
                      ) : (
                        <div className="mt-6">
                          <Label>Tags</Label>
                          <div className="mt-2 flex flex-wrap gap-2">
                            {scheme.tags &&
                              scheme.tags.map((tag: string) => (
                                <Badge key={tag} variant="secondary">
                                  {tag}
                                </Badge>
                              ))}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </form>
            </CardContent>
            {isEditing && (
              <CardFooter className="flex justify-between border-t p-4">
                <Button variant="outline" onClick={() => setIsEditing(false)}>
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
                    'Save Changes'
                  )}
                </Button>
              </CardFooter>
            )}
          </Card>
        </main>
      </div>
    </div>
  );
}
