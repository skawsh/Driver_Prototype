
import React from 'react';
import TaskCard from '@/components/TaskCard';
import { Task } from '@/types/task';

// Sample data
const sampleTasks: Task[] = [
  {
    id: '1',
    orderNumber: '12345',
    items: 5,
    status: 'pending',
    subtasks: [
      {
        id: 'sub1',
        type: 'pickup',
        status: 'pending',
        enabled: true,
        location: {
          latitude: 40.7128,
          longitude: -74.0060,
          address: '123 Main St, New York, NY'
        },
        customerName: 'John Doe'
      }
    ]
  },
  {
    id: '2',
    orderNumber: '67890',
    items: 3,
    status: 'in-progress',
    subtasks: [
      {
        id: 'sub2',
        type: 'drop',
        status: 'pending',
        enabled: true,
        location: {
          latitude: 34.0522,
          longitude: -118.2437,
          address: '456 Oak St, Los Angeles, CA'
        },
        customerName: 'Jane Smith'
      }
    ]
  }
];

const Index = () => {
  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-6">My Tasks</h1>
      <div className="grid gap-4">
        {sampleTasks.map((task) => (
          <TaskCard key={task.id} task={task} />
        ))}
      </div>
    </div>
  );
};

export default Index;
