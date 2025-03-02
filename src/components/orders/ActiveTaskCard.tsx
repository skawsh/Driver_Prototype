
import React from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { X, Clock, MapPin, WashingMachine, Route, Phone } from 'lucide-react';
import { SubTask } from '@/types/task';
import { toast } from 'sonner';

interface ActiveTaskCardProps {
  inProgressTask: SubTask;
  parentTaskOrderNumber: string;
  onLocationReached: () => void;
  onCancel: () => void;
  onSnooze: (taskId: string) => void;
  onReportIssue: () => void;
}

const ActiveTaskCard = ({
  inProgressTask,
  parentTaskOrderNumber,
  onLocationReached,
  onCancel,
  onSnooze,
  onReportIssue
}: ActiveTaskCardProps) => {
  const navigate = useNavigate();

  const viewDetails = () => {
    navigate(`/task/${inProgressTask.id}/${parentTaskOrderNumber}`);
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.3 }}
    >
      <Card className="overflow-hidden rounded-3xl border-2 border-primary shadow-lg relative">
        <CardContent className="p-0">
          <div className="p-4">
            <div className="flex justify-between items-start mb-4">
              <div className="flex items-center">
                <div className="text-lg font-semibold mr-2">
                  ID {parentTaskOrderNumber}P
                </div>
                <MapPin className="h-4 w-4 text-sky-400" />
              </div>
              <Button
                variant="ghost"
                size="icon"
                className="h-6 w-6 p-0"
                onClick={onCancel}
              >
                <X className="h-5 w-5" />
              </Button>
            </div>
            
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center">
                <WashingMachine className="h-5 w-5 mr-2" />
                <span className="text-xl font-bold">{inProgressTask.customerName}</span>
              </div>
              <div className="flex items-center">
                <Clock 
                  className="h-5 w-5 clock-icon mr-3" 
                  onClick={() => onSnooze(inProgressTask.id)}
                  aria-label="Snooze this task for 30 minutes"
                />
                <div className="flex items-center text-sky-400 font-medium">
                  <Route className="h-4 w-4 mr-1" />
                  {inProgressTask.distance !== undefined ? inProgressTask.distance : 0} Km
                </div>
              </div>
            </div>
            
            <a 
              href={`https://maps.google.com/?q=${inProgressTask.location.latitude},${inProgressTask.location.longitude}`} 
              target="_blank" 
              rel="noopener noreferrer"
              className="flex items-start space-x-2 mb-3 text-blue-500 hover:underline"
            >
              <MapPin className="h-5 w-5 text-blue-500 mt-0.5" />
              <span className="break-all">{inProgressTask.location.address}</span>
            </a>
            
            {inProgressTask.mobileNumber && (
              <a 
                href={`tel:${inProgressTask.mobileNumber}`}
                className="flex items-start space-x-2 mb-4 text-blue-500 hover:underline"
              >
                <Phone className="h-5 w-5 text-blue-500 mt-0.5" />
                <span>{inProgressTask.mobileNumber.replace(/\+91 /, '')}</span>
              </a>
            )}
            
            <div className="grid grid-cols-1 gap-3 mt-4">
              <Button 
                variant="destructive"
                className="rounded-xl"
                onClick={onReportIssue}
              >
                Report issue
              </Button>
              
              <Button 
                className="location-reached-button w-full h-12 text-lg font-semibold"
                onClick={onLocationReached}
              >
                Location reached
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default ActiveTaskCard;
