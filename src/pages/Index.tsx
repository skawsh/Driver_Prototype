import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Button } from '@/components/ui/button';
import { CheckCircle, Clock, MapPin, Package, User } from 'lucide-react';
import { Task, SubTask, Location, DriverState } from '@/types/task';
import { calculateDistance, sortSubtasksByDistance } from '@/utils/distance';
import { toast } from 'sonner';

// Initial driver location (starting point)
const initialDriverState: DriverState = {
  currentLocation: {
    latitude: 17.3850,
    longitude: 78.4867,
    address: "Driver's Starting Location, Hyderabad"
  }
};

// Studio location (for drop and collect tasks)
const studioLocation: Location = {
  latitude: 17.4100,
  longitude: 78.5000,
  address: "Laundry Studio, HITEC City, Hyderabad, Telangana 500081"
};

// Initial task data
const initialTasks: Task[] = [
  {
    id: "task1",
    orderNumber: "1234",
    items: 3,
    subtasks: [
      {
        id: "task1-pickup",
        type: "pickup",
        status: "pending",
        enabled: true,
        customerName: "Raj Sharma",
        location: {
          latitude: 17.4100,
          longitude: 78.4600,
          address: "123 Jubilee Hills, Hyderabad, Telangana 500033"
        }
      },
      {
        id: "task1-drop",
        type: "drop",
        status: "pending",
        enabled: false,
        customerName: "Raj Sharma",
        location: studioLocation
      }
    ],
    status: "pending"
  },
  {
    id: "task2",
    orderNumber: "5678",
    items: 2,
    subtasks: [
      {
        id: "task2-pickup",
        type: "pickup",
        status: "pending",
        enabled: true,
        customerName: "Priya Patel",
        location: {
          latitude: 17.4400,
          longitude: 78.4800,
          address: "456 Banjara Hills, Hyderabad, Telangana 500034"
        }
      },
      {
        id: "task2-drop",
        type: "drop",
        status: "pending",
        enabled: false,
        customerName: "Priya Patel",
        location: studioLocation
      }
    ],
    status: "pending"
  },
  {
    id: "task3",
    orderNumber: "9012",
    items: 1,
    subtasks: [
      {
        id: "task3-collect",
        type: "collect",
        status: "pending",
        enabled: true,
        customerName: "Arjun Reddy",
        location: studioLocation
      },
      {
        id: "task3-delivery",
        type: "delivery",
        status: "pending",
        enabled: false,
        customerName: "Arjun Reddy",
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
    subtasks: [
      {
        id: "task4-collect",
        type: "collect",
        status: "pending",
        enabled: true,
        customerName: "Lakshmi Devi",
        location: studioLocation
      },
      {
        id: "task4-delivery",
        type: "delivery",
        status: "pending",
        enabled: false,
        customerName: "Lakshmi Devi",
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
    subtasks: [
      {
        id: "task5-pickup",
        type: "pickup",
        status: "pending",
        enabled: true,
        customerName: "Vikram Singh",
        location: {
          latitude: 17.4350,
          longitude: 78.4900,
          address: "567 Kukatpally, Hyderabad, Telangana 500072"
        }
      },
      {
        id: "task5-drop",
        type: "drop",
        status: "pending",
        enabled: false,
        customerName: "Vikram Singh",
        location: studioLocation
      }
    ],
    status: "pending"
  }
];

const Index = () => {
  const [tasks, setTasks] = useState<Task[]>(initialTasks);
  const [driverState, setDriverState] = useState<DriverState>(initialDriverState);
  const [completedTasks, setCompletedTasks] = useState<Task[]>([]);
  
  // Calculate active subtasks (those that are enabled but not completed)
  const getActiveSubtasks = () => {
    const activeSubtasks: SubTask[] = [];
    
    tasks.forEach(task => {
      task.subtasks.forEach(subtask => {
        if (subtask.enabled && subtask.status !== 'completed') {
          activeSubtasks.push({
            ...subtask,
            distance: calculateDistance(driverState.currentLocation, subtask.location)
          });
        }
      });
    });
    
    return sortSubtasksByDistance(activeSubtasks, driverState.currentLocation);
  };
  
  // Recalculate active subtasks whenever driver location or tasks change
  const activeSubtasks = getActiveSubtasks();
  
  // Complete a subtask and update the workflow
  const completeSubtask = (subtaskId: string) => {
    const updatedTasks = [...tasks];
    let taskCompleted = false;
    let newLocation: Location | null = null;
    
    // Loop through tasks to find the subtask
    for (let i = 0; i < updatedTasks.length; i++) {
      const task = updatedTasks[i];
      const subtaskIndex = task.subtasks.findIndex(st => st.id === subtaskId);
      
      if (subtaskIndex !== -1) {
        // Mark this subtask as completed
        task.subtasks[subtaskIndex].status = 'completed';
        newLocation = task.subtasks[subtaskIndex].location;
        
        // If this is not the last subtask, enable the next one
        if (subtaskIndex < task.subtasks.length - 1) {
          task.subtasks[subtaskIndex + 1].enabled = true;
          task.status = 'in-progress';
        } else {
          // This was the last subtask, mark the task as completed
          task.status = 'completed';
          taskCompleted = true;
          
          // Add to completed tasks
          setCompletedTasks(prev => [...prev, task]);
        }
        break;
      }
    }
    
    // Remove completed tasks from the active list
    if (taskCompleted) {
      const filteredTasks = updatedTasks.filter(task => task.status !== 'completed');
      setTasks(filteredTasks);
    } else {
      setTasks(updatedTasks);
    }
    
    // Update driver location
    if (newLocation) {
      setDriverState({
        ...driverState,
        currentLocation: newLocation
      });
    }
    
    // Show success toast
    toast.success(`Subtask completed successfully!`, {
      description: `New location: ${newLocation?.address}`,
    });
  };
  
  // Get button color based on subtask type
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
  
  // Get badge variant based on subtask type
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
  
  // Get friendly name for subtask type
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
  
  return (
    <div className="py-6 md:py-8">
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <h1 className="text-2xl font-bold mb-6">Assigned Orders</h1>
      </motion.div>
      
      {activeSubtasks.length === 0 ? (
        <Card className="w-full p-8 text-center">
          <div className="flex flex-col items-center justify-center space-y-3">
            <CheckCircle className="h-12 w-12 text-primary/50" />
            <h3 className="text-xl font-medium">All tasks completed</h3>
            <p className="text-muted-foreground">You've completed all assigned tasks!</p>
            <Button 
              variant="outline" 
              onClick={() => {
                setTasks(initialTasks);
                setDriverState(initialDriverState);
                setCompletedTasks([]);
                toast.info("Tasks have been reset!");
              }}
            >
              Reset Tasks
            </Button>
          </div>
        </Card>
      ) : (
        <div className="grid grid-cols-1 gap-4">
          {activeSubtasks.map((subtask, index) => {
            // Find the parent task for this subtask
            const parentTask = tasks.find(
              task => task.subtasks.some(st => st.id === subtask.id)
            );
            
            if (!parentTask) return null;
            
            return (
              <motion.div
                key={subtask.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: index * 0.1 }}
              >
                <Card className="task-card-hover relative overflow-hidden">
                  <div className={`absolute top-0 left-0 w-1 h-full ${getSubtaskColor(subtask.type)}`} />
                  
                  <CardHeader className="pb-2">
                    <div className="flex justify-between items-start">
                      <div>
                        <CardTitle className="text-lg font-medium">
                          Order #{parentTask.orderNumber}
                        </CardTitle>
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
                      <div className="flex items-start space-x-2">
                        <User className="h-4 w-4 text-muted-foreground mt-0.5" />
                        <span className="flex-1">{subtask.customerName}</span>
                      </div>
                      
                      <div className="flex items-start space-x-2">
                        <MapPin className="h-4 w-4 text-muted-foreground mt-0.5" />
                        <span className="flex-1">{subtask.location.address}</span>
                      </div>
                      
                      <Separator />
                      
                      <div className="flex justify-between pt-1">
                        <div className="flex items-center space-x-2">
                          <Package className="h-4 w-4 text-muted-foreground" />
                          <span>{parentTask.items} items</span>
                        </div>
                        
                        <div className="flex items-center space-x-2">
                          <Clock className="h-4 w-4 text-muted-foreground" />
                          <span className="font-medium text-primary">
                            {subtask.distance} km
                          </span>
                        </div>
                      </div>
                      
                      <Button 
                        className="w-full mt-2" 
                        onClick={() => completeSubtask(subtask.id)}
                      >
                        Start {getSubtaskTypeName(subtask.type)}
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            );
          })}
        </div>
      )}
      
      {completedTasks.length > 0 && (
        <div className="mt-8">
          <h2 className="text-xl font-semibold mb-4">Completed Tasks ({completedTasks.length})</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {completedTasks.map((task, index) => (
              <motion.div
                key={task.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: index * 0.05 }}
              >
                <Card className="bg-muted/30">
                  <CardHeader className="pb-2">
                    <div className="flex justify-between items-start">
                      <CardTitle className="text-lg font-medium">Order #{task.orderNumber}</CardTitle>
                      <Badge variant="outline" className="bg-green-500/10 text-green-600 border-green-500/20">
                        Completed
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div className="flex items-center space-x-2">
                        <User className="h-4 w-4 text-muted-foreground" />
                        <span className="flex-1">{task.subtasks[task.subtasks.length - 1].customerName}</span>
                      </div>
                      
                      <div className="flex flex-col space-y-2 pt-1">
                        {task.subtasks.map((subtask, subIndex) => (
                          <div className="flex items-center space-x-2" key={subIndex}>
                            <CheckCircle className="h-4 w-4 text-green-500" />
                            <span className="text-sm">{getSubtaskTypeName(subtask.type)} completed</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default Index;
