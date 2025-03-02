
import React, { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, Scale } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Separator } from '@/components/ui/separator';
import { toast } from 'sonner';

interface ClothingItem {
  name: string;
  quantity: number;
}

const TaskDetails = () => {
  const navigate = useNavigate();
  const { taskId, orderId } = useParams();
  const [actualWeight, setActualWeight] = useState<string>('');
  const [hasChanges, setHasChanges] = useState<boolean>(false);
  
  // Sample data for demonstration
  const estimatedWeight = 2.5;
  const [washAndFoldItems, setWashAndFoldItems] = useState<ClothingItem[]>([
    { name: 'Shirt', quantity: 1 },
    { name: 'pant', quantity: 2 },
    { name: 'Saree', quantity: 2 },
    { name: 'T-Shirt', quantity: 3 }
  ]);
  
  const [dryCleaningItems, setDryCleaningItems] = useState<ClothingItem[]>([
    { name: 'Coat', quantity: 1 },
    { name: 'Dress', quantity: 2 },
    { name: 'Jacket', quantity: 1 }
  ]);
  
  const handleGoBack = () => {
    navigate(-1);
  };
  
  const handleRequestSackEdit = () => {
    toast.success("Sack edit request submitted", {
      description: "Your request has been sent to the admin",
    });
  };
  
  const handleAddItems = () => {
    toast.info("Add items functionality", {
      description: "This would open an item editor in a real app",
    });
    setHasChanges(true);
  };

  const handleSaveChanges = () => {
    if (actualWeight || hasChanges) {
      toast.success("Changes saved successfully", {
        description: `Actual weight: ${actualWeight || "Not specified"} kg`,
      });
      setHasChanges(false);
    } else {
      toast.info("No changes to save", {
        description: "Please make changes before saving",
      });
    }
  };
  
  const handleWeightChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setActualWeight(e.target.value);
    setHasChanges(true);
  };
  
  return (
    <div className="bg-blue-100 min-h-screen p-4 flex flex-col">
      {/* Header with back button and order ID */}
      <div className="flex items-center mb-4">
        <Button 
          variant="ghost" 
          className="p-0 h-auto mr-2" 
          onClick={handleGoBack}
        >
          <ArrowLeft className="h-6 w-6 text-black" />
        </Button>
        <div className="text-lg font-bold">ID {orderId || '123456'}P</div>
      </div>
      
      {/* Main content */}
      <div className="bg-white rounded-lg p-4 flex-1 shadow-md">
        <div className="flex items-center justify-center mb-2">
          <Scale className="h-5 w-5 mr-2" />
          <h2 className="text-lg font-semibold">Weight details</h2>
        </div>
        
        <div className="grid grid-cols-3 gap-2 mb-4">
          <div className="col-span-2 text-left">Estimated weight</div>
          <div className="text-right">{estimatedWeight} Kg</div>
          
          <div className="col-span-2 text-left">Actual weight</div>
          <div className="flex justify-end">
            <Input 
              type="number" 
              className="w-20 h-8 text-right p-1 border-b-2 border-t-0 border-x-0 rounded-none focus:ring-0" 
              placeholder="___"
              value={actualWeight}
              onChange={handleWeightChange}
            />
            <span className="ml-1">Kg</span>
          </div>
        </div>
        
        <h3 className="font-semibold mb-2">Add Clothing items</h3>
        <h4 className="font-bold text-center mb-2">Wash & Fold</h4>
        
        <ul className="mb-4">
          {washAndFoldItems.map((item, index) => (
            <li key={`wash-${index}`} className="grid grid-cols-6 mb-1">
              <div className="col-span-1">{index + 1}.</div>
              <div className="col-span-4 text-left">{item.name}</div>
              <div className="col-span-1">X {item.quantity}</div>
            </li>
          ))}
        </ul>
        
        <button 
          onClick={handleAddItems}
          className="text-left text-blue-600 font-semibold mb-4 flex items-center"
        >
          Add or edit items (+)
        </button>
        
        <Separator className="my-4" />
        
        <h4 className="font-bold text-center mb-2">Dry cleaning</h4>
        <ul className="mb-4">
          {dryCleaningItems.map((item, index) => (
            <li key={`dry-${index}`} className="grid grid-cols-6 mb-1">
              <div className="col-span-1">{index + 1}.</div>
              <div className="col-span-4 text-left">{item.name}</div>
              <div className="col-span-1">X {item.quantity}</div>
            </li>
          ))}
        </ul>
      </div>
      
      {/* Footer with buttons */}
      <div className="mt-4 flex justify-center gap-4">
        <Button 
          className="bg-green-300 text-black font-semibold rounded-md px-8 py-2 hover:bg-green-400"
          onClick={handleRequestSackEdit}
        >
          Request sack edit
        </Button>
        
        <Button 
          className="bg-blue-500 text-white font-semibold rounded-md px-8 py-2 hover:bg-blue-600"
          onClick={handleSaveChanges}
        >
          Save changes
        </Button>
      </div>
    </div>
  );
};

export default TaskDetails;
