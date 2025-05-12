/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import logo from '../assets/logo.png';
import PhoneInput from 'react-phone-input-2';
import { IoMdArrowRoundBack } from 'react-icons/io';

interface FormData {
  firstName: string;
  lastName: string;
  email: string;
  businessName: string;
  phone: string;
  password: string;
}

function Signup() {
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [formData, setFormData] = useState<FormData>({
    firstName: '',
    lastName: '',
    email: '',
    businessName: '',
    phone: '',
    password: '',
  });
  const [forgotPasswordEmail, setForgotPasswordEmail] = useState('');
  const navigate = useNavigate();

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement> | string) => {
    if (typeof e === 'string') {
      setFormData((prev) => ({
        ...prev,
        phone: e,
      }));
    } else {
      const { name, value } = e.target;
      setFormData((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  const togglePasswordVisibility = () => {
    setPasswordVisible(!passwordVisible);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await axios.post('http://localhost:8080/api/auth/user/register', formData);
      toast.success('Signup successful!');
      navigate('/explore');
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || 'An error occurred during signup.';
      toast.error(errorMessage);
    }
  };

  const handleForgotPassword = async () => {
    try {
      await axios.post('http://localhost:8080/api/auth/forgot-password', {
        email: forgotPasswordEmail,
      });
      toast.success('Password reset link sent!');
      setForgotPasswordEmail('');
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || 'Error sending reset link.';
      toast.error(errorMessage);
    }
  };

  return (
    <div className="flex flex-col items-center min-h-screen bg-gray-100 p-6">
      <ToastContainer position="top-right" autoClose={5000} hideProgressBar={false} closeOnClick pauseOnHover />

      {/* Top Bar */}
      <div className="w-full max-w-lg flex items-center justify-start py-5">
        <button className="text-2xl" onClick={() => navigate(-1)}>
          <IoMdArrowRoundBack />
        </button>
        <div className="flex-grow flex justify-center">
          <img src={logo} alt="Salon X Logo" className="h-10" />
        </div>
      </div>

      {/* Content */}
      <div className="w-full max-w-lg text-left bg-white p-6 rounded-lg shadow-lg flex flex-col items-center">
        <div className="text-center mb-6">
          <h1 className="text-2xl font-semibold mb-2">About you</h1>
          <p className="text-gray-600">Welcome! Please tell us about yourself and your business.</p>
        </div>

        {/* Form */}
        <form className="w-full flex flex-col gap-4 rounded-2xl" onSubmit={handleSubmit}>
          <div className="flex flex-col sm:flex-row gap-4">
            <Input
              type="text"
              name="firstName"
              placeholder="First name"
              value={formData.firstName}
              onChange={handleInputChange}
              required
              className="flex-1 p-3 border border-gray-300 h-11 rounded-xl"
            />
            <Input
              type="text"
              name="lastName"
              placeholder="Last name"
              value={formData.lastName}
              onChange={handleInputChange}
              required
              className="flex-1 p-3 border border-gray-300 h-11 rounded-xl"
            />
          </div>

          <Input
            type="email"
            name="email"
            placeholder="Email address"
            value={formData.email}
            onChange={handleInputChange}
            required
            className="p-3 border border-gray-300 h-11 rounded-xl "
          />
          <Input
            type="text"
            name="businessName"
            placeholder="Business Name"
            value={formData.businessName}
            onChange={handleInputChange}
            required
            className="p-3 border border-gray-300 h-11 rounded-xl"
          />

          {/* Phone Input */}
          <PhoneInput
            country={'us'}
            countryCodeEditable={false}
            value={formData.phone}
            onChange={handleInputChange}
            inputProps={{
              required: true,
              id: 'phone',
            }}
          />

          {/* Password Input */}
          <div className="relative ">
            <Input
              type={passwordVisible ? 'text' : 'password'}
              name="password"
              placeholder="Create password"
              value={formData.password}
              onChange={handleInputChange}
              required
              className="w-full p-3 border border-gray-300 h-11 rounded-xl"
            />
            <button
              type="button"
              className="absolute right-4 top-1/2 transform -translate-y-1/2 text-xl"
              onClick={togglePasswordVisibility}
            >
              {passwordVisible ? '🙈' : '👁'}
            </button>
          </div>

          {/* Forgot Password Link */}
          <div className="mt-2 text-right">
            <Dialog>
              <DialogTrigger asChild>
                <Button variant="link" className="text-yellow-600 hover:text-yellow-700 text-sm items-center">
                  Forgot Password?
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Reset Password</DialogTitle>
                </DialogHeader>
                <Input
                  type="email"
                  placeholder="Enter your email"
                  value={forgotPasswordEmail}
                  onChange={(e) => setForgotPasswordEmail(e.target.value)}
                  className="p-3 border border-gray-300 h-11 rounded-xl"
                />
                <Button
                  onClick={handleForgotPassword}
                  className="w-full bg-yellow-600 text-white p-3 rounded-md mt-4 hover:bg-yellow-700"
                >
                  Send Reset Link
                </Button>
              </DialogContent>
            </Dialog>
          </div>

          <Button
            type="submit"
            className="w-full h-11 bg-yellow-600 text-white p-3 rounded-xl font-semibold  hover:bg-yellow-700"
          >
            SIGN UP
          </Button>
        </form>
      </div>
    </div>
  );
}

export default Signup;