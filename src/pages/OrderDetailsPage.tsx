
import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Scale, Copy, Minus, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Card } from '@/components/ui/card';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetFooter } from '@/components/ui/sheet';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';

const OrderDetailsPage = () => {
  const { taskId, orderId } = useParams<{ taskId: string; orderId: string }>();
  const navigate = useNavigate();
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [hasRequestedEdit, setHasRequestedEdit] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [currentEditItem, setCurrentEditItem] = useState<{id: number, name: string, quantity: number, section: string} | null>(null);
  
  const [orderData, setOrderData] = useState({
    id: orderId || "1234P",
    estimatedWeight: "2.5",
    washAndFold: [
      { id: 1, name: "Shirt", quantity: 1 },
      { id: 2, name: "pant", quantity: 2 },
      { id: 3, name: "Saree", quantity: 2 },
      { id: 4, name: "T-Shirt", quantity: 3 }
    ],
    dryCleaning: [
      { id: 1, name: "Coat", quantity: 1 },
      { id: 2, name: "Dress", quantity: 2 },
      { id: 3, name: "Jacket", quantity: 1 }
    ]
  });
  
  const handleBack = () => {
    navigate(-1);
  };
  
  const handleCopyId = () => {
    navigator.clipboard.writeText(orderData.id);
    toast.success("Order ID copied to clipboard");
  };
  
  const handleEditItem = (sectionId: string, itemId: number) => {
    const section = sectionId === 'washAndFold' ? orderData.washAndFold : orderData.dryCleaning;
    const item = section.find(item => item.id === itemId);
    
    if (item) {
      setCurrentEditItem({
        id: item.id,
        name: item.name,
        quantity: item.quantity,
        section: sectionId
      });
      setIsEditModalOpen(true);
    }
  };
  
  const handleUpdateItem = () => {
    if (!currentEditItem) return;
    
    setOrderData(prevData => {
      const updatedData = {...prevData};
      
      if (currentEditItem.section === 'washAndFold') {
        updatedData.washAndFold = updatedData.washAndFold.map(item => 
          item.id === currentEditItem.id 
            ? { ...item, name: currentEditItem.name, quantity: currentEditItem.quantity } 
            : item
        );
      } else {
        // We don't update dryCleaning since it's not editable
      }
      
      return updatedData;
    });
    
    setIsEditModalOpen(false);
    setCurrentEditItem(null);
    toast.success("Item updated successfully");
  };
  
  const handleAddItem = () => {
    console.log("Add new item");
    toast.info("Add or edit items clicked");
  };
  
  const handleRequestSackEdit = () => {
    setIsSaving(true);
    
    setTimeout(() => {
      setHasRequestedEdit(true);
      setIsEditing(true);
      setIsSaving(false);
      toast.success("Sack edit requested. You can now modify the items.");
    }, 1000);
  };
  
  const handleSaveChanges = () => {
    setIsSaving(true);
    
    setTimeout(() => {
      setIsEditing(false);
      setIsSaving(false);
      toast.success("Changes saved successfully");
      
      navigate(`/tasks/${taskId}`);
    }, 1500);
  };
  
  const handleQuantityChange = (action: 'increase' | 'decrease') => {
    if (!currentEditItem) return;
    
    setCurrentEditItem(prev => {
      if (!prev) return prev;
      
      let newQuantity = prev.quantity;
      if (action === 'increase') {
        newQuantity += 1;
      } else {
        newQuantity = Math.max(1, newQuantity - 1);
      }
      
      return { ...prev, quantity: newQuantity };
    });
  };
  
  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!currentEditItem) return;
    setCurrentEditItem({ ...currentEditItem, name: e.target.value });
  };
  
  return (
    <div className="min-h-screen bg-blue-50 flex flex-col">
      <div className="bg-blue-100 py-3 px-4 flex items-center">
        <Button variant="ghost" size="icon" onClick={handleBack} className="mr-2">
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <h1 className="text-lg font-semibold">ID {orderData.id}</h1>
        <Button variant="ghost" size="icon" onClick={handleCopyId} className="ml-2">
          <Copy className="h-4 w-4" />
        </Button>
      </div>
      
      <div className="flex-1 p-4">
        <Card className="bg-white rounded-xl overflow-hidden mb-4">
          <div className="text-center font-medium py-3 border-b">
            Wash & Fold
          </div>
          
          <div className="p-4">
            <div className="flex items-center mb-4">
              <Scale className="h-5 w-5 mr-2" />
              <h2 className="text-base font-medium">Weight details</h2>
            </div>
            
            <div className="flex justify-between items-center mb-4">
              <span className="text-gray-700">Estimated weight</span>
              <span className="font-medium">{orderData.estimatedWeight} Kg</span>
            </div>
            
            <div className="flex justify-between items-center mb-4">
              <span className="text-gray-700">Actual weight</span>
              <div className="flex items-center">
                <span className="text-gray-400 mr-2">——</span>
                <span className="font-medium">Kg</span>
              </div>
            </div>
          </div>
          
          <Separator />
          
          <div className="p-4">
            <h3 className="font-semibold mb-4">Add Clothing items</h3>
            
            <div className="space-y-4 mb-2">
              {orderData.washAndFold.map((item) => (
                <div key={item.id} className="flex justify-between items-center">
                  <div className="flex items-center">
                    <span className="text-gray-500 mr-2">{item.id}.</span>
                    <span>{item.name}</span>
                  </div>
                  <div className="flex items-center justify-between w-1/3">
                    <span className="font-medium">X {item.quantity}</span>
                    <Button 
                      variant="ghost" 
                      className="text-blue-500 h-auto py-1 px-2"
                      onClick={() => handleEditItem('washAndFold', item.id)}
                    >
                      Edit
                    </Button>
                  </div>
                </div>
              ))}
            </div>
            
            <Button 
              variant="ghost" 
              className="text-blue-500 w-full justify-start mb-4"
              onClick={handleAddItem}
              disabled={!isEditing}
            >
              Add or edit items (+)
            </Button>
            
            <Separator className="mb-4" />
            
            <div className="text-center font-medium mb-4">
              Dry cleaning
            </div>
            
            <div className="space-y-4">
              {orderData.dryCleaning.map((item) => (
                <div key={item.id} className="flex justify-between items-center">
                  <div className="flex items-center">
                    <span className="text-gray-500 mr-2">{item.id}.</span>
                    <span>{item.name}</span>
                  </div>
                  <div className="flex items-center">
                    <span className="font-medium">X {item.quantity}</span>
                  </div>
                </div>
              ))}
            </div>
            
            <p className="text-center text-gray-400 text-sm italic mt-6">
              Other clothing items can only be modified by user
            </p>
          </div>
        </Card>
        
        <div className="grid grid-cols-2 gap-4 mt-auto">
          <Button 
            variant="secondary" 
            className="bg-green-100 text-green-600 hover:bg-green-200"
            onClick={handleRequestSackEdit}
            disabled={isEditing || isSaving}
          >
            {isSaving && hasRequestedEdit ? "Processing..." : "Request sack edit"}
          </Button>
          <Button 
            onClick={handleSaveChanges}
            disabled={!isEditing || isSaving}
          >
            {isSaving && !hasRequestedEdit ? "Saving..." : "Save changes"}
          </Button>
        </div>
      </div>
      
      {/* Edit Item Modal */}
      <Sheet open={isEditModalOpen} onOpenChange={setIsEditModalOpen}>
        <SheetContent>
          <SheetHeader>
            <SheetTitle>Edit Clothing Item</SheetTitle>
          </SheetHeader>
          
          {currentEditItem && (
            <div className="py-6 space-y-6">
              <div className="space-y-2">
                <Label htmlFor="itemName">Clothing Item</Label>
                <Input 
                  id="itemName" 
                  value={currentEditItem.name} 
                  onChange={handleNameChange}
                  placeholder="Clothing item name"
                  className="text-base" 
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="quantity">Quantity</Label>
                <div className="flex items-center space-x-4 bg-gray-50 p-3 rounded-md">
                  <Button 
                    variant="outline" 
                    size="icon" 
                    onClick={() => handleQuantityChange('decrease')}
                    disabled={currentEditItem.quantity <= 1}
                    className="rounded-full h-8 w-8 p-0 flex items-center justify-center"
                  >
                    <Minus className="h-4 w-4" />
                  </Button>
                  <div className="flex-1 text-center font-medium text-xl">
                    {currentEditItem.quantity}
                  </div>
                  <Button 
                    variant="outline" 
                    size="icon" 
                    onClick={() => handleQuantityChange('increase')}
                    className="rounded-full h-8 w-8 p-0 flex items-center justify-center"
                  >
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>
          )}
          
          <SheetFooter className="mt-auto">
            <Button onClick={() => setIsEditModalOpen(false)} variant="outline" className="w-full sm:w-auto">
              Cancel
            </Button>
            <Button onClick={handleUpdateItem} className="w-full sm:w-auto">
              Save Changes
            </Button>
          </SheetFooter>
        </SheetContent>
      </Sheet>
    </div>
  );
};

export default OrderDetailsPage;
