import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Shield } from 'lucide-react';
import { toast } from 'sonner';

interface LoginFormProps {
  onSwitchToRegister: () => void;
}

const LoginForm: React.FC<LoginFormProps> = ({ onSwitchToRegister }) => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Check if user type exists
    const userData = {
      email,
      password,
      isAuthenticated: true
    };

    // Store in localStorage
    localStorage.setItem('userData', JSON.stringify(userData));
    localStorage.setItem('isAuthenticated', 'true');

    toast.success('Logged in successfully!');
    navigate('/user-type', { replace: true });
  };

  return (
    <div className="w-full max-w-md px-8 py-10 bg-white rounded-xl shadow-md animate-fade-in">
      <div className="flex flex-col items-center justify-center mb-6">
        <Shield className="w-12 h-12 text-safehaven-primary mb-2" />
        <h1 className="text-2xl font-bold text-safehaven-primary">SafeHaven</h1>
        <p className="text-safehaven-neutral-gray text-sm">Your digital shield</p>
      </div>

      <h2 className="text-xl font-semibold mb-6 text-center">Welcome Back</h2>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="email" className="safehaven-label">Email</label>
          <Input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="safehaven-input"
            placeholder="you@example.com"
            required
          />
        </div>
        
        <div>
          <label htmlFor="password" className="safehaven-label">Password</label>
          <Input
            id="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="safehaven-input"
            placeholder="••••••••"
            required
          />
        </div>
        
        <Button 
          type="submit" 
          className="safehaven-btn safehaven-btn-primary w-full"
        >
          Login
        </Button>
      </form>
      
      <div className="mt-6 text-center">
        <p className="text-safehaven-neutral-gray text-sm">
          Don't have an account?{' '}
          <button
            onClick={onSwitchToRegister}
            className="text-safehaven-primary font-medium hover:underline"
          >
            Register
          </button>
        </p>
      </div>
    </div>
  );
};

export default LoginForm;