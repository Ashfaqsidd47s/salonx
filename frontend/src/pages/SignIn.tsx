/* eslint-disable @typescript-eslint/no-explicit-any */
import { Link, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { FaScissors } from 'react-icons/fa6';

interface FormData {
  email: string;
  password: string;
}

const SignIn = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState<FormData>({
    email: '',
    password: '',
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost:8080/api/auth/user/login', formData);
      toast.success('Login successful!');
      localStorage.setItem('token', response.data.token);
      navigate('/explore');
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || 'An error occurred during login';
      toast.error(errorMessage);
    }
  };

  return (
    <div className="flex h-screen">
      <div className="hidden md:block w-1/2 relative">
        <img
          src="https://images.unsplash.com/photo-1560066984-138dadb4c035?auto=format&fit=crop&q=80"
          alt="Salon tools"
          className="w-full h-full object-cover"
        />
        <div className="absolute top-8 left-8 flex items-center gap-2">
          <FaScissors className="h-6 w-6 text-black" />
          <span className="text-white text-xl font-semibold">SALON-X</span>
        </div>
      </div>

      <div className="w-full md:w-1/2 flex items-center justify-center p-8 bg-white">
        <div className="w-full max-w-md">
          <div className="md:hidden flex items-center gap-2 mb-8">
            <FaScissors className="h-6 w-6 text-black" />
            <span className="text-xl font-semibold">SALON-X</span>
          </div>

          <ToastContainer position="top-right" autoClose={5000} hideProgressBar={false} closeOnClick pauseOnHover />

          <div className="text-center mb-8">
            <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <FaScissors className="h-6 w-6 text-black" />
            </div>
            <h2 className="text-2xl font-semibold text-gray-900">Welcome back!</h2>
            <p className="text-gray-500 mt-2">Sign in to your account to continue</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                Email address
              </label>
              <Input
                id="email"
                name="email"
                type="email"
                required
                value={formData.email}
                onChange={handleInputChange}
                className="mt-1 block w-full h-11 rounded-xl border-gray-300 p-3"
              />
            </div>
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                Password
              </label>
              <Input
                id="password"
                name="password"
                type="password"
                required
                value={formData.password}
                onChange={handleInputChange}
                className="mt-1 block w-full h-11 rounded-xl border-gray-300 p-3"
              />
              <div className="flex justify-between items-center mt-2">
                <div className="flex items-center">
                  <Checkbox
                    id="remember"
                    className="h-4 w-4 data-[state=checked]:bg-[#ea580c] data-[state=checked]:focus:ring-[#ea580c] data-[state=checked]:border-white  "
                  />
                  <label htmlFor="remember" className="ml-2 text-sm text-gray-700">
                    Remember me
                  </label>
                </div>
                <Link to="/forgot-password" className="text-sm text-[#ea580c] hover:text-[#c2410c]">
                  Forgot password?
                </Link>
              </div>
            </div>
            <Button
              type="submit"
              className="w-full h-11 bg-[#ea580c] hover:bg-[#c2410c] text-white rounded-xl py-2.5 text-sm font-medium shadow-sm"
            >
              Sign in
            </Button>
            <div className="text-center text-sm">
              <span className="text-gray-500">Don't have an account? </span>
              <Link to="/signup" className="text-yellow-600 hover:text-yellow-700 font-medium">
                Sign up
              </Link>
            </div>
          </form>

          <div className="mt-6 text-center text-xs text-gray-400">
            By continuing, you agree to our Terms and Privacy Policy
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignIn;