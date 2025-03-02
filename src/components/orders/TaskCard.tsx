
import React from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Button } from '@/components/ui/button';
import { MapPin, Package, Clock, User, Phone, WashingMachine, Route, Zap, Timer } from 'lucide-react';
import { SubTask, Task } from '@/types/task';
import { toast } from 'sonner';
import { getSubtaskBadgeVariant, getSubtaskTypeName } from './CardTaskType';

interface TaskCardProps {
  subtask: SubTask;
  parentTask: Task;
  index: number;
}

const TaskCard = ({ subtask, parentTask, index }: TaskCardProps) => {
  const navigate = useNavigate();
  
  const isClosest = subtask.isClosest || false;

  const startTask = () => {
    navigate(`/task/${subtask.id}/${parentTask.orderNumber}`);
  };

  const viewDetails = () => {
    navigate(`/task/${subtask.id}/${parentTask.orderNumber}`);
  };

  if (subtask.type === 'collect') {
    return renderCollectCard(subtask, parentTask, index, isClosest, startTask);
  }

  if (subtask.type === 'pickup') {
    return renderPickupCard(subtask, parentTask, index, isClosest, startTask);
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
                onClick={viewDetails}
                className="w-full"
              >
                View Details
              </Button>
              
              <Button 
                className="w-full" 
                onClick={startTask}
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

function getSubtaskColor(type: string) {
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
}

function renderCollectCard(
  subtask: SubTask, 
  parentTask: Task, 
  index: number,
  isClosest: boolean,
  startTask: () => void
) {
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
              onClick={startTask}
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
}

function renderPickupCard(
  subtask: SubTask, 
  parentTask: Task, 
  index: number,
  isClosest: boolean,
  startTask: () => void
) {
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
              onClick={startTask}
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
}

export default TaskCard;
