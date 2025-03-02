import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, MapPin, Phone, AlertCircle, Clock, WashingMachine } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { toast } from 'sonner';
import { Task, SubTask } from '@/types/task';

const mockTasks: Record<string, Task> = {
  "task1": {
    id: "task1",
    orderNumber: "1234",
    items: 3,
    subtasks: [
      {
        id: "task1-pickup",
        type: "pickup",
        status: "pending",
        enabled: true,
        customerName: "Saiteja",
        mobileNumber: "8197739892",
        location: {
          latitude: 17.4100,
          longitude: 78.4600,
          address: "320f, Deepa PG, Sector 21, Gurugram"
        },
        distance: 1.4
      },
      {
        id: "task1-drop",
        type: "drop",
        status: "pending",
        enabled: false,
        customerName: "Raj Sharma",
        mobileNumber: "+91 98765 43210",
        location: {
          latitude: 17.4100,
          longitude: 78.5000,
          address: "Laundry Studio, HITEC City, Hyderabad, Telangana 500081"
        }
      }
    ],
    status: "pending"
  },
};

const TaskDetails = () => {
  const { taskId, orderId } = useParams<{ taskId: string; orderId: string }>();
  const navigate = useNavigate();
  const [task, setTask] = useState<SubTask | null>(null);
  const [parentTask, setParentTask] = useState<Task | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!taskId) return;
    
    for (const [_, taskData] of Object.entries(mockTasks)) {
      const subtask = taskData.subtasks.find(st => st.id === taskId);
      if (subtask) {
        setTask(subtask);
        setParentTask(taskData);
        break;
      }
    }
    
    setLoading(false);
  }, [taskId]);

  const handleBack = () => {
    navigate('/');
  };

  const reportIssue = () => {
    navigate(`/report-issue/${taskId}/${orderId}`);
  };

  const locationReached = () => {
    toast.success("Location reached!", {
      description: "Task marked as complete.",
    });
    setTimeout(() => {
      navigate(`/task-success/${taskId}/${orderId}`);
    }, 1500);
  };

  if (loading) {
    return (
      <div className="h-screen w-full flex items-center justify-center">
        <div className="animate-pulse text-lg">Loading...</div>
      </div>
    );
  }

  if (!task || !parentTask) {
    return (
      <div className="h-screen w-full p-4">
        <div className="flex items-center mb-4">
          <Button variant="ghost" size="icon" onClick={handleBack}>
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <h1 className="text-lg font-semibold ml-2">Task not found</h1>
        </div>
        <Card className="p-6">
          <p>The requested task could not be found.</p>
        </Card>
      </div>
    );
  }

  return (
    <div className="h-screen w-full bg-gray-50 p-4">
      <div className="flex items-center mb-6">
        <Button variant="ghost" size="icon" onClick={handleBack}>
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <h1 className="text-xl font-semibold ml-2">Task Details</h1>
      </div>
      
      <Card className="overflow-hidden rounded-3xl border-2 border-primary shadow-lg max-w-md mx-auto">
        <div className="p-6">
          <div className="flex justify-between items-center mb-4">
            <div className="text-xl font-bold">
              ID {orderId}P
            </div>
            <div className="flex items-center">
              <MapPin className="h-4 w-4 text-blue-500 mr-1" />
              <span className="text-blue-500 font-medium">{task.distance} Km</span>
              <Clock className="h-5 w-5 text-gray-400 ml-3" />
            </div>
          </div>
          
          <div className="flex items-center mb-5">
            <WashingMachine className="h-6 w-6 mr-2" />
            <span className="text-2xl font-bold">{task.customerName}</span>
          </div>
          
          <a 
            href={`https://maps.google.com/?q=${task.location.latitude},${task.location.longitude}`} 
            target="_blank" 
            rel="noopener noreferrer"
            className="flex items-start space-x-2 mb-4 text-blue-500 hover:underline"
          >
            <MapPin className="h-5 w-5 text-blue-500 mt-0.5 shrink-0" />
            <span className="break-all">{task.location.address}</span>
          </a>
          
          <a 
            href={`tel:${task.mobileNumber}`}
            className="flex items-start space-x-2 mb-6 text-blue-500 hover:underline"
          >
            <Phone className="h-5 w-5 text-blue-500 mt-0.5 shrink-0" />
            <span>{task.mobileNumber}</span>
          </a>
          
          <Button 
            variant="destructive"
            className="mb-4 w-full"
            onClick={reportIssue}
          >
            <AlertCircle className="mr-2 h-4 w-4" />
            Report issue
          </Button>
          
          <Button 
            className="w-full h-12 text-lg font-semibold bg-blue-500 hover:bg-blue-600 rounded-full"
            onClick={locationReached}
          >
            Location reached
          </Button>
        </div>
      </Card>
    </div>
  );
};

export default TaskDetails;
