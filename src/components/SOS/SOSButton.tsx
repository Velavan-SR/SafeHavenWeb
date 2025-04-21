import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { AlertCircle } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { toast } from 'sonner';
import { useLocation as useLocationContext } from '@/context/LocationContext';

interface SOSButtonProps {
  size?: 'sm' | 'lg';
  className?: string;
}

const SOSButton: React.FC<SOSButtonProps> = ({ size = 'sm', className = '' }) => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const { location } = useLocationContext();
  const [isAlertSent, setIsAlertSent] = useState(false);

  const handleSendAlert = () => {
    if (!location) {
      toast.error('Unable to get your location. Please enable location services.');
      return;
    }

    // Get user details
    const userName = localStorage.getItem('userName');
    const userType = localStorage.getItem('userType');
    const userEmail = localStorage.getItem('userEmail');

    // Get emergency contacts from cookies
    const cookieName = `emergencyContacts_${userEmail}`;
    const cookieValue = document.cookie
      .split('; ')
      .find(row => row.startsWith(`${cookieName}=`))
      ?.split('=')[1];
    
    const emergencyContacts = cookieValue ? JSON.parse(decodeURIComponent(cookieValue)) : [];

    // Simulate sending alerts to emergency contacts
    emergencyContacts.forEach(contact => {
      console.log(`Alert sent to ${contact.name} (${contact.phone})`);
    });

    setIsAlertSent(true);
    toast.success('Emergency alert has been sent to all your emergency contacts');

    // In a real application, you would send this data to your backend
    const alertData = {
      user: {
        name: userName,
        type: userType,
        email: userEmail
      },
      location: {
        latitude: location.latitude,
        longitude: location.longitude
      },
      timestamp: new Date().toISOString(),
      emergencyContacts
    };

    console.log('Alert Data:', alertData);
  };

  return (
    <>
      <Button
        variant="destructive"
        size={size}
        className={`bg-red-600 hover:bg-red-700 ${className}`}
        onClick={() => setIsDialogOpen(true)}
      >
        <AlertCircle className="h-5 w-5 mr-2" />
        Alert
      </Button>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle className="text-red-600 flex items-center gap-2">
              <AlertCircle className="h-5 w-5" />
              Emergency Alert Confirmation
            </DialogTitle>
            {!isAlertSent ? (
              <DialogDescription>
                Are you sure you want to send an emergency alert? This will notify all your emergency contacts with your current location.
              </DialogDescription>
            ) : (
              <DialogDescription className="space-y-4">
                <div className="bg-green-50 p-4 rounded-md border border-green-200">
                  <p className="text-green-800 font-medium">Alert Sent Successfully!</p>
                  <p className="text-green-600 mt-2">Your current location:</p>
                  <div className="mt-2 text-sm text-green-700">
                    <p>Latitude: {location?.latitude}</p>
                    <p>Longitude: {location?.longitude}</p>
                  </div>
                </div>
                <p className="text-sm text-gray-500">
                  Emergency services and your contacts have been notified. Stay safe and if possible, move to a secure location.
                </p>
              </DialogDescription>
            )}
          </DialogHeader>

          <DialogFooter className="sm:justify-start">
            {!isAlertSent ? (
              <>
                <Button
                  variant="destructive"
                  onClick={handleSendAlert}
                  className="bg-red-600 hover:bg-red-700"
                >
                  Send Alert
                </Button>
                <Button
                  variant="outline"
                  onClick={() => setIsDialogOpen(false)}
                >
                  Cancel
                </Button>
              </>
            ) : (
              <Button
                variant="outline"
                onClick={() => {
                  setIsDialogOpen(false);
                  setIsAlertSent(false);
                }}
              >
                Close
              </Button>
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default SOSButton;
