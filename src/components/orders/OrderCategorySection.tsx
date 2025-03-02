
import React from 'react';
import { Card, CardHeader, CardContent } from '@/components/ui/card';
import { Zap, Timer } from 'lucide-react';
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

  return (
    <Card 
      className={`cursor-pointer transition ${isExpress ? 'border-amber-400' : 'border-blue-400'} ${isSelectedType ? 'shadow-md' : ''}`}
      onClick={onClick}
    >
      <CardHeader className="pb-2">
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
        <p className="text-sm text-muted-foreground">
          {isExpress ? 'High' : 'Regular'} priority orders
        </p>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {subtasks.length > 0 ? (
            subtasks.map((subtask, index) => {
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
            })
          ) : snoozedUntilLast || snoozedTasks.length > 0 ? (
            <div className="p-4 text-center">
              <p className="text-muted-foreground">Orders snoozed according to your preference</p>
              <Button 
                variant="outline" 
                className="mt-2"
                onClick={clearSnooze}
              >
                Cancel Snooze
              </Button>
            </div>
          ) : (
            <div className="p-4 text-center">
              <p className="text-muted-foreground">No {isExpress ? 'express' : 'standard'} orders available</p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default OrderCategorySection;
