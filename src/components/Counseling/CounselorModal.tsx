// src/components/Counseling/CounselorModal.tsx
import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Calendar } from "@/components/ui/calendar";
import { format } from "date-fns";
import { Calendar as CalendarIcon } from "lucide-react";
import { toast } from 'sonner';

interface CounselorModalProps {
  counselor: any; // Replace with proper type
  onClose: () => void;
}

const CounselorModal: React.FC<CounselorModalProps> = ({ counselor, onClose }) => {
  const [date, setDate] = React.useState<Date | undefined>(undefined);

  if (!counselor) return null;

  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Schedule Session</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4">
          <div className="flex items-center space-x-4">
            <Avatar className="h-12 w-12">
              <AvatarImage src={counselor.image} />
              <AvatarFallback>{counselor.name[0]}</AvatarFallback>
            </Avatar>
            <div>
              <h3 className="font-semibold">{counselor.name}</h3>
              <p className="text-sm text-gray-500">{counselor.specialization}</p>
            </div>
          </div>

          <div className="border rounded-lg p-4">
            <h4 className="font-medium mb-2">Select Date</h4>
            <Calendar
              mode="single"
              selected={date}
              onSelect={setDate}
              className="rounded-md border"
            />
          </div>

          <div className="space-y-2">
            <h4 className="font-medium">Available Time Slots</h4>
            <div className="grid grid-cols-3 gap-2">
              {["9:00 AM", "10:00 AM", "11:00 AM", "2:00 PM", "3:00 PM", "4:00 PM"].map((time) => (
                <Button
                  key={time}
                  variant="outline"
                  className="w-full"
                >
                  {time}
                </Button>
              ))}
            </div>
          </div>

          <div className="flex justify-end space-x-2 pt-4">
            <Button variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button onClick={() => {
              toast.success("Session scheduled successfully!");
              onClose();
            }}>
              Schedule Session
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default CounselorModal;