
import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { MapPin, Phone, WashingMachine, ArrowLeft, Clock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

const TaskSuccessPage = () => {
  const { taskId, orderId } = useParams<{ taskId: string; orderId: string }>();
  const navigate = useNavigate();

  // This would typically come from an API or context in a real app
  const taskData = {
    id: orderId || "123456P",
    customerName: "Saiteja",
    address: "320f, Deepa PG, Sector 21, Gurugram",
    mobileNumber: "8197739892",
    distance: "1.4 Km"
  };

  const handleViewDetails = () => {
    navigate('/');
  };

  const handleLocationReached = () => {
    navigate('/');
  };
  
  const handleBack = () => {
    navigate(-1); // Go back to previous page
  };
  
  const handleSnooze = () => {
    toast.info("Task snoozed for 15 minutes", {
      description: "You'll be reminded again soon"
    });
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-lg mx-auto">
        {/* Header with back button */}
        <div className="flex items-center mb-6">
          <Button variant="ghost" size="icon" onClick={handleBack} className="mr-2">
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <h1 className="text-xl font-semibold">Task Details</h1>
        </div>
        
        {/* Task details section */}
        <div className="bg-white rounded-xl shadow-md p-6 mb-4">
          <div className="flex justify-between items-center mb-4">
            <div className="text-xl font-bold">
              ID {taskData.id}
            </div>
            <div className="flex items-center gap-3">
              <div className="flex items-center">
                <MapPin className="h-4 w-4 text-blue-500 mr-1" />
                <span className="text-blue-500 font-medium">{taskData.distance}</span>
              </div>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Clock 
                    className="h-5 w-5 text-blue-500 cursor-pointer hover:text-blue-600" 
                    onClick={handleSnooze}
                  />
                </TooltipTrigger>
                <TooltipContent>
                  <p>Snooze this task</p>
                </TooltipContent>
              </Tooltip>
            </div>
          </div>
          
          <div className="flex items-center mb-5">
            <WashingMachine className="h-6 w-6 mr-2" />
            <span className="text-2xl font-bold">{taskData.customerName}</span>
          </div>
        </div>
        
        {/* Contact information section */}
        <div className="bg-white rounded-xl shadow-md p-6 mb-4">
          <a 
            href={`https://maps.google.com/?q=${taskData.address}`} 
            target="_blank" 
            rel="noopener noreferrer"
            className="flex items-start space-x-2 mb-4 text-blue-500 hover:underline"
          >
            <MapPin className="h-5 w-5 text-blue-500 mt-0.5 shrink-0" />
            <span className="break-all">{taskData.address}</span>
          </a>
          
          <a 
            href={`tel:${taskData.mobileNumber}`}
            className="flex items-start space-x-2 text-blue-500 hover:underline"
          >
            <Phone className="h-5 w-5 text-blue-500 mt-0.5 shrink-0" />
            <span>{taskData.mobileNumber}</span>
          </a>
        </div>
        
        {/* Action buttons section */}
        <div className="space-y-4">
          <Button 
            className="w-full py-3 px-4 bg-green-500 hover:bg-green-600 text-white font-medium rounded-md"
            onClick={handleViewDetails}
          >
            View details
          </Button>
          
          <Button 
            className="w-full h-12 text-lg font-semibold bg-blue-500 hover:bg-blue-600 rounded-full"
            onClick={handleLocationReached}
          >
            Location reached
          </Button>
        </div>
      </div>
    </div>
  );
};

export default TaskSuccessPage;
