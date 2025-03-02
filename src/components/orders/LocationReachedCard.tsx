
import React from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { MapPin, WashingMachine, Phone } from 'lucide-react';
import { SubTask } from '@/types/task';

interface LocationReachedCardProps {
  reachedTask: SubTask;
  parentTaskOrderNumber: string;
  onComplete: (taskId: string) => void;
}

const LocationReachedCard = ({
  reachedTask,
  parentTaskOrderNumber,
  onComplete
}: LocationReachedCardProps) => {
  const navigate = useNavigate();

  const viewDetails = () => {
    navigate(`/task/${reachedTask.id}/${parentTaskOrderNumber}`);
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.3 }}
    >
      <Card className="overflow-hidden rounded-3xl border-2 border-primary shadow-lg">
        <CardContent className="p-0">
          <div className="p-4">
            <div className="flex justify-between items-start mb-4">
              <div className="text-lg font-semibold">
                ID {parentTaskOrderNumber}P
              </div>
              <div className="distance-container">
                <div className="flex items-center text-sky-400 font-medium">
                  <MapPin className="h-4 w-4 mr-1" />
                  {reachedTask.distance !== undefined ? reachedTask.distance : 0} Km
                </div>
              </div>
            </div>
            
            <div className="flex items-center mb-4">
              <WashingMachine className="h-5 w-5 mr-2" />
              <span className="text-xl font-bold">{reachedTask.customerName}</span>
            </div>
            
            <a 
              href={`https://maps.google.com/?q=${reachedTask.location.latitude},${reachedTask.location.longitude}`} 
              target="_blank" 
              rel="noopener noreferrer"
              className="flex items-start space-x-2 mb-3 text-blue-500 hover:underline"
            >
              <MapPin className="h-5 w-5 text-blue-500 mt-0.5" />
              <span className="break-all">{reachedTask.location.address}</span>
            </a>
            
            {reachedTask.mobileNumber && (
              <a 
                href={`tel:${reachedTask.mobileNumber}`}
                className="flex items-start space-x-2 mb-4 text-blue-500 hover:underline"
              >
                <Phone className="h-5 w-5 text-blue-500 mt-0.5" />
                <span>{reachedTask.mobileNumber.replace(/\+91 /, '')}</span>
              </a>
            )}
            
            <div className="grid grid-cols-2 gap-3 mt-4">
              <Button 
                variant="outline"
                className="rounded-xl bg-green-100 hover:bg-green-200"
                onClick={viewDetails}
              >
                View details
              </Button>
              
              <Button 
                className="location-reached-button w-full h-12 text-lg font-semibold"
                onClick={() => onComplete(reachedTask.id)}
              >
                Confirm completion
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default LocationReachedCard;
