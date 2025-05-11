'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import axios from 'axios';
import { Eye, EyeOff } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/components/ui/use-toast';

const API_BASE_URL = 'http://localhost:8000/api/v1';

interface RegisterResponse {
  message: string;
  user_id: string;
  user_type: string;
  transaction_id: string;
  scheme_id: string;
  beneficiaries_count: number;
}

export default function RegisterPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    department: '',
    jurisdiction: '',
    govt_id: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const { toast } = useToast();

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const response = await axios.post<RegisterResponse>(
        `${API_BASE_URL}/auth/signup/government`,
        formData
      );

      // Store the response data
      localStorage.setItem('user_id', response.data.user_id);
      localStorage.setItem('user_type', response.data.user_type);

      // Show success message
      toast({
        title: 'Registration successful',
        description: response.data.message,
      });

      // Redirect to dashboard
      router.push('/dashboard');
    } catch (error: any) {
      // Handle validation errors
      if (error.response?.status === 422) {
        const errorMessage = error.response.data.detail[0]?.msg || 'Invalid input';
        toast({
          variant: 'destructive',
          title: 'Registration failed',
          description: errorMessage,
        });
      } else {
        toast({
          variant: 'destructive',
          title: 'Registration failed',
          description: 'An error occurred. Please try again.',
        });
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="flex justify-center">
          <Image
            src="/logo.png"
            alt="Payzee Logo"
            width={120}
            height={120}
            className="mx-auto"
          />
        </div>
        <h2 className="mt-6 text-center text-3xl font-bold tracking-tight text-gray-900">
          Create your account
        </h2>
        <p className="mt-2 text-center text-sm text-gray-600">
          Sign up to get started with Payzee
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
          <form className="space-y-6" onSubmit={handleSubmit}>
            <div>
              <Label htmlFor="name" className="block text-sm font-medium text-gray-700">
                Full Name
              </Label>
              <div className="mt-1">
                <Input
                  id="name"
                  name="name"
                  type="text"
                  required
                  value={formData.name}
                  onChange={handleInputChange}
                  className="block w-full appearance-none rounded-md border border-gray-300 px-3 py-2 placeholder-gray-400 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500 sm:text-sm"
                  placeholder="John Doe"
                />
              </div>
            </div>

            <div>
              <Label htmlFor="email" className="block text-sm font-medium text-gray-700">
                Email
              </Label>
              <div className="mt-1">
                <Input
                  id="email"
                  name="email"
                  type="email"
                  required
                  value={formData.email}
                  onChange={handleInputChange}
                  className="block w-full appearance-none rounded-md border border-gray-300 px-3 py-2 placeholder-gray-400 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500 sm:text-sm"
                  placeholder="name@example.com"
                />
              </div>
            </div>

            <div>
              <Label htmlFor="password" className="block text-sm font-medium text-gray-700">
                Password
              </Label>
              <div className="mt-1 relative">
                <Input
                  id="password"
                  name="password"
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={formData.password}
                  onChange={handleInputChange}
                  className="block w-full appearance-none rounded-md border border-gray-300 px-3 py-2 placeholder-gray-400 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500 sm:text-sm"
                  placeholder="Enter your password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 flex items-center pr-3"
                >
                  {showPassword ? (
                    <EyeOff className="h-5 w-5 text-gray-400" />
                  ) : (
                    <Eye className="h-5 w-5 text-gray-400" />
                  )}
                </button>
              </div>
            </div>

            <div>
              <Label htmlFor="department" className="block text-sm font-medium text-gray-700">
                Department
              </Label>
              <div className="mt-1">
                <Input
                  id="department"
                  name="department"
                  type="text"
                  required
                  value={formData.department}
                  onChange={handleInputChange}
                  className="block w-full appearance-none rounded-md border border-gray-300 px-3 py-2 placeholder-gray-400 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500 sm:text-sm"
                  placeholder="Enter your department"
                />
              </div>
            </div>

            <div>
              <Label htmlFor="jurisdiction" className="block text-sm font-medium text-gray-700">
                Jurisdiction
              </Label>
              <div className="mt-1">
                <Input
                  id="jurisdiction"
                  name="jurisdiction"
                  type="text"
                  required
                  value={formData.jurisdiction}
                  onChange={handleInputChange}
                  className="block w-full appearance-none rounded-md border border-gray-300 px-3 py-2 placeholder-gray-400 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500 sm:text-sm"
                  placeholder="Enter your jurisdiction"
                />
              </div>
            </div>

            <div>
              <Label htmlFor="govt_id" className="block text-sm font-medium text-gray-700">
                Government ID
              </Label>
              <div className="mt-1">
                <Input
                  id="govt_id"
                  name="govt_id"
                  type="text"
                  required
                  value={formData.govt_id}
                  onChange={handleInputChange}
                  className="block w-full appearance-none rounded-md border border-gray-300 px-3 py-2 placeholder-gray-400 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500 sm:text-sm"
                  placeholder="Enter your government ID"
                />
              </div>
            </div>

            <div>
              <Button
                type="submit"
                className="flex w-full justify-center rounded-md border border-transparent bg-blue-600 py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                disabled={isLoading}
              >
                {isLoading ? 'Creating account...' : 'Create account'}
              </Button>
            </div>
          </form>

          <div className="mt-6">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300" />
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="bg-white px-2 text-gray-500">
                  Already have an account?
                </span>
              </div>
            </div>

            <div className="mt-6">
              <Button
                variant="outline"
                className="w-full"
                onClick={() => router.push('/auth/login')}
              >
                Sign in
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 