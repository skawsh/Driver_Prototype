
import React, { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, Scale, Save, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Separator } from '@/components/ui/separator';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';

interface ClothingItem {
  name: string;
  quantity: number;
  id: string;
}

const TaskDetails = () => {
  const navigate = useNavigate();
  const { taskId, orderId } = useParams();
  const [actualWeight, setActualWeight] = useState<string>('');
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [newItemName, setNewItemName] = useState<string>('');
  const [newItemQuantity, setNewItemQuantity] = useState<string>('1');
  const [itemType, setItemType] = useState<'wash' | 'dry'>('wash');
  
  // Sample data for demonstration
  const estimatedWeight = 2.5;
  const [washAndFoldItems, setWashAndFoldItems] = useState<ClothingItem[]>([
    { id: 'w1', name: 'Shirt', quantity: 1 },
    { id: 'w2', name: 'pant', quantity: 2 },
    { id: 'w3', name: 'Saree', quantity: 2 },
    { id: 'w4', name: 'T-Shirt', quantity: 3 }
  ]);
  
  const [dryCleaningItems, setDryCleaningItems] = useState<ClothingItem[]>([
    { id: 'd1', name: 'Coat', quantity: 1 },
    { id: 'd2', name: 'Dress', quantity: 2 },
    { id: 'd3', name: 'Jacket', quantity: 1 }
  ]);
  
  const handleGoBack = () => {
    navigate(-1);
  };
  
  const handleRequestSackEdit = () => {
    toast.success("Sack edit request submitted", {
      description: "Your request has been sent to the admin",
    });
  };
  
  const handleSaveWeight = () => {
    if (!actualWeight) {
      toast.error("Please enter actual weight");
      return;
    }
    
    toast.success("Weight saved successfully", {
      description: `Actual weight set to ${actualWeight} Kg`,
    });
  };
  
  const toggleEditMode = () => {
    setIsEditing(!isEditing);
    setNewItemName('');
    setNewItemQuantity('1');
  };
  
  const addItem = () => {
    if (!newItemName.trim()) {
      toast.error("Please enter item name");
      return;
    }
    
    if (parseInt(newItemQuantity) < 1) {
      toast.error("Quantity must be at least 1");
      return;
    }
    
    const newItem: ClothingItem = {
      id: `${itemType === 'wash' ? 'w' : 'd'}${Date.now()}`,
      name: newItemName.trim(),
      quantity: parseInt(newItemQuantity)
    };
    
    if (itemType === 'wash') {
      setWashAndFoldItems([...washAndFoldItems, newItem]);
    } else {
      setDryCleaningItems([...dryCleaningItems, newItem]);
    }
    
    toast.success(`Added ${newItemQuantity} ${newItemName}`, {
      description: `Item added to ${itemType === 'wash' ? 'Wash & Fold' : 'Dry Cleaning'}`
    });
    
    setNewItemName('');
    setNewItemQuantity('1');
  };
  
  const removeItem = (id: string, type: 'wash' | 'dry') => {
    if (type === 'wash') {
      setWashAndFoldItems(washAndFoldItems.filter(item => item.id !== id));
    } else {
      setDryCleaningItems(dryCleaningItems.filter(item => item.id !== id));
    }
    
    toast.info("Item removed", {
      description: "The item has been removed from the list"
    });
  };
  
  return (
    <div className="bg-blue-100 min-h-screen p-4 flex flex-col">
      {/* Header with back button and Order ID */}
      <div className="flex items-center mb-4">
        <Button 
          variant="ghost" 
          className="p-0 h-auto mr-3" 
          onClick={handleGoBack}
        >
          <ArrowLeft className="h-6 w-6 text-black" />
        </Button>
        <div className="text-lg font-bold">ID {orderId || '123456'}P</div>
        <div className="flex-1"></div>
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
          <div className="flex justify-end items-center">
            <Input 
              type="number" 
              className="w-20 h-8 text-right p-1 border-b-2 border-t-0 border-x-0 rounded-none focus:ring-0" 
              placeholder="___"
              value={actualWeight}
              onChange={(e) => setActualWeight(e.target.value)}
            />
            <span className="ml-1 mr-2">Kg</span>
            <Button 
              size="sm"
              variant="outline"
              onClick={handleSaveWeight}
              className="h-8 py-0 px-2"
            >
              <Save className="h-4 w-4" />
            </Button>
          </div>
        </div>
        
        <div className="flex justify-between items-center mb-2">
          <h3 className="font-semibold">Clothing items</h3>
          <Button 
            variant="outline" 
            size="sm" 
            onClick={toggleEditMode}
            className="h-8 text-sm"
          >
            {isEditing ? "Done" : "Add/Edit Items"}
          </Button>
        </div>
        
        {isEditing && (
          <div className="bg-gray-50 p-3 rounded-md mb-4">
            <div className="grid grid-cols-2 gap-3 mb-3">
              <div>
                <Label htmlFor="itemName">Item Name</Label>
                <Input 
                  id="itemName"
                  value={newItemName}
                  onChange={(e) => setNewItemName(e.target.value)}
                  placeholder="Enter item name"
                  className="mt-1"
                />
              </div>
              <div>
                <Label htmlFor="itemQuantity">Quantity</Label>
                <Input 
                  id="itemQuantity"
                  type="number"
                  min="1"
                  value={newItemQuantity}
                  onChange={(e) => setNewItemQuantity(e.target.value)}
                  className="mt-1"
                />
              </div>
            </div>
            
            <div className="flex space-x-3 mb-3">
              <Button 
                type="button"
                variant={itemType === 'wash' ? 'default' : 'outline'}
                className="flex-1"
                onClick={() => setItemType('wash')}
              >
                Wash & Fold
              </Button>
              <Button 
                type="button"
                variant={itemType === 'dry' ? 'default' : 'outline'}
                className="flex-1"
                onClick={() => setItemType('dry')}
              >
                Dry Cleaning
              </Button>
            </div>
            
            <Button 
              onClick={addItem}
              className="w-full"
            >
              <Plus className="h-4 w-4 mr-1" /> Add Item
            </Button>
          </div>
        )}
        
        <h4 className="font-bold text-center mb-2">Wash & Fold</h4>
        
        <ul className="mb-4">
          {washAndFoldItems.map((item, index) => (
            <li key={item.id} className="grid grid-cols-6 mb-1">
              <div className="col-span-1">{index + 1}.</div>
              <div className="col-span-3 text-left">{item.name}</div>
              <div className="col-span-1">X {item.quantity}</div>
              {isEditing && (
                <div className="col-span-1">
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    className="h-6 w-6 p-0 text-red-500"
                    onClick={() => removeItem(item.id, 'wash')}
                  >
                    ×
                  </Button>
                </div>
              )}
            </li>
          ))}
        </ul>
        
        <Separator className="my-4" />
        
        <h4 className="font-bold text-center mb-2">Dry cleaning</h4>
        <ul className="mb-4">
          {dryCleaningItems.map((item, index) => (
            <li key={item.id} className="grid grid-cols-6 mb-1">
              <div className="col-span-1">{index + 1}.</div>
              <div className="col-span-3 text-left">{item.name}</div>
              <div className="col-span-1">X {item.quantity}</div>
              {isEditing && (
                <div className="col-span-1">
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    className="h-6 w-6 p-0 text-red-500"
                    onClick={() => removeItem(item.id, 'dry')}
                  >
                    ×
                  </Button>
                </div>
              )}
            </li>
          ))}
        </ul>
      </div>
      
      {/* Bottom Button */}
      <div className="mt-4 flex justify-center">
        <Button 
          className="bg-green-300 text-black font-semibold rounded-md px-8 py-2 hover:bg-green-400"
          onClick={handleRequestSackEdit}
        >
          Request sack edit
        </Button>
      </div>
    </div>
  );
};

export default TaskDetails;
