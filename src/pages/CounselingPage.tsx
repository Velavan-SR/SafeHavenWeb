
import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import Navigation from '@/components/Layout/Navigation';
import CounselorList from '@/components/Counseling/CounselorList';
import SOSPanel from '@/components/SOS/SOSPanel';
import { useSOSAlert } from '@/context/SOSContext';

const CounselingPage: React.FC = () => {
  const { isSOSActive } = useSOSAlert();
  const navigate = useNavigate();

  // For both GamesPage.tsx and CounselingPage.tsx, replace the useEffect with:
useEffect(() => {
  const userType = localStorage.getItem('userType');
  if (!userType) {
    navigate('/user-type', { replace: true });
  }
}, [navigate]);

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">   
      
      {isSOSActive && <SOSPanel />}
      
      <main className="flex-grow p-4 md:p-8">
        <div className="max-w-7xl mx-auto">
          <CounselorList />
        </div>
      </main>
    </div>
  );
};

export default CounselingPage;
