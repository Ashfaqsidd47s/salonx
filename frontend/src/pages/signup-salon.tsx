/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState } from 'react';
import { useNavigate } from "react-router-dom";
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Switch } from '@/components/ui/switch';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogTrigger } from '@/components/ui/dialog';
import PhoneInput from 'react-phone-input-2';
import 'react-phone-input-2/lib/material.css';
import logo from '../assets/logo.png';
import { FaArrowLeft, FaTrash, FaGlobe } from "react-icons/fa6";
import { countries } from '../constants/countries';

// Define types for form data
interface BusinessHours {
  [key: string]: {
    open: boolean;
    start: string;
    end: string;
  };
}

interface Address {
  address: string;
  street: string;
  city: string;
  state: string;
  zip: string;
  country: string;
}

interface Service {
  name: string;
  price: number;
  duration: number; // Duration in minutes
}

interface FormData {
  firstName: string;
  lastName: string;
  email: string;
  businessName: string;
  phone: string;
  password: string;
  businessCategories: string[];
  businessImages: File[];
  menuImages: File[];
  certificates: File[];
  servicesFor: string;
  description: string;
  serviceLocation: string[];
  address: Address;
  businessHours: BusinessHours;
  services: Service[];
}

function SignupSalon() {
  const [step, setStep] = useState<number>(1);
  const [passwordVisible, setPasswordVisible] = useState<boolean>(false);
  const [dialogOpen, setDialogOpen] = useState<boolean>(false);
  const [newService, setNewService] = useState<{ name: string; price: string; duration: string }>({
    name: '',
    price: '',
    duration: '',
  });
  const navigate = useNavigate();

  const [formData, setFormData] = useState<FormData>({
    firstName: '',
    lastName: '',
    email: '',
    businessName: '',
    phone: '',
    password: '',
    businessCategories: [],
    businessImages: [],
    menuImages: [],
    certificates: [],
    servicesFor: '',
    description: '',
    serviceLocation: [],
    address: {
      address: '',
      street: '',
      city: '',
      state: '',
      zip: '',
      country: countries.length > 0 ? countries[0].name.common : '',
    },
    businessHours: {
      Sunday: { open: false, start: '10:00 AM', end: '8:00 PM' },
      Monday: { open: true, start: '10:00 AM', end: '8:00 PM' },
      Tuesday: { open: true, start: '10:00 AM', end: '8:00 PM' },
      Wednesday: { open: true, start: '10:00 AM', end: '8:00 PM' },
      Thursday: { open: true, start: '10:00 AM', end: '8:00 PM' },
      Friday: { open: true, start: '10:00 AM', end: '8:00 PM' },
      Saturday: { open: true, start: '10:00 AM', end: '8:00 PM' },
    },
    services: [],
  });

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement> | string
  ) => {
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

  const handleAddressChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      address: { ...prev.address, [name]: value },
    }));
  };

  const handleCountryChange = (value: string) => {
    setFormData((prev) => ({
      ...prev,
      address: { ...prev.address, country: value },
    }));
  };

  const handleBusinessCategoryChange = (category: string) => {
    setFormData((prev) => ({
      ...prev,
      businessCategories: prev.businessCategories.includes(category)
        ? prev.businessCategories.filter((c) => c !== category)
        : [...prev.businessCategories, category],
    }));
  };

  const handleServiceForChange = (service: string) => {
    setFormData((prev) => ({
      ...prev,
      servicesFor: service,
    }));
  };

  const handleServiceLocationChange = (location: string) => {
    setFormData((prev) => ({
      ...prev,
      serviceLocation: prev.serviceLocation.includes(location)
        ? prev.serviceLocation.filter((l) => l !== location)
        : [...prev.serviceLocation, location],
    }));
  };

  const handleBusinessHoursChange = (day: string, field: string, value: string | boolean) => {
    setFormData((prev) => ({
      ...prev,
      businessHours: {
        ...prev.businessHours,
        [day]: { ...prev.businessHours[day], [field]: value },
      },
    }));
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>, field: keyof FormData) => {
    const files = e.target.files ? Array.from(e.target.files) : [];
    setFormData((prev) => ({
      ...prev,
      [field]: [...(prev[field] as File[]), ...files],
    }));
  };

  const handleNewServiceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setNewService((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleAddService = () => {
    if (!newService.name.trim()) {
      toast.error('Service name cannot be empty.');
      return;
    }
    const price = parseFloat(newService.price);
    if (isNaN(price) || price <= 0) {
      toast.error('Price must be a positive number.');
      return;
    }
    const duration = parseInt(newService.duration);
    if (isNaN(duration) || duration <= 0) {
      toast.error('Duration must be a positive number (in minutes).');
      return;
    }

    setFormData((prev) => ({
      ...prev,
      services: [
        ...prev.services,
        {
          name: newService.name.trim(),
          price,
          duration,
        },
      ],
    }));
    setNewService({ name: '', price: '', duration: '' });
    setDialogOpen(false);
  };

  const handleDeleteService = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      services: prev.services.filter((_, i) => i !== index),
    }));
  };

  const togglePasswordVisibility = () => {
    setPasswordVisible(!passwordVisible);
  };

  const nextStep = () => setStep((prev) => prev + 1);
  const prevStep = () => setStep((prev) => prev - 1);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setFormData((prev) => ({...prev , phone: "+" + prev.phone}))
    console.log(formData)
    try {
      const response = await axios.post<{ token: string }>('http://localhost:8080/api/auth/provider/register', formData);
      toast.success('Signup successful!');
      localStorage.setItem('token', response.data.token);
      navigate('/explore');
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || 'An error occurred during signup.';
      toast.error(errorMessage);
    }
  };

  const renderStep = () => {
    switch (step) {
      case 1:
        return (
          <>
            <div className="text-center mb-6">
              <h1 className="text-2xl font-semibold mb-2">About you</h1>
              <p className="text-gray-600">Welcome! Please tell us about yourself and your business.</p>
            </div>
            <form className="w-full flex flex-col gap-4">
              <div className="flex flex-col sm:flex-row gap-4">
                <div className="flex-1">
                  <label htmlFor="firstName" className="block text-sm font-medium text-gray-700">First name</label>
                  <Input
                    type="text"
                    id="firstName"
                    name="firstName"
                    value={formData.firstName}
                    onChange={handleInputChange}
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-xl shadow-sm focus:outline-none focus:ring-orange-500 focus:border-orange-500 h-[44px]"
                    required
                  />
                </div>
                <div className="flex-1">
                  <label htmlFor="lastName" className="block text-sm font-medium text-gray-700">Last name</label>
                  <Input
                    type="text"
                    id="lastName"
                    name="lastName"
                    value={formData.lastName}
                    onChange={handleInputChange}
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-xl shadow-sm focus:outline-none focus:ring-orange-500 focus:border-orange-500 h-[44px]"
                    required
                  />
                </div>
              </div>
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email address</label>
                <Input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-xl shadow-sm focus:outline-none focus:ring-orange-500 focus:border-orange-500 h-[44px]"
                  required
                />
              </div>
              <div>
                <label htmlFor="businessName" className="block text-sm font-medium text-gray-700">Business Name</label>
                <Input
                  type="text"
                  id="businessName"
                  name="businessName"
                  value={formData.businessName}
                  onChange={handleInputChange}
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-xl shadow-sm focus:outline-none focus:ring-orange-500 focus:border-orange-500 h-[44px]"
                  required
                />
              </div>
              <div>
                <label htmlFor="phone" className="block text-sm font-medium text-gray-700">Phone number</label>
                <div className="h-[44px]">
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
                </div>
              </div>
              <div className="relative">
                <label htmlFor="password" className="block text-sm font-medium text-gray-700">Create password</label>
                <Input
                  type={passwordVisible ? "text" : "password"}
                  id="password"
                  name="password"
                  value={formData.password}
                  onChange={handleInputChange}
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-xl shadow-sm focus:outline-none focus:ring-orange-500 focus:border-orange-500 h-[44px]"
                  required
                />
                <button
                  type="button"
                  className="absolute right-4 top-1/2 mt-4 transform -translate-y-1/2 text-xl"
                  onClick={togglePasswordVisibility}
                >
                  {passwordVisible ? "🙈" : "👁"}
                </button>
              </div>
              <Button
                variant="default"
                className="mt-6 w-full bg-orange-500 hover:bg-orange-600 text-white"
                onClick={nextStep}
              >
                Continue
              </Button>
            </form>
          </>
        );
      case 2:
        return (
          <>
            <div className="text-center mb-6">
              <h1 className="text-2xl font-semibold mb-2">Tell us about your business</h1>
            </div>
            <form className="w-full flex flex-col gap-2">
              {[
                'Aesthetic Medicine',
                'Barbershop',
                'Braids & Locs',
                'Dental & Orthodontics',
                'Hair Removal',
                'Hair Salon',
                'Health & Fitness',
                'Home Services',
                'Makeup',
              ].map((category) => (
                <div key={category} className="flex items-center space-x-2">
                  <Checkbox
                    id={category}
                    checked={formData.businessCategories.includes(category)}
                    onCheckedChange={() => handleBusinessCategoryChange(category)}
                    className="border-orange-500 data-[state=checked]:bg-orange-500"
                  />
                  <label htmlFor={category} className="text-sm font-medium text-gray-700">{category}</label>
                </div>
              ))}
              <Button
                variant="default"
                className="mt-6 w-full bg-orange-500 hover:bg-orange-600 text-white"
                onClick={nextStep}
              >
                Continue
              </Button>
            </form>
          </>
        );
      case 3:
        return (
          <>
            <div className="text-center mb-6">
              <h1 className="text-2xl font-semibold mb-2">Add your business info</h1>
              <p className="text-gray-600">Please enter business details, images, and your expert certificates.</p>
            </div>
            <form className="w-full flex flex-col gap-4">
              <div>
                <label htmlFor="businessImages" className="block text-sm font-medium text-gray-700">Upload business images *</label>
                <Input
                  type="file"
                  id="businessImages"
                  multiple
                  onChange={(e) => handleFileUpload(e, 'businessImages')}
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-xl shadow-sm focus:outline-none focus:ring-orange-500 focus:border-orange-500 h-[44px]"
                />
              </div>
              <div>
                <label htmlFor="menuImages" className="block text-sm font-medium text-gray-700">Upload menu images *</label>
                <Input
                  type="file"
                  id="menuImages"
                  multiple
                  onChange={(e) => handleFileUpload(e, 'menuImages')}
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-xl shadow-sm focus:outline-none focus:ring-orange-500 focus:border-orange-500 h-[44px]"
                />
              </div>
              <div>
                <label htmlFor="certificates" className="block text-sm font-medium text-gray-700">Upload certificates *</label>
                <Input
                  type="file"
                  id="certificates"
                  multiple
                  onChange={(e) => handleFileUpload(e, 'certificates')}
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-xl shadow-sm focus:outline-none focus:ring-orange-500 focus:border-orange-500 h-[44px]"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Services provided for</label>
                <RadioGroup
                  value={formData.servicesFor}
                  onValueChange={handleServiceForChange}
                  className="flex items-center gap-5 mt-2"
                >
                  {['Male', 'Female', 'Unisex'].map((service) => (
                    <div key={service} className="flex flex-col items-center space-x-2">
                      <RadioGroupItem
                        value={service}
                        id={service}
                        className="border-orange-500 text-orange-500 data-[state=checked]:bg-orange-500"
                      />
                      <label htmlFor={service} className="text-sm font-medium text-gray-700">{service}</label>
                    </div>
                  ))}
                </RadioGroup>
              </div>
              <div>
                <label htmlFor="description" className="block text-sm font-medium text-gray-700">About the business</label>
                <textarea
                  id="description"
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-xl shadow-sm focus:outline-none focus:ring-orange-500 focus:border-orange-500"
                  rows={4}
                />
              </div>
              <Button
                variant="default"
                className="mt-6 w-full bg-orange-500 hover:bg-orange-600 text-white"
                onClick={nextStep}
              >
                Continue
              </Button>
            </form>
          </>
        );
      case 4:
        return (
          <>
            <div className="text-center mb-6">
              <h1 className="text-2xl font-semibold mb-2">Where do you want to provide services?</h1>
            </div>
            <form className="w-full flex flex-col gap-2">
              <div>
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="atMyPlace"
                    checked={formData.serviceLocation.includes('At my place')}
                    onCheckedChange={() => handleServiceLocationChange('At my place')}
                    className="border-orange-500 data-[state=checked]:bg-orange-500"
                  />
                  <label htmlFor="atMyPlace" className="text-sm font-medium text-gray-700">At my place</label>
                </div>
                <p className="text-gray-600 ml-8">My clients come to me, I own the place, work in a salon/upgrade alongside other professionals.</p>
              </div>
              <div>
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="atClientLocation"
                    checked={formData.serviceLocation.includes("At the client's location")}
                    onCheckedChange={() => handleServiceLocationChange("At the client's location")}
                    className="border-orange-500 data-[state=checked]:bg-orange-500"
                  />
                  <label htmlFor="atClientLocation" className="text-sm font-medium text-gray-700">At the client's location</label>
                </div>
                <p className="text-gray-600 ml-8">We're on the go. My services are performed at the client's location.</p>
              </div>
              <Button
                variant="default"
                className="mt-6 w-full bg-orange-500 hover:bg-orange-600 text-white"
                onClick={nextStep}
              >
                Continue
              </Button>
            </form>
          </>
        );
      case 5:
        return (
          <>
            <div className="text-center mb-6">
              <h1 className="text-2xl font-semibold mb-2">Enter your salon address</h1>
              <p className="text-gray-600">Where can you be found?</p>
            </div>
            <form className="w-full flex flex-col gap-4">
              <div>
                <label htmlFor="address" className="block text-sm font-medium text-gray-700">Address</label>
                <Input
                  type="text"
                  id="address"
                  name="address"
                  value={formData.address.address}
                  onChange={handleAddressChange}
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-xl shadow-sm focus:outline-none focus:ring-orange-500 focus:border-orange-500 h-[44px]"
                />
              </div>
              <div>
                <label htmlFor="street" className="block text-sm font-medium text-gray-700">Street</label>
                <Input
                  type="text"
                  id="street"
                  name="street"
                  value={formData.address.street}
                  onChange={handleAddressChange}
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-xl shadow-sm focus:outline-none focus:ring-orange-500 focus:border-orange-500 h-[44px]"
                />
              </div>
              <div className="flex flex-col sm:flex-row gap-4">
                <div className="flex-1">
                  <label htmlFor="city" className="block text-sm font-medium text-gray-700">City</label>
                  <Input
                    type="text"
                    id="city"
                    name="city"
                    value={formData.address.city}
                    onChange={handleAddressChange}
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-xl shadow-sm focus:outline-none focus:ring-orange-500 focus:border-orange-500 h-[44px]"
                  />
                </div>
                <div className="flex-1">
                  <label htmlFor="state" className="block text-sm font-medium text-gray-700">State/Province</label>
                  <Input
                    type="text"
                    id="state"
                    name="state"
                    value={formData.address.state}
                    onChange={handleAddressChange}
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-xl shadow-sm focus:outline-none focus:ring-orange-500 focus:border-orange-500 h-[44px]"
                  />
                </div>
              </div>
              <div>
                <label htmlFor="zip" className="block text-sm font-medium text-gray-700">ZIP/Postal Code</label>
                <Input
                  type="text"
                  id="zip"
                  name="zip"
                  value={formData.address.zip}
                  onChange={handleAddressChange}
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-xl shadow-sm focus:outline-none focus:ring-orange-500 focus:border-orange-500 h-[44px]"
                />
              </div>
              <div>
                <label htmlFor="country" className="block text-sm font-medium text-gray-700">Country</label>
                <Select
                  value={formData.address.country}
                  onValueChange={handleCountryChange}
                >
                  <SelectTrigger className="mt-1 block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 h-[44px] bg-white">
                    <FaGlobe className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500" />
                    <SelectValue placeholder="Select country" />
                  </SelectTrigger>
                  <SelectContent className="max-h-60 overflow-y-auto bg-white border border-gray-200 rounded-xl shadow-lg">
                    {countries.map((country) => (
                      <SelectItem
                        key={country.cca2}
                        value={country.name.common}
                        className="px-4 py-2 hover:bg-orange-50 hover:text-orange-600 focus:bg-orange-50 focus:text-orange-600 cursor-pointer"
                      >
                        {country.name.common}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <Button
                variant="default"
                className="mt-6 w-full bg-orange-500 hover:bg-orange-600 text-white"
                onClick={nextStep}
              >
                Continue
              </Button>
            </form>
          </>
        );
      case 6:
        return (
          <>
            <div className="text-center mb-6">
              <h1 className="text-2xl font-semibold mb-2">Your business hours</h1>
              <p className="text-gray-600">When can clients book with you?</p>
            </div>
            <form className="w-full flex flex-col gap-4">
              {Object.keys(formData.businessHours).map((day) => (
                <div key={day} className="flex items-center justify-between py-2 border-b border-gray-200">
                  <div className="flex items-center">
                    <Switch
                      checked={formData.businessHours[day].open}
                      onCheckedChange={(checked) => handleBusinessHoursChange(day, 'open', checked)}
                      className="data-[state=checked]:bg-green-500"
                    />
                    <span className="ml-2 text-gray-700">{day}</span>
                  </div>
                  {formData.businessHours[day].open ? (
                    <div className="flex items-center">
                      <Input
                        type="time"
                        value={formData.businessHours[day].start}
                        onChange={(e) => handleBusinessHoursChange(day, 'start', e.target.value)}
                        className="w-28 px-2 py-1 border border-gray-300 rounded-xl shadow-sm focus:outline-none focus:ring-orange-500 focus:border-orange-500 h-[44px]"
                      />
                      <span className="mx-2">-</span>
                      <Input
                        type="time"
                        value={formData.businessHours[day].end}
                        onChange={(e) => handleBusinessHoursChange(day, 'end', e.target.value)}
                        className="w-28 px-2 py-1 border border-gray-300 rounded-xl shadow-sm focus:outline-none focus:ring-orange-500 focus:border-orange-500 h-[44px]"
                      />
                    </div>
                  ) : (
                    <span className="text-pink-500">Closed</span>
                  )}
                </div>
              ))}
              <Button
                variant="default"
                className="mt-6 w-full bg-orange-500 hover:bg-orange-600 text-white"
                onClick={nextStep}
              >
                Continue
              </Button>
            </form>
          </>
        );
      case 7:
        return (
          <>
            <div className="text-center mb-6">
              <h1 className="text-2xl font-semibold mb-2">Add your salon services</h1>
              <p className="text-gray-600">What services do you offer?</p>
            </div>
            <form className="w-full flex flex-col gap-4" onSubmit={handleSubmit}>
              <div className="flex flex-col gap-2">
                {formData.services.length > 0 ? (
                  <>
                    <div className="grid grid-cols-4 gap-4 p-3 bg-gray-100 rounded-xl font-medium text-gray-700">
                      <span>Name</span>
                      <span>Price ($)</span>
                      <span>Duration (min)</span>
                      <span>Action</span>
                    </div>
                    {formData.services.map((service, index) => (
                      <div
                        key={index}
                        className="grid grid-cols-4 gap-4 items-center p-3 border border-gray-300 rounded-xl"
                      >
                        <span className="text-gray-700">{service.name}</span>
                        <span className="text-gray-700">{service.price.toFixed(2)}</span>
                        <span className="text-gray-700">{service.duration}</span>
                        <Button
                          variant="ghost"
                          type="button"
                          className="text-red-500 hover:text-red-600 justify-self-end"
                          onClick={() => handleDeleteService(index)}
                        >
                          <FaTrash />
                        </Button>
                      </div>
                    ))}
                  </>
                ) : (
                  <p className="text-gray-600 text-center">No services added yet.</p>
                )}
              </div>
              <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
                <DialogTrigger asChild>
                  <Button
                    variant="outline"
                    className="mt-4 w-full border-orange-500 text-orange-500 hover:bg-orange-50"
                  >
                    Add New Service
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[425px]">
                  <DialogHeader>
                    <DialogTitle>Add a New Service</DialogTitle>
                  </DialogHeader>
                  <div className="py-4 flex flex-col gap-4">
                    <div>
                      <label htmlFor="serviceName" className="block text-sm font-medium text-gray-700">
                        Service Name
                      </label>
                      <Input
                        id="serviceName"
                        name="name"
                        value={newService.name}
                        onChange={handleNewServiceChange}
                        className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-xl shadow-sm focus:outline-none focus:ring-orange-500 focus:border-orange-500 h-[44px]"
                        placeholder="e.g., Haircut"
                      />
                    </div>
                    <div>
                      <label htmlFor="servicePrice" className="block text-sm font-medium text-gray-700">
                        Price ($)
                      </label>
                      <Input
                        type="number"
                        id="servicePrice"
                        name="price"
                        value={newService.price}
                        onChange={handleNewServiceChange}
                        className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-xl shadow-sm focus:outline-none focus:ring-orange-500 focus:border-orange-500 h-[44px]"
                        placeholder="e.g., 50.00"
                        step="0.01"
                        min="0"
                      />
                    </div>
                    <div>
                      <label htmlFor="serviceDuration" className="block text-sm font-medium text-gray-700">
                        Duration (minutes)
                      </label>
                      <Input
                        type="number"
                        id="serviceDuration"
                        name="duration"
                        value={newService.duration}
                        onChange={handleNewServiceChange}
                        className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-xl shadow-sm focus:outline-none focus:ring-orange-500 focus:border-orange-500 h-[44px]"
                        placeholder="e.g., 60"
                        min="0"
                      />
                    </div>
                  </div>
                  <DialogFooter>
                    <Button
                      variant="outline"
                      onClick={() => {
                        setNewService({ name: '', price: '', duration: '' });
                        setDialogOpen(false);
                      }}
                      className="border-gray-300 text-gray-700 hover:bg-gray-100"
                    >
                      Cancel
                    </Button>
                    <Button
                      onClick={handleAddService}
                      className="bg-orange-500 hover:bg-orange-600 text-white"
                    >
                      Add
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
              <div className="flex flex-col sm:flex-row gap-4 mt-6 px-4 justify-center">
                <Button
                  type="button"
                  variant="outline"
                  className="flex-1 border-gray-300 text-gray-700 hover:bg-gray-100"
                  onClick={prevStep}
                >
                  Back
                </Button>
                <Button
                  type="submit"
                  variant="default"
                  className="flex-1 bg-orange-500 hover:bg-orange-600 text-white"
                >
                  Sign Up
                </Button>
              </div>
            </form>
          </>
        );
      default:
        return null;
    }
  };

  return (
    <div className="flex flex-col items-center min-h-screen bg-gray-100 p-6">
      <ToastContainer position="top-right" autoClose={5000} hideProgressBar={false} closeOnClick pauseOnHover />
      <div className="w-full max-w-lg flex items-center justify-start py-5">
        <button className="text-xl rounded-full bg-gray-200 p-2 hover:bg-gray-300 cursor-pointer" onClick={() => step === 1 ? navigate(-1) : prevStep()}>
          <FaArrowLeft />
        </button>
        <div className="flex-grow flex justify-center">
          <img src={logo} alt="Salon X Logo" className="h-10" />
        </div>
      </div>
      <div className="w-full max-w-lg text-left bg-white p-6 rounded-lg shadow-lg flex flex-col items-center">
        {renderStep()}
      </div>
      {step === 1 && (
        <div className="terms-conditions mt-4 text-center">
          <p>By proceeding, you agree to the Terms and Conditions and Privacy Policy</p>
          <div className="terms-links flex justify-center gap-4 mt-2">
            <a href="#" className="underline">Help</a>
            <a href="#" className="underline">Privacy</a>
            <a href="#" className="underline">Terms</a>
          </div>
        </div>
      )}
    </div>
  );
}

export default SignupSalon;