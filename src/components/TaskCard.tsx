
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Task } from '@/types/task';

interface TaskCardProps {
  task: Task;
}

const TaskCard: React.FC<TaskCardProps> = ({ task }) => {
  const navigate = useNavigate();

  const handleViewDetails = () => {
    // Navigate to the task details page with the task ID and order number as URL parameters
    navigate(`/task/${task.id}/${task.orderNumber}`);
  };

  return (
    <Card className="mb-4">
      <CardHeader>
        <CardTitle className="text-xl">Order #{task.orderNumber}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="text-sm">
          <p>Items: {task.items}</p>
          <p>Status: {task.status}</p>
        </div>
      </CardContent>
      <CardFooter className="flex justify-end">
        <Button onClick={handleViewDetails} className="flex items-center">
          View Details <ArrowRight className="ml-2 h-4 w-4" />
        </Button>
      </CardFooter>
    </Card>
  );
};

export default TaskCard;
