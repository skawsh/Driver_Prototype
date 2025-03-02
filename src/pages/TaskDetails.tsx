
import React, { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Scale, Plus, ArrowLeft } from 'lucide-react';
import { toast } from 'sonner';

const TaskDetails = () => {
  const navigate = useNavigate();
  const { taskId } = useParams();
  const [actualWeight, setActualWeight] = useState<string>('');
  
  const washAndFoldItems = [
    { name: 'Shirt', quantity: 1 },
    { name: 'pant', quantity: 2 },
    { name: 'Saree', quantity: 2 },
    { name: 'T-Shirt', quantity: 3 },
  ];
  
  const dryCleaningItems = [
    { name: 'Coat', quantity: 1 },
    { name: 'Dress', quantity: 2 },
    { name: 'Jacket', quantity: 1 },
  ];
  
  const handleGoBack = () => {
    navigate('/');
  };
  
  const handleRequestSackEdit = () => {
    toast.success('Sack edit requested', {
      description: 'Your request has been submitted',
    });
  };
  
  const handleAddOrEditItems = () => {
    toast.info('Add or edit items', {
      description: 'This feature would open an item editor in a real app',
    });
  };
  
  return (
    <div className="py-6 md:py-8 relative">
      <div className="mb-6 bg-sky-400 rounded-t-lg p-4 -mx-6 md:-mx-8 flex justify-between items-center">
        <Button 
          onClick={handleGoBack} 
          variant="ghost" 
          className="text-black p-1"
        >
          <ArrowLeft className="h-6 w-6 text-black" />
        </Button>
        <div className="text-lg font-bold text-black">ID {taskId}P</div>
      </div>
      
      <Card className="mb-4 shadow-sm">
        <CardContent className="p-4">
          <div className="flex items-center mb-3">
            <Scale className="h-5 w-5 mr-2" />
            <h2 className="text-lg font-semibold">Weight details</h2>
          </div>
          
          <div className="grid grid-cols-3 gap-2 mb-3">
            <div className="col-span-2">Estimated weight</div>
            <div className="text-right">2.5 Kg</div>
          </div>
          
          <div className="grid grid-cols-3 gap-2 mb-3">
            <div className="col-span-2">Actual weight</div>
            <div className="flex justify-end">
              <Input 
                value={actualWeight}
                onChange={(e) => setActualWeight(e.target.value)}
                className="w-16 h-7 text-right" 
                placeholder="__"
              />
              <span className="ml-1">Kg</span>
            </div>
          </div>
        </CardContent>
      </Card>
      
      <Card className="mb-4 shadow-sm">
        <CardContent className="p-4">
          <h3 className="font-medium mb-2">Add Clothing items</h3>
          <h4 className="font-bold mb-2">Wash & Fold</h4>
          
          <ul className="mb-4">
            {washAndFoldItems.map((item, index) => (
              <li key={index} className="grid grid-cols-3 mb-1">
                <div className="col-span-2">{index + 1}. {item.name}</div>
                <div className="text-right">X {item.quantity}</div>
              </li>
            ))}
          </ul>
          
          <div 
            className="flex items-center mb-3 text-primary cursor-pointer"
            onClick={handleAddOrEditItems}
          >
            <span className="underline font-medium">Add or edit items</span>
            <Plus className="h-4 w-4 ml-1" />
          </div>
        </CardContent>
      </Card>
      
      <Card className="mb-4 shadow-sm">
        <CardContent className="p-4">
          <h4 className="font-bold mb-2">Dry cleaning</h4>
          
          <ul className="mb-4">
            {dryCleaningItems.map((item, index) => (
              <li key={index} className="grid grid-cols-3 mb-1">
                <div className="col-span-2">{index + 1}. {item.name}</div>
                <div className="text-right">X {item.quantity}</div>
              </li>
            ))}
          </ul>
        </CardContent>
      </Card>
      
      <div className="flex justify-center mt-6">
        <Button 
          onClick={handleRequestSackEdit}
          className="bg-green-400 hover:bg-green-500 text-black font-semibold rounded-xl px-8 py-2"
        >
          Request sack edit
        </Button>
      </div>
    </div>
  );
};

export default TaskDetails;
