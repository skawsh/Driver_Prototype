
import React from 'react';
import { Button } from '@/components/ui/button';

const Index = () => {
  // Test data for demonstration
  const testTaskId = "task123";
  const testOrderId = "order456";

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-2xl font-bold mb-6">Welcome to Task Management</h1>
      
      <div className="space-y-4 max-w-md">
        <h2 className="text-lg font-medium">Test Navigation</h2>
        <p className="text-gray-600 mb-4">
          Click the buttons below to test the task and order detail flow:
        </p>
        
        <div className="space-y-2">
          <Button 
            className="w-full"
            to={`/task-success/${testTaskId}/${testOrderId}`}
          >
            Go to Task Success Page
          </Button>
          
          <Button 
            className="w-full"
            to={`/order-details/${testTaskId}/${testOrderId}`}
          >
            Go directly to Order Details Page
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Index;
