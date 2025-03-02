import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Button } from '@/components/ui/button';
import { CheckCircle, Clock, MapPin, Package, User, Phone, WashingMachine, Route, AlertCircle, X, ArrowLeft, Eye, Zap, Timer } from 'lucide-react';
import { Task, SubTask, Location, DriverState } from '@/types/task';
import { calculateDistance, sortSubtasksByDistance, getClosestSubtask } from '@/utils/distance';
import { toast } from 'sonner';

const initialDriverState: DriverState = {
  currentLocation: {
    latitude: 17.3850,
    longitude: 78.4867,
    address: "Driver's Starting Location, Hyderabad"
  }
};

const studioLocation: Location = {
  latitude: 17.4100,
  longitude: 78.5000,
  address: "Laundry Studio, HITEC City, Hyderabad, Telangana 500081"
};

const initialTasks: Task[] = [
  {
    id: "task1",
    orderNumber: "1234",
    items: 3,
    washType: "express",
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
        }
      },
      {
        id: "task1-drop",
        type: "drop",
        status: "pending",
        enabled: false,
        customerName: "Saiteja",
        mobileNumber: "8197739892",
        location: studioLocation
      }
    ],
    status: "pending"
  },
  {
    id: "task2",
    orderNumber: "5678",
    items: 2,
    washType: "standard",
    subtasks: [
      {
        id: "task2-pickup",
        type: "pickup",
        status: "pending",
        enabled: true,
        customerName: "Priya Patel",
        mobileNumber: "+91 87654 32109",
        location: {
          latitude: 17.4400,
          longitude: 78.4800,
          address: "task2-pickup: 456 Banjara Hills, Hyderabad, Telangana 500034"
        }
      },
      {
        id: "task2-drop",
        type: "drop",
        status: "pending",
        enabled: false,
        customerName: "Priya Patel",
        mobileNumber: "+91 87654 32109",
        location: studioLocation
      }
    ],
    status: "pending"
  },
  {
    id: "task3",
    orderNumber: "9012",
    items: 1,
    washType: "both",
    subtasks: [
      {
        id: "task3-collect",
        type: "collect",
        status: "pending",
        enabled: true,
        customerName: "Laundry Express",
        mobileNumber: "+91 76543 21098",
        location: {
          latitude: 17.4200,
          longitude: 78.4700,
          address: "task3-collect: Laundry Express Studio, HITEC City, Hyderabad"
        }
      },
      {
        id: "task3-delivery",
        type: "delivery",
        status: "pending",
        enabled: false,
        customerName: "Arjun Reddy",
        mobileNumber: "+91 76543 21098",
        location: {
          latitude: 17.4250,
          longitude: 78.4200,
          address: "987 Kondapur, Hyderabad, Telangana 500032"
        }
      }
    ],
    status: "pending"
  },
  {
    id: "task4",
    orderNumber: "3456",
    items: 4,
    washType: "express",
    subtasks: [
      {
        id: "task4-collect",
        type: "collect",
        status: "pending",
        enabled: true,
        customerName: "Clean & Fresh",
        mobileNumber: "+91 65432 10987",
        location: {
          latitude: 17.4300,
          longitude: 78.4900,
          address: "task4-collect: Clean & Fresh Studio, HITEC City, Hyderabad"
        }
      },
      {
        id: "task4-delivery",
        type: "delivery",
        status: "pending",
        enabled: false,
        customerName: "Lakshmi Devi",
        mobileNumber: "+91 65432 10987",
        location: {
          latitude: 17.4550,
          longitude: 78.5100,
          address: "432 Whitefield, HITEC City, Hyderabad, Telangana 500081"
        }
      }
    ],
    status: "pending"
  },
  {
    id: "task5",
    orderNumber: "7890",
    items: 2,
    washType: "standard",
    subtasks: [
      {
        id: "task5-pickup",
        type: "pickup",
        status: "pending",
        enabled: true,
        customerName: "Vikram Singh",
        mobileNumber: "+91 54321 09876",
        location: {
          latitude: 17.4350,
          longitude: 78.4900,
          address: "task5-pickup: 567 Kukatpally, Hyderabad, Telangana 500072"
        }
      },
      {
        id: "task5-drop",
        type: "drop",
        status: "pending",
        enabled: false,
        customerName: "Vikram Singh",
        mobileNumber: "+91 54321 09876",
        location: studioLocation
      }
    ],
    status: "pending"
  }
];

