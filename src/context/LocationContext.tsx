// src/context/LocationContext.tsx
import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { toast } from 'sonner';

interface Location {
  latitude: number;
  longitude: number;
}

interface LocationContextType {
  location: Location | null;
  startTracking: () => void;
  stopTracking: () => void;
}

const LocationContext = createContext<LocationContextType | undefined>(undefined);

export const LocationProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [location, setLocation] = useState<Location | null>(null);
  const [watchId, setWatchId] = useState<number | null>(null);

  const startTracking = useCallback(() => {
    if (!navigator.geolocation) {
      toast.error('Geolocation is not supported by your browser');
      return;
    }

    const id = navigator.geolocation.watchPosition(
      (position) => {
        setLocation({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
        });
      },
      (error) => {
        toast.error('Unable to get your location. Please enable location services.');
        console.error('Error getting location:', error);
      },
      {
        enableHighAccuracy: true,
        timeout: 5000,
        maximumAge: 0,
      }
    );

    setWatchId(id);
  }, []);

  const stopTracking = useCallback(() => {
    if (watchId !== null) {
      navigator.geolocation.clearWatch(watchId);
      setWatchId(null);
    }
  }, [watchId]);

  useEffect(() => {
    return () => {
      stopTracking();
    };
  }, [stopTracking]);

  return (
    <LocationContext.Provider value={{ location, startTracking, stopTracking }}>
      {children}
    </LocationContext.Provider>
  );
};

export const useLocation = () => {
  const context = useContext(LocationContext);
  if (context === undefined) {
    throw new Error('useLocation must be used within a LocationProvider');
  }
  return context;
};