
import React from 'react';
import { CheckCircle } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

interface AllTasksCompletedProps {
  resetTasks: () => void;
}

const AllTasksCompleted = ({ resetTasks }: AllTasksCompletedProps) => {
  return (
    <Card className="w-full p-8 text-center">
      <div className="flex flex-col items-center justify-center space-y-3">
        <CheckCircle className="h-12 w-12 text-primary/50" />
        <h3 className="text-xl font-medium">All tasks completed</h3>
        <p className="text-muted-foreground">You've completed all assigned tasks!</p>
        <Button 
          variant="outline" 
          onClick={resetTasks}
        >
          Reset Tasks
        </Button>
      </div>
    </Card>
  );
};

export default AllTasksCompleted;
