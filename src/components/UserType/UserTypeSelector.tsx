import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Card } from '@/components/ui/card';
import { UserCircle, Baby } from 'lucide-react';

const UserTypeSelector: React.FC = () => {
  const navigate = useNavigate();

  const handleTypeSelection = (type: 'woman' | 'child') => {
    const userEmail = localStorage.getItem('userEmail');
    const userName = localStorage.getItem('userName');
    
    // Set user type in localStorage
    localStorage.setItem('userType', type);
    
    // Set default emergency contacts in a cookie specific to this user
    const defaultContacts = [
      {
        name: 'Emergency Police',
        relation: 'Emergency Service',
        phone: '100'
      },
      {
        name: 'Women Helpline',
        relation: 'Emergency Service',
        phone: '1091'
      },
      {
        name: 'Child Helpline',
        relation: 'Emergency Service',
        phone: '1098'
      }
    ];

    // Create a unique cookie name for this user's contacts
    const cookieName = `emergencyContacts_${userEmail}`;
    document.cookie = `${cookieName}=${JSON.stringify(defaultContacts)}; path=/; max-age=31536000`; // 1 year expiry

    navigate('/dashboard', { replace: true });
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 p-4">
      <h1 className="text-3xl font-bold text-safehaven-primary mb-8">I am a...</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl w-full">
        {/* Woman Card */}
        <Card 
          className="p-6 cursor-pointer hover:shadow-lg transition-shadow flex flex-col items-center justify-center space-y-4"
          onClick={() => handleTypeSelection('woman')}
        >
          <UserCircle className="h-24 w-24 text-safehaven-primary" />
          <h2 className="text-2xl font-semibold text-center">I'm a Woman</h2>
          <p className="text-safehaven-neutral-gray text-center">
            Access resources and support specifically designed for women's safety and empowerment.
          </p>
        </Card>

        {/* Child Card */}
        <Card 
          className="p-6 cursor-pointer hover:shadow-lg transition-shadow flex flex-col items-center justify-center space-y-4"
          onClick={() => handleTypeSelection('child')}
        >
          <Baby className="h-24 w-24 text-safehaven-primary" />
          <h2 className="text-2xl font-semibold text-center">I'm a Child</h2>
          <p className="text-safehaven-neutral-gray text-center">
            Get help and protection with child-friendly resources and emergency assistance.
          </p>
        </Card>
      </div>
    </div>
  );
};

export default UserTypeSelector;