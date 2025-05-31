import React, { useState } from 'react';
import {loginUser} from '../../firebase/auth.action';
import { Eye, EyeOff } from 'lucide-react';  // Make sure you have lucide-react installed
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../lib/auth-context';

export default function SignIn() {
  const { setIsAuthenticated } = useAuth();

  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false); 

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    try {
      const user = await loginUser({ email, password });
  
      if (!user.success) {
        setError(user.message);
        return; 
      }
  
      localStorage.setItem('user', JSON.stringify(user.user));
      setIsAuthenticated(true);
      navigate('/dashboard/blogs');
      console.log('User logged in successfully', user.user);
  
    } catch (err: any) {
      setError(err.message);
      console.error('Login failed:', err);
    }
  };

 
  return (
    <div className="h-screen w-full flex flex-col items-center justify-center  dark:bg-[#19001c] p-4">
      <h2 className="text-3xl font-bold text-black dark:text-[#e0c1ff] mb-6">Sign In</h2>
      <form
        onSubmit={handleSignIn}
        className="w-full max-w-md dark:bg-[#2e1a3e] p-8 rounded-lg shadow-lg text-[#d6baff] border border-pre space-y-6"
      >
        <div>
          <label htmlFor="email" className="block mb-2 font-medium text-[#3b2a5a] dark:text-white">
            Email:
          </label>
          <input
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="w-full text-[#3b2a5a] dark:text-white  px-4 py-2 rounded border border-[#6b4f9a] dark:bg-[#3b2a5a] focus:outline-none focus:ring-2 focus:ring-[#a07be1] "
          />
        </div>
        <div className="relative">
          <label htmlFor="password" className="block mb-2 font-medium text-[#3b2a5a] dark:text-white">
            Password:
          </label>
          <input
            type={showPassword ? 'text' : 'password'}
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="w-full text-[#3b2a5a] dark:text-white px-4 py-2 pr-10 rounded border border-[#6b4f9a] dark:bg-[#3b2a5a] focus:outline-none focus:ring-2 focus:ring-[#a07be1]"
          />
          <button
            type="button"
            onClick={() => setShowPassword((v) => !v)}
            className="absolute right-3 top-11 text-[#a07be1] hover:text-[#d0bfff] focus:outline-none"
            tabIndex={-1} // Don't focus on tab to avoid UX issues
            aria-label={showPassword ? 'Hide password' : 'Show password'}
          >
            {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
          </button>
        </div>
        {error && (
          <p className="text-red-500 text-sm mt-2">
            {error}
          </p>
        )}
        <button
          type="submit"
          className="w-full bg-[#6b4f9a] hover:bg-[#a07be1] text-white py-2 rounded transition-colors duration-300 font-semibold"
        >
          Sign In
        </button>
      
      </form>

    
    </div>
  );
}
