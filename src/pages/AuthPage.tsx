import React, { useState } from 'react';
import LoginForm from '@/components/Auth/LoginForm';
import RegisterForm from '@/components/Auth/RegisterForm';

const AuthPage: React.FC = () => {
  const [isLogin, setIsLogin] = useState(true);

  const toggleAuthMode = () => {
    setIsLogin(!isLogin);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-safehaven-soft-purple to-white p-4">
      {isLogin ? (
        <LoginForm onSwitchToRegister={toggleAuthMode} />
      ) : (
        <RegisterForm onSwitchToLogin={toggleAuthMode} />
      )}
    </div>
  );
};

export default AuthPage;