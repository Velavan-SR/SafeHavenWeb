// src/pages/NotificationsPage.tsx
import React from 'react';
import { Bell } from 'lucide-react';
import { Card } from "@/components/ui/card";

export default function NotificationsPage() {
  return (
    <div className="container mx-auto py-8 px-4">
      <h1 className="text-3xl font-bold mb-6">Notifications</h1>
      
      <Card className="p-8 text-center">
        <Bell className="w-12 h-12 mx-auto mb-4 text-gray-400" />
        <h2 className="text-xl font-semibold mb-2">No Notifications Yet</h2>
        <p className="text-gray-500">
          You don't have any notifications at the moment. 
          Notifications about your safety alerts and counseling sessions will appear here.
        </p>
      </Card>
    </div>
  );
}