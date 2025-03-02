
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Button } from '@/components/ui/button';
import { Clock, MapPin, Package, User, CheckCircle, Circle } from 'lucide-react';
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

// Initial task data
const initialTasks: Task[] = [
  {
    id: "task1",
    orderNumber: "1234",
    items: 3,
    subtasks: {
      pickup: {
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
      delivery: {
        id: "task1-delivery",
        type: "delivery",
        status: "pending",
        enabled: false,
        customerName: "Raj Sharma",
        location: {
          latitude: 17.4200,
          longitude: 78.4500,
          address: "321 Banjara Hills, Hyderabad, Telangana 500034"
        }
      }
    },
    status: "pending"
  },
  {
    id: "task2",
    orderNumber: "5678",
    items: 2,
    subtasks: {
      pickup: {
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
      delivery: {
        id: "task2-delivery",
        type: "delivery",
        status: "pending",
        enabled: false,
        customerName: "Priya Patel",
        location: {
          latitude: 17.4150,
          longitude: 78.4350,
          address: "654 Film Nagar, Hyderabad, Telangana 500034"
        }
      }
    },
    status: "pending"
  },
  {
    id: "task3",
    orderNumber: "9012",
    items: 1,
    subtasks: {
      pickup: {
        id: "task3-pickup",
        type: "pickup",
        status: "pending",
        enabled: true,
        customerName: "Arjun Reddy",
        location: {
          latitude: 17.4300,
          longitude: 78.4500,
          address: "789 Gachibowli, Hyderabad, Telangana 500032"
        }
      },
      delivery: {
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
    },
    status: "pending"
  },
  {
    id: "task4",
    orderNumber: "3456",
    items: 4,
    subtasks: {
      pickup: {
        id: "task4-pickup",
        type: "pickup",
        status: "pending",
        enabled: true,
        customerName: "Lakshmi Devi",
        location: {
          latitude: 17.4450,
          longitude: 78.5000,
          address: "234 Madhapur, HITEC City, Hyderabad, Telangana 500081"
        }
      },
      delivery: {
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
    },
    status: "pending"
  },
  {
    id: "task5",
    orderNumber: "7890",
    items: 2,
    subtasks: {
      pickup: {
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
      delivery: {
        id: "task5-delivery",
        type: "delivery",
        status: "pending",
        enabled: false,
        customerName: "Vikram Singh",
        location: {
          latitude: 17.4400,
          longitude: 78.4700,
          address: "765 KPHB, Hyderabad, Telangana 500072"
        }
      }
    },
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
      if (task.subtasks.pickup.enabled && task.subtasks.pickup.status !== 'completed') {
        activeSubtasks.push({
          ...task.subtasks.pickup,
          distance: calculateDistance(driverState.currentLocation, task.subtasks.pickup.location)
        });
      }
      
      if (task.subtasks.delivery.enabled && task.subtasks.delivery.status !== 'completed') {
        activeSubtasks.push({
          ...task.subtasks.delivery,
          distance: calculateDistance(driverState.currentLocation, task.subtasks.delivery.location)
        });
      }
    });
    
    return sortSubtasksByDistance(activeSubtasks, driverState.currentLocation);
  };
  
  const activeSubtasks = getActiveSubtasks();
  
  // Complete a subtask and update the workflow
  const completeSubtask = (subtaskId: string) => {
    const updatedTasks = [...tasks];
    let taskCompleted = false;
    let newLocation: Location | null = null;
    
    // Find and update the completed subtask
    for (let i = 0; i < updatedTasks.length; i++) {
      const task = updatedTasks[i];
      
      // Check if this is the pickup subtask
      if (task.subtasks.pickup.id === subtaskId) {
        task.subtasks.pickup.status = 'completed';
        task.subtasks.delivery.enabled = true;
        task.status = 'in-progress';
        newLocation = task.subtasks.pickup.location;
        break;
      }
      
      // Check if this is the delivery subtask
      if (task.subtasks.delivery.id === subtaskId) {
        task.subtasks.delivery.status = 'completed';
        task.status = 'completed';
        taskCompleted = true;
        newLocation = task.subtasks.delivery.location;
        
        // Add to completed tasks
        setCompletedTasks(prev => [...prev, task]);
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
  
  return (
    <div className="py-6 md:py-8">
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <h1 className="text-2xl font-bold mb-1">Driver Workflow</h1>
        <p className="text-muted-foreground mb-2">Your current tasks sorted by distance</p>
        
        <div className="bg-muted/30 p-3 rounded-lg mb-6">
          <div className="flex items-center space-x-2">
            <MapPin className="h-4 w-4 text-muted-foreground" />
            <span className="text-sm text-muted-foreground">Current location: {driverState.currentLocation.address}</span>
          </div>
        </div>
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
              task => task.subtasks.pickup.id === subtask.id || task.subtasks.delivery.id === subtask.id
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
                  {subtask.type === 'pickup' && (
                    <div className="absolute top-0 left-0 w-1 h-full bg-blue-500" />
                  )}
                  {subtask.type === 'delivery' && (
                    <div className="absolute top-0 left-0 w-1 h-full bg-green-500" />
                  )}
                  
                  <CardHeader className="pb-2">
                    <div className="flex justify-between items-start">
                      <div>
                        <CardTitle className="text-lg font-medium">
                          Order #{parentTask.orderNumber}
                        </CardTitle>
                        <p className="text-sm text-muted-foreground mt-1">
                          Task {subtask.type === 'pickup' ? 'Pickup' : 'Delivery'}
                        </p>
                      </div>
                      <Badge variant={subtask.type === 'pickup' ? 'secondary' : 'default'}>
                        {subtask.type === 'pickup' ? 'Pick Up' : 'Deliver'}
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
                        Complete {subtask.type === 'pickup' ? 'Pickup' : 'Delivery'}
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
                        <span className="flex-1">{task.subtasks.delivery.customerName}</span>
                      </div>
                      
                      <div className="flex flex-col space-y-2 pt-1">
                        <div className="flex items-center space-x-2">
                          <CheckCircle className="h-4 w-4 text-green-500" />
                          <span className="text-sm">Pickup completed</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <CheckCircle className="h-4 w-4 text-green-500" />
                          <span className="text-sm">Delivery completed</span>
                        </div>
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
