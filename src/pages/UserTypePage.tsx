import React from 'react';
import UserTypeSelector from '@/components/UserType/UserTypeSelector';

const UserTypePage: React.FC = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-safehaven-soft-purple to-white p-4">
      <UserTypeSelector />
    </div>
  );
};

export default UserTypePage;