"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { pic4 } from '@/assets/image'; // Ensure path is correct
import { signIn } from 'next-auth/react';

const Signup = () => {
  const [credentials, setCredentials] = useState({ email: '', password: '', repeatPassword: '', name: '', lastname: '' });
  const [error, setError] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);
  const router = useRouter();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCredentials({ ...credentials, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null); // Clear any previous errors

    if (credentials.password !== credentials.repeatPassword) {
      setError("Passwords do not match");
      return;
    }

    try {
      // Repl
      const formData = new FormData();
      formData.append('name', credentials.name);
      formData.append('lastname', credentials.lastname);
      formData.append('email', credentials.email);
      formData.append('password', credentials.password);
      formData.append('role', 'Visiteur'); // Default roleace 'signup' with your actual signup function
      const result = await fetch(`/api/auth/signup`, {
        method: 'POST',
       
        body: formData,
      });

      const data = await result.json();

      if (result.ok) {
        const result = await signIn('credentials', {
          redirect: false,
          email: credentials.email,
          password: credentials.password,
        });
        if (result?.ok) {
          router.push('/');
        } else {
          setError('Failed to sign in. Please check your email and password and try again.');
        } // Redirect on successful signup
      } else {
        setError(data.message || 'An error occurred. Please try again.');
      }
    } catch (error) {
      setError("An error occurred. Please try again.");
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen relative bg-gray-100">
      <div className="bg-black/60 opacity-80 absolute h-full w-full"></div>
      <Image className="w-full h-screen object-cover" src={pic4} alt="Background Image" />
      <div className="bg-white absolute p-8 rounded shadow-md w-full max-md:w-3/4 max-w-md">
        <h1 className="text-2xl max-md:text-xl text-center font-bold mb-6">Sign Up for an Account</h1>
        {error && (
          <div className="bg-red-500 text-white p-3 rounded mb-4 text-center">
            {error}
          </div>
        )}
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="name">
              Name
            </label>
            <input
              type="text"
              name="name"
              placeholder="Name"
              value={credentials.name}
              onChange={handleChange}
              className="shadow appearance-none border rounded-lg w-full py-2 px-3 text-gray-700 bg-gray-200 leading-tight focus:outline-none focus:shadow-outline"
              required
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="lastname">
              Last Name
            </label>
            <input
              type="text"
              name="lastname"
              placeholder="Last Name"
              value={credentials.lastname}
              onChange={handleChange}
              className="shadow appearance-none border rounded-lg w-full py-2 px-3 text-gray-700 bg-gray-200 leading-tight focus:outline-none focus:shadow-outline"
              required
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="email">
              Email
            </label>
            <input
              type="email"
              name="email"
              placeholder="name@company.com"
              value={credentials.email}
              onChange={handleChange}
              className="shadow appearance-none border rounded-lg w-full py-2 px-3 text-gray-700 bg-gray-200 leading-tight focus:outline-none focus:shadow-outline"
              required
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="password">
              Password
            </label>
            <input
              type={showPassword ? "text" : "password"}
              name="password"
              placeholder="•••••••••"
              value={credentials.password}
              onChange={handleChange}
              className="shadow appearance-none border rounded-lg w-full py-2 px-3 text-gray-700 bg-gray-200 leading-tight focus:outline-none focus:shadow-outline"
              required
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="repeatPassword">
              Repeat Password
            </label>
            <input
              type={showPassword ? "text" : "password"}
              name="repeatPassword"
              placeholder="•••••••••"
              value={credentials.repeatPassword}
              onChange={handleChange}
              className="shadow appearance-none border rounded-lg w-full py-2 px-3 text-gray-700 bg-gray-200 leading-tight focus:outline-none focus:shadow-outline"
              required
            />
          </div>
          <div className="flex justify-between items-center max-md:text-xs mb-4">
            <div className="flex items-center h-5">
              <input
                id="showPassword"
                type="checkbox"
                checked={showPassword}
                onChange={() => setShowPassword(!showPassword)}
                className="w-5 h-5 rounded bg-gray-400"
                aria-label="Show Password"
              />
              <label htmlFor="showPassword" className="ms-2 font-bold text-gray-700">Show Password</label>
            </div>
          </div>
          <div className="flex flex-col gap-2 items-center justify-between">
            <button
              type="submit"
              className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 w-full rounded-lg focus:outline-none focus:shadow-outline"
            >
              Sign Up
            </button>
           
            <button
              type="button"
              onClick={() => router.push('/signin')}
              className="text-blue-600 hover:text-blue-400 font-bold py-2 px-4 w-full focus:shadow-outline"
            >
              Have an account? Sign In
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Signup;
