
import React from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { CheckCircle, User } from 'lucide-react';
import { Task } from '@/types/task';
import { getSubtaskTypeName } from './CardTaskType';

interface CompletedTasksListProps {
  completedTasks: Task[];
}

const CompletedTasksList = ({ completedTasks }: CompletedTasksListProps) => {
  if (completedTasks.length === 0) return null;
  
  return (
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
  );
};

export default CompletedTasksList;
