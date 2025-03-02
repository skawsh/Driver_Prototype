
import React from 'react';
import { Card, CardHeader, CardContent } from '@/components/ui/card';
import { Zap, Timer, AlarmClock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { SubTask, Task } from '@/types/task';
import TaskCard from './TaskCard';

interface OrderCategorySectionProps {
  subtasks: SubTask[];
  tasks: Task[];
  washType: 'express' | 'standard';
  snoozedUntilLast: boolean;
  snoozedTasks: string[];
  clearSnooze: () => void;
  isSelectedType: boolean;
  onClick: () => void;
}

const OrderCategorySection = ({
  subtasks,
  tasks,
  washType,
  snoozedUntilLast,
  snoozedTasks,
  clearSnooze,
  isSelectedType,
  onClick
}: OrderCategorySectionProps) => {
  const isExpress = washType === 'express';
  const orderCount = tasks.filter(task => 
    isExpress ? 
    (task.washType === 'express' || task.washType === 'both') : 
    task.washType === 'standard'
  ).length;

  // Count snoozed tasks
  const snoozedTasksCount = subtasks.filter(task => task.isSnoozed).length;
  const hasSnoozedTasks = snoozedTasksCount > 0;

  // Group tasks: first non-snoozed tasks, then snoozed tasks
  const nonSnoozedSubtasks = subtasks.filter(subtask => !subtask.isSnoozed);
  const snoozedSubtasks = subtasks.filter(subtask => subtask.isSnoozed);

  return (
    <Card 
      className={`cursor-pointer transition ${isExpress ? 'border-amber-400' : 'border-blue-400'} ${isSelectedType ? 'shadow-md' : ''}`}
      onClick={onClick}
    >
      <CardHeader className="pb-2">
        <div className="flex items-center gap-2 justify-between">
          <div className="flex items-center gap-2">
            {isExpress ? (
              <Zap className="h-5 w-5 text-amber-500" />
            ) : (
              <Timer className="h-5 w-5 text-blue-500" />
            )}
            <h2 className="text-xl font-semibold">
              {isExpress ? 'Express' : 'Standard'} Orders ({orderCount})
            </h2>
          </div>
          
          {hasSnoozedTasks && (
            <div className="flex items-center text-amber-500">
              <AlarmClock className="h-4 w-4 mr-1" />
              <span className="text-sm">{snoozedTasksCount} snoozed</span>
            </div>
          )}
        </div>
        <p className="text-sm text-muted-foreground">
          {isExpress ? 'High' : 'Regular'} priority orders
        </p>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {/* Display non-snoozed tasks first */}
          {nonSnoozedSubtasks.length > 0 && nonSnoozedSubtasks.map((subtask, index) => {
            const parentTask = tasks.find(task => task.subtasks.some(st => st.id === subtask.id));
            if (!parentTask) return null;
            return (
              <TaskCard 
                key={subtask.id} 
                subtask={subtask} 
                parentTask={parentTask} 
                index={index} 
              />
            );
          })}
          
          {/* Display snoozed tasks after non-snoozed tasks */}
          {snoozedSubtasks.length > 0 && (
            <>
              <div className="pt-2 pb-2">
                <p className="text-sm text-amber-500 font-medium flex items-center">
                  <AlarmClock className="h-3 w-3 mr-1" />
                  Snoozed orders (will be enabled after all others are completed)
                </p>
              </div>
              
              {snoozedSubtasks.map((subtask, index) => {
                const parentTask = tasks.find(task => task.subtasks.some(st => st.id === subtask.id));
                if (!parentTask) return null;
                return (
                  <TaskCard 
                    key={subtask.id} 
                    subtask={subtask} 
                    parentTask={parentTask} 
                    index={nonSnoozedSubtasks.length + index} 
                  />
                );
              })}
            </>
          )}
          
          {/* Show message when no orders are available */}
          {subtasks.length === 0 && (
            <div className="p-4 text-center">
              <p className="text-muted-foreground">No {isExpress ? 'express' : 'standard'} orders available</p>
            </div>
          )}
          
          {/* Button to cancel snooze if necessary */}
          {(snoozedUntilLast || snoozedTasks.length > 0) && (
            <div className="text-center mt-4">
              <Button 
                variant="outline" 
                size="sm"
                className="text-amber-600 border-amber-300 hover:bg-amber-50"
                onClick={(e) => {
                  e.stopPropagation();
                  clearSnooze();
                }}
              >
                Cancel Snooze
              </Button>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default OrderCategorySection;
