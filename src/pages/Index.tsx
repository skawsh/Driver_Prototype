import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Card } from '@/components/ui/card';
import { Eye } from 'lucide-react';
import { Task, SubTask, Location, DriverState } from '@/types/task';
import { toast } from 'sonner';

import OrderTypeSelector from '@/components/orders/OrderTypeSelector';
import SnoozeNotification from '@/components/orders/SnoozeNotification';
import AllTasksCompleted from '@/components/orders/AllTasksCompleted';
import OrderCategorySection from '@/components/orders/OrderCategorySection';
import ActiveTaskCard from '@/components/orders/ActiveTaskCard';
import LocationReachedCard from '@/components/orders/LocationReachedCard';
import CompletedTasksList from '@/components/orders/CompletedTasksList';

import { 
  getActiveSubtasks, 
  markClosestSubtask, 
  filterSubtasksByWashType,
  completeSubtask
} from '@/utils/taskUtils';

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
  const [snoozedUntilLast, setSnoozedUntilLast] = useState<boolean>(false);
  const [selectedWashType, setSelectedWashType] = useState<'express' | 'standard'>('express');
  
  useEffect(() => {
    const snoozeInfoStr = localStorage.getItem('snoozeInfo');
    if (snoozeInfoStr) {
      const snoozeInfo = JSON.parse(snoozeInfoStr);
      if (snoozeInfo.snoozeType === 'next') {
        setSnoozedTasks([snoozeInfo.taskId]);
      } else if (snoozeInfo.snoozeType === 'last') {
        setSnoozedUntilLast(true);
      }
    }
  }, []);

  const clearSnooze = () => {
    localStorage.removeItem('snoozeInfo');
    setSnoozedTasks([]);
    setSnoozedUntilLast(false);
  };
  
  const activeSubtasks = getActiveSubtasks(tasks, driverState);
  
  const processedSubtasks = markClosestSubtask(activeSubtasks, snoozedTasks, snoozedUntilLast, tasks);
  
  const expressSubtasks = filterSubtasksByWashType(processedSubtasks, tasks, 'express');
  const standardSubtasks = filterSubtasksByWashType(processedSubtasks, tasks, 'standard');
  
  const expressOrders = tasks.filter(task => task.washType === 'express' || task.washType === 'both');
  const standardOrders = tasks.filter(task => task.washType === 'standard');
  
  const closestSubtask = processedSubtasks.find(subtask => subtask.isClosest);
  
  useEffect(() => {
    if (closestSubtask && processedSubtasks.length > 0 && !inProgressTask) {
      setActiveTaskId(closestSubtask.id);
    }
  }, [processedSubtasks.length, inProgressTask]);
  
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
  
  const handleCompleteSubtask = (subtaskId: string) => {
    const { updatedTasks, taskCompleted, newLocation } = completeSubtask(tasks, subtaskId);
    
    if (taskCompleted) {
      const taskToComplete = updatedTasks.find(
        task => task.subtasks.some(st => st.id === subtaskId) && task.status === 'completed'
      );
      
      if (taskToComplete) {
        setCompletedTasks(prev => [...prev, taskToComplete]);
      }
      
      const filteredTasks = updatedTasks.filter(task => task.status !== 'completed');
      setTasks(filteredTasks);
      
      if (filteredTasks.length === 0 && snoozedUntilLast) {
        clearSnooze();
      }
      
      const snoozeInfoStr = localStorage.getItem('snoozeInfo');
      if (snoozeInfoStr) {
        const snoozeInfo = JSON.parse(snoozeInfoStr);
        if (snoozeInfo.snoozeType === 'next') {
          clearSnooze();
          toast.success("Snooze period ended!", {
            description: "All tasks are now visible again",
          });
        }
      }
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
  
  const resetAllTasks = () => {
    setTasks(initialTasks);
    setDriverState(initialDriverState);
    setCompletedTasks([]);
    clearSnooze();
    toast.info("Tasks have been reset!");
  };
  
  const getParentTaskOrderNumber = (subtaskId: string) => {
    const parentTask = tasks.find(task => task.subtasks.some(st => st.id === subtaskId));
    return parentTask?.orderNumber || '';
  };
  
  const journeyNumber = completedTasks.length + 1;
  
  return (
    <div className="py-6 md:py-8 relative">
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <h1 className="text-2xl font-bold mb-6">Assigned Orders</h1>
        <SnoozeNotification 
          snoozedUntilLast={snoozedUntilLast} 
          snoozedTasks={snoozedTasks} 
          clearSnooze={clearSnooze} 
        />
      </motion.div>
      
      <div
        className="fixed bottom-5 left-5 opacity-5 text-xs pointer-events-none select-none z-50"
        aria-hidden="true"
      >
        <Eye className="h-3 w-3 inline-block mr-1" />
        <span>{journeyNumber}</span>
      </div>
      
      {locationReachedTask ? (
        <LocationReachedCard 
          reachedTask={locationReachedTask}
          parentTaskOrderNumber={getParentTaskOrderNumber(locationReachedTask.id)}
          onComplete={handleCompleteSubtask}
        />
      ) : inProgressTask ? (
        <ActiveTaskCard 
          inProgressTask={inProgressTask}
          parentTaskOrderNumber={getParentTaskOrderNumber(inProgressTask.id)}
          onLocationReached={locationReached}
          onCancel={cancelTask}
          onSnooze={snoozeTask}
          onReportIssue={reportIssue}
        />
      ) : activeSubtasks.length === 0 ? (
        <AllTasksCompleted resetTasks={resetAllTasks} />
      ) : (
        <div className="space-y-8">
          <OrderTypeSelector 
            selectedWashType={selectedWashType}
            setSelectedWashType={setSelectedWashType}
            expressOrdersCount={expressOrders.length}
            standardOrdersCount={standardOrders.length}
          />
          
          <OrderCategorySection 
            subtasks={selectedWashType === 'express' ? expressSubtasks : standardSubtasks}
            tasks={tasks}
            washType={selectedWashType}
            snoozedUntilLast={snoozedUntilLast}
            snoozedTasks={snoozedTasks}
            clearSnooze={clearSnooze}
            isSelectedType={true}
            onClick={() => {}}
          />
        </div>
      )}
      
      <CompletedTasksList completedTasks={completedTasks} />
    </div>
  );
};

export default Index;
