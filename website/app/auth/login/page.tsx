'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import axios from 'axios';
import { Eye, EyeOff } from 'lucide-react';
import Image from 'next/image';
import Cookies from 'js-cookie';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/components/ui/use-toast';

const API_BASE_URL = 'http://localhost:8000/api/v1';

interface LoginResponse {
  message: string;
  user_id: string;
  user_type: string;
  transaction_id?: string;
  scheme_id?: string;
  beneficiaries_count?: number;
}

export default function LoginPage() {
  const [idNumber, setIdNumber] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const response = await axios.post<LoginResponse>(`${API_BASE_URL}/auth/login`, {
        id_number: idNumber,
        password: password,
      }, {
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        withCredentials: true
      });

      // Store the response data in cookies
      Cookies.set('user_id', response.data.user_id, { expires: 7 }); // Expires in 7 days
      Cookies.set('user_type', response.data.user_type, { expires: 7 });
      
      if (response.data.transaction_id) {
        Cookies.set('transaction_id', response.data.transaction_id, { expires: 7 });
      }
      if (response.data.scheme_id) {
        Cookies.set('scheme_id', response.data.scheme_id, { expires: 7 });
      }
      
      // Show success message
      toast({
        title: 'Login successful',
        description: response.data.message,
      });

      // Redirect based on user type
      if (response.data.user_type === 'government') {
        router.push('/dashboard');
      } else if (response.data.user_type === 'citizen') {
        router.push('/citizen/dashboard');
      }
    } catch (error: any) {
      // Handle validation errors
      if (error.response?.status === 422) {
        const errorMessage = error.response.data.detail[0]?.msg || 'Invalid credentials';
        toast({
          variant: 'destructive',
          title: 'Login failed',
          description: errorMessage,
        });
      } else if (error.response?.status === 401) {
        toast({
          variant: 'destructive',
          title: 'Login failed',
          description: 'Invalid credentials. Please check your ID number and password.',
        });
      } else if (error.response?.status === 403) {
        toast({
          variant: 'destructive',
          title: 'Access denied',
          description: 'You do not have permission to access this resource.',
        });
      } else {
        toast({
          variant: 'destructive',
          title: 'Login failed',
          description: error.response?.data?.message || 'An error occurred. Please try again.',
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
          Welcome to Payzee
        </h2>
        <p className="mt-2 text-center text-sm text-gray-600">
          Sign in to access your account
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
          <form className="space-y-6" onSubmit={handleSubmit}>
            <div>
              <Label htmlFor="id_number" className="block text-sm font-medium text-gray-700">
                ID Number
              </Label>
              <div className="mt-1">
                <Input
                  id="id_number"
                  name="id_number"
                  type="text"
                  required
                  value={idNumber}
                  onChange={(e) => setIdNumber(e.target.value)}
                  className="block w-full appearance-none rounded-md border border-gray-300 px-3 py-2 placeholder-gray-400 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500 sm:text-sm"
                  placeholder="Enter your ID number"
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
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
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

            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <input
                  id="remember-me"
                  name="remember-me"
                  type="checkbox"
                  className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
                <Label
                  htmlFor="remember-me"
                  className="ml-2 block text-sm text-gray-900"
                >
                  Remember me
                </Label>
              </div>

              <div className="text-sm">
                <a
                  href="#"
                  className="font-medium text-blue-600 hover:text-blue-500"
                >
                  Forgot your password?
                </a>
              </div>
            </div>

            <div>
              <Button
                type="submit"
                className="flex w-full justify-center rounded-md border border-transparent bg-blue-600 py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                disabled={isLoading}
              >
                {isLoading ? 'Signing in...' : 'Sign in'}
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
                  Don't have an account?
                </span>
              </div>
            </div>

            <div className="mt-6">
              <Button
                variant="outline"
                className="w-full"
                onClick={() => router.push('/auth/register')}
              >
                Create new account
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 