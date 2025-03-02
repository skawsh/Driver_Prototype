
import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { MapPin, Phone, WashingMachine } from 'lucide-react';
import { Button } from '@/components/ui/button';

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

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 p-4">
      <div className="w-full max-w-md bg-white rounded-[40px] border-2 border-gray-200 shadow-lg overflow-hidden p-6">
        <div className="flex justify-between items-center mb-4">
          <div className="text-xl font-bold">
            ID {taskData.id}
          </div>
          <div className="flex items-center">
            <MapPin className="h-4 w-4 text-blue-500 mr-1" />
            <span className="text-blue-500 font-medium">{taskData.distance}</span>
          </div>
        </div>
        
        <div className="flex items-center mb-5">
          <WashingMachine className="h-6 w-6 mr-2" />
          <span className="text-2xl font-bold">{taskData.customerName}</span>
        </div>
        
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
          className="flex items-start space-x-2 mb-6 text-blue-500 hover:underline"
        >
          <Phone className="h-5 w-5 text-blue-500 mt-0.5 shrink-0" />
          <span>{taskData.mobileNumber}</span>
        </a>
        
        <Button 
          className="w-full py-3 px-4 bg-green-500 hover:bg-green-600 text-white font-medium rounded-md mb-4"
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
  );
};

export default TaskSuccessPage;
