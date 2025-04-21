
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Calendar, Clock, Globe, MessageCircle, Phone, Star, Video } from 'lucide-react';
import { counselors } from '@/data/mockData';
import CounselorModal from './CounselorModal';

const CounselorList: React.FC = () => {
  const [selectedCounselor, setSelectedCounselor] = useState(null);
  
  const handleOpenModal = (counselor: any) => {
    setSelectedCounselor(counselor);
  };
  
  const handleCloseModal = () => {
    setSelectedCounselor(null);
  };

  return (
    <div className="w-full">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-safehaven-primary">Professional Counselors</h2>
        <p className="text-safehaven-neutral-gray">
          Connect with experienced counselors for virtual counseling sessions
        </p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {counselors.map((counselor) => (
          <Card key={counselor.id} className="overflow-hidden hover:shadow-lg transition-shadow">
            <div className="bg-safehaven-soft-purple h-24 relative">
              <div className="absolute -bottom-12 left-6">
                <img
                  src={counselor.image}
                  alt={counselor.name}
                  className="w-24 h-24 rounded-full border-4 border-white object-cover"
                />
              </div>
            </div>
            
            <CardHeader className="pt-16 pb-2">
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle>{counselor.name}</CardTitle>
                  <CardDescription>{counselor.title}</CardDescription>
                </div>
                <Badge className="bg-safehaven-primary">
                  <Star className="h-3 w-3 mr-1" />
                  {counselor.rating}
                </Badge>
              </div>
            </CardHeader>
            
            <CardContent className="pb-2">
              <div className="flex flex-wrap gap-1 mb-3">
                {counselor.languages.map((language, index) => (
                  <Badge key={index} variant="outline" className="bg-safehaven-soft-purple/50">
                    <Globe className="h-3 w-3 mr-1" />
                    {language}
                  </Badge>
                ))}
              </div>
              
              <div className="text-sm text-safehaven-neutral-gray space-y-1">
                <div className="flex items-center">
                  <Clock className="h-4 w-4 mr-2 text-safehaven-primary" />
                  Experience: {counselor.experience}
                </div>
                <div className="flex items-center">
                  <Calendar className="h-4 w-4 mr-2 text-safehaven-primary" />
                  Available: {counselor.availability}
                </div>
              </div>
            </CardContent>
            
            <CardFooter className="grid grid-cols-3 gap-2 pt-2">
              <Button
                variant="outline"
                className="text-safehaven-primary border-safehaven-primary"
                size="sm"
              >
                <Phone className="h-4 w-4 mr-1" />
                Call
              </Button>
              
              <Button
                variant="outline"
                className="text-safehaven-primary border-safehaven-primary"
                size="sm"
              >
                <Video className="h-4 w-4 mr-1" />
                Video
              </Button>
              
              <Button
                variant="outline"
                className="text-safehaven-primary border-safehaven-primary"
                size="sm"
              >
                <MessageCircle className="h-4 w-4 mr-1" />
                Chat
              </Button>
              
              <Button
                className="col-span-3 bg-safehaven-primary text-white"
                onClick={() => handleOpenModal(counselor)}
              >
                View Profile & Book Session
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>
      
      {selectedCounselor && (
        <CounselorModal counselor={selectedCounselor} onClose={handleCloseModal} />
      )}
    </div>
  );
};

export default CounselorList;