const Index = () => {
  const navigate = useNavigate();
  const [tasks, setTasks] = useState<Task[]>(initialTasks);
  const [driverState, setDriverState] = useState<DriverState>(initialDriverState);
  const [completedTasks, setCompletedTasks] = useState<Task[]>([]);
  const [activeTaskId, setActiveTaskId] = useState<string | null>(null);
  const [inProgressTask, setInProgressTask] = useState<SubTask | null>(null);
  const [locationReachedTask, setLocationReachedTask] = useState<SubTask | null>(null);
  const [snoozedTasks, setSnoozedTasks] = useState<string[]>([]);
  const [selectedWashType, setSelectedWashType] = useState<'express' | 'standard'>('express');
  
  const getActiveSubtasks = () => {
    const activeSubtasks: SubTask[] = [];
    
    tasks.forEach(task => {
      task.subtasks.forEach(subtask => {
        if (subtask.enabled && subtask.status !== 'completed') {
          const distance = calculateDistance(driverState.currentLocation, subtask.location);
          activeSubtasks.push({
            ...subtask,
            distance: distance
          });
        }
      });
    });
    
    return sortSubtasksByDistance(activeSubtasks, driverState.currentLocation);
  };
  
  const activeSubtasks = getActiveSubtasks();
  const closestSubtask = getClosestSubtask(activeSubtasks);
  
  useEffect(() => {
    if (closestSubtask && activeSubtasks.length > 0 && !inProgressTask) {
      setActiveTaskId(closestSubtask.id);
    }
  }, [activeSubtasks.length, inProgressTask]);
  
  // Filter tasks based on selected wash type
  const filteredTasks = tasks.filter(task => {
    if (selectedWashType === 'express') {
      return task.washType === 'express' || task.washType === 'both';
    } else {
      return task.washType === 'standard';
    }
  });
  
  const expressOrders = tasks.filter(task => task.washType === 'express' || task.washType === 'both');
  const standardOrders = tasks.filter(task => task.washType === 'standard');
  
  const expressSubtasks = activeSubtasks.filter(subtask => {
    const parentTask = tasks.find(task => task.subtasks.some(st => st.id === subtask.id));
    return parentTask && (parentTask.washType === 'express' || parentTask.washType === 'both');
  });
  
  const standardSubtasks = activeSubtasks.filter(subtask => {
    const parentTask = tasks.find(task => task.subtasks.some(st => st.id === subtask.id));
    return parentTask && parentTask.washType === 'standard';
  });
  
  const startTask = (subtask: SubTask) => {
    const parentTask = tasks.find(
      t => t.subtasks.some(st => st.id === subtask.id)
    );
    
    if (parentTask) {
      navigate(`/task/${subtask.id}/${parentTask.orderNumber}`);
    } else {
      toast.error("Error finding parent task");
    }
  }
  
  const cancelTask = () => {
    setInProgressTask(null);
    setLocationReachedTask(null);
    toast.info("Task cancelled");
  }
  
  const reportIssue = () => {
    toast.error("Issue reported to support team", {
      description: "A support agent will contact you shortly",
    });
  }
  
  const locationReached = () => {
    if (inProgressTask) {
      setLocationReachedTask(inProgressTask);
      toast.success("Location reached!", {
        description: "Please confirm task completion",
      });
    }
  }
  
  const snoozeTask = (taskId: string) => {
    setSnoozedTasks(prev => [...prev, taskId]);
    toast.info("Task snoozed for 30 minutes", {
      description: "You can resume this task later",
    });
    
    setTimeout(() => {
      setSnoozedTasks(prev => prev.filter(id => id !== taskId));
      toast.info("Snoozed task is now available again");
    }, 30 * 60 * 1000);
  }
  
  const completeSubtask = (subtaskId: string) => {
    const updatedTasks = [...tasks];
    let taskCompleted = false;
    let newLocation: Location | null = null;
    
    for (let i = 0; i < updatedTasks.length; i++) {
      const task = updatedTasks[i];
      const subtaskIndex = task.subtasks.findIndex(st => st.id === subtaskId);
      
      if (subtaskIndex !== -1) {
        task.subtasks[subtaskIndex].status = 'completed';
        newLocation = task.subtasks[subtaskIndex].location;
        
        if (subtaskIndex < task.subtasks.length - 1) {
          task.subtasks[subtaskIndex + 1].enabled = true;
          task.status = 'in-progress';
        } else {
          task.status = 'completed';
          taskCompleted = true;
          
          setCompletedTasks(prev => [...prev, task]);
        }
        break;
      }
    }
    
    if (taskCompleted) {
      const filteredTasks = updatedTasks.filter(task => task.status !== 'completed');
      setTasks(filteredTasks);
    } else {
      setTasks(updatedTasks);
    }
    
    if (newLocation) {
      setDriverState({
        ...driverState,
        currentLocation: newLocation
      });
      
      setTimeout(() => {
        setTasks(prevTasks => [...prevTasks]);
      }, 100);
    }
    
    setInProgressTask(null);
    setLocationReachedTask(null);
    
    toast.success(`Subtask completed successfully!`, {
      description: `New location: ${newLocation?.address}`,
    });
  };
  
  const getSubtaskColor = (type: string) => {
    switch (type) {
      case 'pickup':
        return 'bg-blue-500';
      case 'drop':
        return 'bg-indigo-500';
      case 'collect':
        return 'bg-green-500';
      case 'delivery':
        return 'bg-yellow-500';
      default:
        return 'bg-gray-500';
    }
  };
  
  const getSubtaskBadgeVariant = (type: string): "default" | "secondary" | "outline" | "destructive" => {
    switch (type) {
      case 'pickup':
        return 'secondary';
      case 'drop':
        return 'outline';
      case 'collect':
        return 'default';
      case 'delivery':
        return 'destructive';
      default:
        return 'default';
    }
  };
  
  const getSubtaskTypeName = (type: string) => {
    switch (type) {
      case 'pickup':
        return 'Pick Up';
      case 'drop':
        return 'Drop';
      case 'collect':
        return 'Collect';
      case 'delivery':
        return 'Deliver';
      default:
        return type;
    }
  };
  
  const isClosestSubtask = (subtaskId: string) => {
    return closestSubtask && closestSubtask.id === subtaskId;
  };
  
  const viewDetails = (task: SubTask) => {
    const parentTask = tasks.find(
      t => t.subtasks.some(st => st.id === task.id)
    );
    
    if (parentTask) {
      navigate(`/task/${task.id}/${parentTask.orderNumber}`);
    } else {
      toast.info(`Viewing details for task ${task.id}`, {
        description: "Full details would be shown in a modal in a real app",
      });
    }
  };
  
  const renderLocationReachedTask = () => {
    if (!locationReachedTask) return null;
    
    const parentTask = tasks.find(
      task => task.subtasks.some(st => st.id === locationReachedTask.id)
    );
    
    if (!parentTask) return null;
    
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
                  ID {parentTask.orderNumber}P
                </div>
                <div className="distance-container">
                  <div className="flex items-center text-sky-400 font-medium">
                    <MapPin className="h-4 w-4 mr-1" />
                    {locationReachedTask.distance !== undefined ? locationReachedTask.distance : 0} Km
                  </div>
                </div>
              </div>
              
              <div className="flex items-center mb-4">
                <WashingMachine className="h-5 w-5 mr-2" />
                <span className="text-xl font-bold">{locationReachedTask.customerName}</span>
              </div>
              
              <a 
                href={`https://maps.google.com/?q=${locationReachedTask.location.latitude},${locationReachedTask.location.longitude}`} 
                target="_blank" 
                rel="noopener noreferrer"
                className="flex items-start space-x-2 mb-3 text-blue-500 hover:underline"
              >
                <MapPin className="h-5 w-5 text-blue-500 mt-0.5" />
                <span className="break-all">{locationReachedTask.location.address}</span>
              </a>
              
              {locationReachedTask.mobileNumber && (
                <a 
                  href={`tel:${locationReachedTask.mobileNumber}`}
                  className="flex items-start space-x-2 mb-4 text-blue-500 hover:underline"
                >
                  <Phone className="h-5 w-5 text-blue-500 mt-0.5" />
                  <span>{locationReachedTask.mobileNumber.replace(/\+91 /, '')}</span>
                </a>
              )}
              
              <div className="grid grid-cols-2 gap-3 mt-4">
                <Button 
                  variant="outline"
                  className="rounded-xl bg-green-100 hover:bg-green-200"
                  onClick={() => viewDetails(locationReachedTask)}
                >
                  View details
                </Button>
                
                <Button 
                  className="location-reached-button w-full h-12 text-lg font-semibold"
                  onClick={() => completeSubtask(locationReachedTask.id)}
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
  
  const renderInProgressTask = () => {
    if (!inProgressTask) return null;
    
    const parentTask = tasks.find(
      task => task.subtasks.some(st => st.id === inProgressTask.id)
    );
    
    if (!parentTask) return null;
    
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
                    ID {parentTask.orderNumber}P
                  </div>
                  <MapPin className="h-4 w-4 text-sky-400" />
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-6 w-6 p-0"
                  onClick={cancelTask}
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
                    onClick={() => snoozeTask(inProgressTask.id)}
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
                  onClick={reportIssue}
                >
                  Report issue
                </Button>
                
                <Button 
                  className="location-reached-button w-full h-12 text-lg font-semibold"
                  onClick={locationReached}
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
  
  const renderCollectCard = (subtask: SubTask, parentTask: Task, index: number) => {
    const isClosest = isClosestSubtask(subtask.id);
    
    return (
      <motion.div
        key={subtask.id}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: index * 0.1 }}
      >
        <Card className={`overflow-hidden rounded-3xl border ${isClosest ? 'border-green-500 shadow-md' : 'border-gray-200'} shadow-sm`}>
          <CardContent className="p-0">
            <div className="p-4">
              <div className="flex justify-between items-start mb-4">
                <div className="text-lg font-semibold">
                  ID {parentTask.orderNumber}P
                </div>
                <div className="flex items-center text-sky-400 font-medium">
                  <Route className="h-4 w-4 mr-1" />
                  {subtask.distance !== undefined ? subtask.distance : 0} km
                </div>
              </div>
              
              <div className="flex items-center mb-3">
                <WashingMachine className="h-5 w-5 mr-2" />
                <span className="text-xl font-bold">{subtask.customerName}</span>
              </div>
              
              <div className="flex items-start space-x-2 mb-3">
                <MapPin className="h-5 w-5 text-gray-500 mt-0.5" />
                <span>Location of the laundry shop</span>
              </div>
              
              <div className="flex items-start space-x-2 mb-4">
                <Phone className="h-5 w-5 text-gray-500 mt-0.5" />
                <span>{subtask.mobileNumber || "Mobile number"}</span>
              </div>
              
              <Button 
                className={`w-full h-12 text-lg font-semibold rounded-xl ${isClosest ? 'bg-green-500 hover:bg-green-600' : 'bg-green-400 hover:bg-green-500'} text-black`}
                onClick={() => startTask(subtask)}
                disabled={!isClosest}
              >
                {isClosest ? 'Start Collect' : 'Not Next Task'}
              </Button>
              {!isClosest && (
                <p className="text-xs text-center mt-2 text-gray-500">Complete the closest task first</p>
              )}
            </div>
          </CardContent>
        </Card>
      </motion.div>
    );
  };
  
  const renderPickupCard = (subtask: SubTask, parentTask: Task, index: number) => {
    const isClosest = isClosestSubtask(subtask.id);
    
    return (
      <motion.div
        key={subtask.id}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: index * 0.1 }}
      >
        <Card className={`overflow-hidden rounded-3xl border ${isClosest ? 'border-sky-500 shadow-md' : 'border-gray-200'} shadow-sm`}>
          <CardContent className="p-0">
            <div className="p-4">
              <div className="flex justify-between items-start mb-4">
                <div className="text-lg font-semibold">
                  ID {parentTask.orderNumber}P
                </div>
                <div className="flex items-center text-sky-400 font-medium">
                  <Route className="h-4 w-4 mr-1" />
                  {subtask.distance !== undefined ? subtask.distance : 0} km
                </div>
              </div>
              
              <div className="flex items-center mb-3">
                <WashingMachine className="h-5 w-5 mr-2" />
                <span className="text-xl font-bold">{subtask.customerName}</span>
              </div>
              
              <div className="flex items-start space-x-2 mb-3">
                <MapPin className="h-5 w-5 text-gray-500 mt-0.5" />
                <span>{subtask.location.address}</span>
              </div>
              
              <div className="flex items-start space-x-2 mb-4">
                <Phone className="h-5 w-5 text-gray-500 mt-0.5" />
                <span>{subtask.mobileNumber || "Mobile number"}</span>
              </div>
              
              <Button 
                className={`w-full h-12 text-lg font-semibold rounded-xl ${isClosest ? 'bg-sky-500 hover:bg-sky-600' : 'bg-sky-400 hover:bg-sky-500'} text-white`}
                onClick={() => startTask(subtask)}
                disabled={!isClosest}
              >
                {isClosest ? 'Start Pickup' : 'Not Next Task'}
              </Button>
              {!isClosest && (
                <p className="text-xs text-center mt-2 text-gray-500">Complete the closest task first</p>
              )}
            </div>
          </CardContent>
        </Card>
      </motion.div>
    );
  };
  
  // Render a task card for the Express and Standard sections
  const renderTaskCard = (subtask: SubTask, parentTask: Task, index: number) => {
    const isClosest = isClosestSubtask(subtask.id);
    
    if (subtask.type === 'collect') {
      return renderCollectCard(subtask, parentTask, index);
    }
    
    if (subtask.type === 'pickup') {
      return renderPickupCard(subtask, parentTask, index);
    }
    
    return (
      <motion.div
        key={subtask.id}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: index * 0.1 }}
      >
        <Card className={`task-card-hover relative overflow-hidden ${isClosest ? 'border-primary shadow-md' : ''}`}>
          <div className={`absolute top-0 left-0 w-1 h-full ${getSubtaskColor(subtask.type)}`} />
          
          <CardHeader className="pb-2">
            <div className="flex justify-between items-start">
              <div>
                <div className="flex items-center">
                  <CardTitle className="text-lg font-medium mr-2">
                    Order #{parentTask.orderNumber}
                  </CardTitle>
                  <Badge variant="secondary" className={parentTask.washType === 'express' || parentTask.washType === 'both' ? 
                    "bg-amber-100 text-amber-800 border-amber-200" : 
                    "bg-blue-100 text-blue-800 border-blue-200"}>
                    {parentTask.washType === 'express' || parentTask.washType === 'both' ? (
                      <>
                        <Zap className="h-3 w-3 mr-1" />
                        Express
                      </>
                    ) : (
                      <>
                        <Timer className="h-3 w-3 mr-1" />
                        Standard
                      </>
                    )}
                  </Badge>
                </div>
                <p className="text-sm text-muted-foreground mt-1">
                  Task {getSubtaskTypeName(subtask.type)}
                </p>
              </div>
              <Badge variant={getSubtaskBadgeVariant(subtask.type)}>
                {getSubtaskTypeName(subtask.type)}
              </Badge>
            </div>
          </CardHeader>
          
          <CardContent>
            <div className="space-y-3">
              <div className="flex items-center space-x-2">
                <User className="h-4 w-4 text-muted-foreground" />
                <span className="flex-1">{subtask.customerName}</span>
              </div>
              
              <div className="flex items-start space-x-2">
                <MapPin className="h-4 w-4 text-muted-foreground mt-0.5" />
                <span>{subtask.location.address}</span>
              </div>
              
              {subtask.mobileNumber && (
                <div className="flex items-start space-x-2">
                  <Phone className="h-4 w-4 text-muted-foreground mt-0.5" />
                  <span>{subtask.mobileNumber}</span>
                </div>
              )}
              
              <Separator />
              
              <div className="flex justify-between pt-1">
                <div className="flex items-center space-x-2">
                  <Package className="h-4 w-4 text-muted-foreground" />
                  <span>{parentTask.items} items</span>
                </div>
                
                <div className="flex items-center space-x-2">
                  <Clock className="h-4 w-4 text-muted-foreground" />
                  <span className="font-medium text-primary">
                    {subtask.distance !== undefined ? subtask.distance : 0} km
                  </span>
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-2">
                <Button 
                  variant="outline"
                  onClick={() => viewDetails(subtask)}
                  className="w-full"
                >
                  View Details
                </Button>
                
                <Button 
                  className="w-full" 
                  onClick={() => startTask(subtask)}
                  disabled={!isClosest}
                >
                  {isClosest ? `Start ${getSubtaskTypeName(subtask.type)}` : 'Not Next Task'}
                </Button>
              </div>
              
              {!isClosest && (
                <p className="text-xs text-center mt-1 text-gray-500">Complete the closest task first</p>
              )}
            </div>
          </CardContent>
        </Card>
      </motion.div>
    );
  };
  
  // New section for side-by-side Express and Standard orders
  const renderSideBySideOrders = () => {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Express Orders Card */}
        <Card 
          className={`cursor-pointer transition hover:border-amber-300 ${selectedWashType === 'express' ? 'border-amber-400 shadow-md' : ''}`}
          onClick={() => setSelectedWashType('express')}
        >
          <CardHeader className="pb-2">
            <div className="flex items-center gap-2">
              <Zap className="h-5 w-5 text-amber-500" />
              <h2 className="text-xl font-semibold">Express Orders ({expressOrders.length})</h2>
            </div>
            <p className="text-sm text-muted-foreground">High priority orders</p>
          </CardHeader>
          <CardContent>
            {selectedWashType === 'express' ? (
              <div className="space-y-4">
                {expressSubtasks.length > 0 ? (
                  expressSubtasks.map((subtask, index) => {
                    const parentTask = tasks.find(task => task.subtasks.some(st => st.id === subtask.id));
                    if (!parentTask) return null;
                    return renderTaskCard(subtask, parentTask, index);
                  })
                ) : (
                  <div className="p-4 text-center">
                    <p className="text-muted-foreground">No express orders available</p>
                  </div>
                )}
              </div>
            ) : (
              <div className="p-4 text-center">
                <p className="text-amber-600 font
