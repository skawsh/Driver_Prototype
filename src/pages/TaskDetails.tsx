
import React, { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, Scale, Plus, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Separator } from '@/components/ui/separator';
import { Sheet, SheetContent, SheetHeader, SheetTitle } from '@/components/ui/sheet';
import { Card } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
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
  const [isSheetOpen, setIsSheetOpen] = useState<boolean>(false);
  const [editingCategory, setEditingCategory] = useState<'wash' | 'dry'>('wash');
  const [editingItem, setEditingItem] = useState<ClothingItem | null>(null);
  const [newItemName, setNewItemName] = useState<string>('');
  const [newItemQuantity, setNewItemQuantity] = useState<string>('1');
  
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
  
  const openAddItemSheet = (category: 'wash' | 'dry') => {
    setEditingCategory(category);
    setEditingItem(null);
    setNewItemName('');
    setNewItemQuantity('1');
    setIsSheetOpen(true);
  };

  const openEditItemSheet = (item: ClothingItem, category: 'wash' | 'dry') => {
    setEditingCategory(category);
    setEditingItem(item);
    setNewItemName(item.name);
    setNewItemQuantity(item.quantity.toString());
    setIsSheetOpen(true);
  };

  const handleSaveItem = () => {
    if (!newItemName.trim()) {
      toast.error("Item name is required");
      return;
    }

    const quantity = parseInt(newItemQuantity) || 1;
    
    if (editingItem) {
      // Editing existing item
      if (editingCategory === 'wash') {
        setWashAndFoldItems(prev => 
          prev.map(item => 
            item === editingItem ? { name: newItemName, quantity } : item
          )
        );
      } else {
        setDryCleaningItems(prev => 
          prev.map(item => 
            item === editingItem ? { name: newItemName, quantity } : item
          )
        );
      }
      toast.success("Item updated successfully");
    } else {
      // Adding new item
      const newItem = { name: newItemName, quantity };
      if (editingCategory === 'wash') {
        setWashAndFoldItems(prev => [...prev, newItem]);
      } else {
        setDryCleaningItems(prev => [...prev, newItem]);
      }
      toast.success("New item added successfully");
    }

    setIsSheetOpen(false);
    setHasChanges(true);
  };

  const handleDeleteItem = (item: ClothingItem, category: 'wash' | 'dry') => {
    if (category === 'wash') {
      setWashAndFoldItems(prev => prev.filter(i => i !== item));
    } else {
      setDryCleaningItems(prev => prev.filter(i => i !== item));
    }
    toast.success("Item removed successfully");
    setHasChanges(true);
  };

  const handleAddItems = (category: 'wash' | 'dry') => {
    openAddItemSheet(category);
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
            <li key={`wash-${index}`} className="grid grid-cols-6 mb-1 items-center">
              <div className="col-span-1">{index + 1}.</div>
              <div className="col-span-3 text-left">{item.name}</div>
              <div className="col-span-1">X {item.quantity}</div>
              <div className="col-span-1 flex justify-end">
                <Button 
                  variant="ghost" 
                  size="icon" 
                  className="h-6 w-6 p-0" 
                  onClick={() => openEditItemSheet(item, 'wash')}
                >
                  <span className="text-xs">Edit</span>
                </Button>
              </div>
            </li>
          ))}
        </ul>
        
        <button 
          onClick={() => handleAddItems('wash')}
          className="text-left text-blue-600 font-semibold mb-4 flex items-center"
        >
          Add or edit items (+)
        </button>
        
        <Separator className="my-4" />
        
        <h4 className="font-bold text-center mb-2">Dry cleaning</h4>
        <ul className="mb-4">
          {dryCleaningItems.map((item, index) => (
            <li key={`dry-${index}`} className="grid grid-cols-6 mb-1 items-center">
              <div className="col-span-1">{index + 1}.</div>
              <div className="col-span-3 text-left">{item.name}</div>
              <div className="col-span-1">X {item.quantity}</div>
              <div className="col-span-1 flex justify-end">
                <Button 
                  variant="ghost" 
                  size="icon" 
                  className="h-6 w-6 p-0" 
                  onClick={() => openEditItemSheet(item, 'dry')}
                >
                  <span className="text-xs">Edit</span>
                </Button>
              </div>
            </li>
          ))}
        </ul>
        
        <button 
          onClick={() => handleAddItems('dry')}
          className="text-left text-blue-600 font-semibold mb-4 flex items-center"
        >
          Add or edit items (+)
        </button>
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

      {/* Add/Edit Item Sheet */}
      <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
        <SheetContent>
          <SheetHeader>
            <SheetTitle>{editingItem ? 'Edit Item' : 'Add New Item'}</SheetTitle>
          </SheetHeader>
          <div className="py-6">
            <Card className="p-4">
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="itemName">Item Name</Label>
                  <Input
                    id="itemName"
                    placeholder="Enter item name"
                    value={newItemName}
                    onChange={(e) => setNewItemName(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="itemQuantity">Quantity</Label>
                  <Input
                    id="itemQuantity"
                    type="number"
                    min="1"
                    value={newItemQuantity}
                    onChange={(e) => setNewItemQuantity(e.target.value)}
                  />
                </div>
                <div className="flex justify-between gap-2">
                  {editingItem && (
                    <Button 
                      variant="destructive" 
                      onClick={() => {
                        handleDeleteItem(editingItem, editingCategory);
                        setIsSheetOpen(false);
                      }}
                    >
                      <Trash2 className="mr-2" />
                      Delete
                    </Button>
                  )}
                  <Button 
                    className={`${!editingItem ? 'w-full' : ''} bg-blue-500 hover:bg-blue-600`}
                    onClick={handleSaveItem}
                  >
                    <Plus className="mr-2" />
                    {editingItem ? 'Update' : 'Add'} Item
                  </Button>
                </div>
              </div>
            </Card>
          </div>
        </SheetContent>
      </Sheet>
    </div>
  );
};

export default TaskDetails;
