import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Shield } from 'lucide-react';

interface RegisterFormProps {
  onSwitchToLogin: () => void;
}

const RegisterForm: React.FC<RegisterFormProps> = ({ onSwitchToLogin }) => {
  const navigate = useNavigate();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    navigate('/user-type');
  };

  return (
    <div className="w-full max-w-md px-8 py-10 bg-white rounded-xl shadow-md animate-fade-in">
      <div className="flex flex-col items-center justify-center mb-6">
        <Shield className="w-12 h-12 text-safehaven-primary mb-2" />
        <h1 className="text-2xl font-bold text-safehaven-primary">SafeHaven</h1>
        <p className="text-safehaven-neutral-gray text-sm">Your digital shield</p>
      </div>

      <h2 className="text-xl font-semibold mb-6 text-center">Create Your Account</h2>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="name" className="safehaven-label">Full Name</label>
          <Input
            id="name"
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="safehaven-input"
            placeholder="Your full name"
            required
          />
        </div>
        
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
        
        <div>
          <label htmlFor="confirmPassword" className="safehaven-label">Confirm Password</label>
          <Input
            id="confirmPassword"
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            className="safehaven-input"
            placeholder="••••••••"
            required
          />
        </div>
        
        <Button 
          type="submit" 
          className="safehaven-btn safehaven-btn-primary w-full"
        >
          Register
        </Button>
      </form>
      
      <div className="mt-6 text-center">
        <p className="text-safehaven-neutral-gray text-sm">
          Already have an account?{' '}
          <button
            onClick={onSwitchToLogin}
            className="text-safehaven-primary font-medium hover:underline"
          >
            Login
          </button>
        </p>
      </div>
    </div>
  );
};

export default RegisterForm;