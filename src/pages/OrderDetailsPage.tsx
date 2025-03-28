
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Scale, Copy, Minus, Plus, Trash2, CheckCircle, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Card } from '@/components/ui/card';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetFooter } from '@/components/ui/sheet';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';

const OrderDetailsPage = () => {
  const { toast } = useToast();
  const { taskId, orderId } = useParams<{ taskId: string; orderId: string }>();
  const navigate = useNavigate();
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [hasRequestedEdit, setHasRequestedEdit] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isRequestEditModalOpen, setIsRequestEditModalOpen] = useState(false);
  const [currentEditItem, setCurrentEditItem] = useState<{id: number, name: string, quantity: number, section: string} | null>(null);
  const [newItem, setNewItem] = useState<{name: string, quantity: number}>({name: '', quantity: 1});
  const [actualWeight, setActualWeight] = useState<string>('');
  const [hasChanges, setHasChanges] = useState(false);
  const [requestOrderId, setRequestOrderId] = useState('');
  const [validationError, setValidationError] = useState('');
  
  const [orderData, setOrderData] = useState({
    id: orderId || "1234P",
    estimatedWeight: "2.5",
    actualWeight: "",
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
    ],
    savedChanges: false
  });

  useEffect(() => {
    if (actualWeight !== orderData.actualWeight || isEditing) {
      setHasChanges(true);
    }
  }, [actualWeight, isEditing, orderData.actualWeight]);
  
  const handleBack = () => {
    navigate(-1);
  };
  
  const handleCopyId = () => {
    navigator.clipboard.writeText(orderData.id);
    toast({
      title: "Success",
      description: "Order ID copied to clipboard",
      duration: 3000,
    });
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
    toast({
      title: "Success",
      description: "Item updated successfully",
      duration: 3000,
    });
  };
  
  const handleDeleteItem = () => {
    if (!currentEditItem) return;
    
    setOrderData(prevData => {
      const updatedData = {...prevData};
      
      if (currentEditItem.section === 'washAndFold') {
        updatedData.washAndFold = updatedData.washAndFold.filter(item => 
          item.id !== currentEditItem.id
        );
      }
      
      return updatedData;
    });
    
    setIsEditModalOpen(false);
    setCurrentEditItem(null);
    toast({
      title: "Success",
      description: "Item deleted successfully",
      duration: 3000,
    });
  };
  
  const handleOpenAddItemModal = () => {
    setNewItem({name: '', quantity: 1});
    setIsAddModalOpen(true);
  };
  
  const handleAddNewItem = () => {
    if (newItem.name.trim() === '') {
      toast({
        title: "Error",
        description: "Please enter a clothing item name",
        variant: "destructive",
        duration: 3000,
      });
      return;
    }
    
    setOrderData(prevData => {
      const newId = Math.max(0, ...prevData.washAndFold.map(item => item.id)) + 1;
      
      return {
        ...prevData,
        washAndFold: [
          ...prevData.washAndFold,
          { id: newId, name: newItem.name, quantity: newItem.quantity }
        ]
      };
    });
    
    setIsAddModalOpen(false);
    setNewItem({name: '', quantity: 1});
    setHasChanges(true);
    toast({
      title: "Success",
      description: "New item added successfully",
      duration: 3000,
    });
  };
  
  const handleRequestSackEdit = () => {
    setIsRequestEditModalOpen(true);
  };
  
  const handleSubmitSackEditRequest = () => {
    setIsSaving(true);
    setIsRequestEditModalOpen(false);
    
    setTimeout(() => {
      setHasRequestedEdit(true);
      setIsEditing(true);
      setIsSaving(false);
      toast({
        title: "Success",
        description: "Edit request sent. Now user will modify the order details.",
        duration: 3000,
      });
    }, 1000);
  };
  
  const handleCloseRequestModal = () => {
    setIsRequestEditModalOpen(false);
    setRequestOrderId('');
  };
  
  const handleSaveChanges = () => {
    // Validate actual weight is entered
    if (!actualWeight || actualWeight.trim() === '') {
      setValidationError('Please enter the actual weight');
      toast({
        title: "Error",
        description: "Please enter the actual weight",
        variant: "destructive",
        duration: 3000,
      });
      return;
    }
    
    // Clear any validation errors
    setValidationError('');
    setIsSaving(true);
    
    setTimeout(() => {
      setOrderData(prev => ({
        ...prev,
        actualWeight: actualWeight,
        savedChanges: true
      }));
      
      setIsEditing(false);
      setIsSaving(false);
      setHasChanges(false);
      
      toast({
        title: "Order Updated",
        description: `Actual weight: ${actualWeight} Kg`,
        duration: 5000,
      });
    }, 1500);
  };
  
  const handleCompletePickup = () => {
    // Validate actual weight is entered
    if (!actualWeight && !orderData.actualWeight) {
      setValidationError('Please enter the actual weight');
      toast({
        title: "Error",
        description: "Please enter the actual weight before completing pickup",
        variant: "destructive",
        duration: 3000,
      });
      return;
    }
    
    setIsSaving(true);
    
    setTimeout(() => {
      toast({
        title: "Success",
        description: "Pickup completed successfully",
        duration: 5000,
      });
      setIsSaving(false);
      
      navigate(`/tasks/success/${taskId}`);
    }, 1500);
  };
  
  const handleQuantityChange = (action: 'increase' | 'decrease', isNewItem: boolean = false) => {
    if (isNewItem) {
      setNewItem(prev => {
        let newQuantity = prev.quantity;
        if (action === 'increase') {
          newQuantity += 1;
        } else {
          newQuantity = Math.max(1, newQuantity - 1);
        }
        return { ...prev, quantity: newQuantity };
      });
    } else if (currentEditItem) {
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
    }
  };
  
  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>, isNewItem: boolean = false) => {
    if (isNewItem) {
      setNewItem({ ...newItem, name: e.target.value });
    } else if (currentEditItem) {
      setCurrentEditItem({ ...currentEditItem, name: e.target.value });
    }
  };

  const handleActualWeightChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setActualWeight(e.target.value);
    // Clear validation error when user enters a value
    if (e.target.value.trim() !== '') {
      setValidationError('');
    }
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
              <span className="text-gray-700">
                Actual weight<span className="text-red-500 ml-1">*</span>
              </span>
              <div className="flex items-center">
                <Input 
                  value={actualWeight} 
                  onChange={handleActualWeightChange}
                  placeholder="Enter weight"
                  type="number"
                  step="0.1"
                  min="0"
                  className={`w-20 mr-2 ${validationError ? 'border-red-500 focus-visible:ring-red-500' : ''}`}
                  required
                />
                <span className="font-medium">Kg</span>
              </div>
            </div>
            
            {validationError && (
              <div className="text-red-500 text-sm mb-4">
                {validationError}
              </div>
            )}
            
            {orderData.savedChanges && orderData.actualWeight && (
              <div className="bg-green-50 p-4 rounded-md border border-green-200 mb-4">
                <h3 className="font-medium text-green-700 mb-2">Saved Information</h3>
                <div className="flex justify-between items-center">
                  <span className="text-gray-700">Actual weight recorded</span>
                  <span className="font-medium">{orderData.actualWeight} Kg</span>
                </div>
              </div>
            )}
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
              onClick={handleOpenAddItemModal}
            >
              Add items
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
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-auto">
          <Button 
            variant="secondary" 
            className="bg-green-100 text-green-600 hover:bg-green-200"
            onClick={handleRequestSackEdit}
            disabled={isSaving}
          >
            {isSaving && hasRequestedEdit ? "Processing..." : "Request sack edit"}
          </Button>
          <Button 
            onClick={handleSaveChanges}
            disabled={isSaving}
          >
            {isSaving && !hasRequestedEdit ? "Saving..." : "Save changes"}
          </Button>
          <Button 
            variant="default" 
            className="bg-blue-500 text-white flex items-center gap-2 hover:bg-blue-600"
            onClick={handleCompletePickup}
            disabled={isSaving}
          >
            <CheckCircle className="h-5 w-5" />
            Complete Pickup
          </Button>
        </div>
      </div>
      
      {/* Request Edit Modal */}
      <div className={`fixed inset-0 bg-black/50 flex items-center justify-center z-50 ${isRequestEditModalOpen ? 'block' : 'hidden'}`}>
        <div className="bg-white rounded-lg w-full max-w-md mx-4 overflow-hidden relative">
          <Button 
            variant="ghost" 
            size="icon" 
            className="absolute right-2 top-2"
            onClick={handleCloseRequestModal}
          >
            <X className="h-4 w-4" />
          </Button>
          
          <div className="p-6">
            <div className="mb-4">
              <Label htmlFor="orderIdInput">Enter the order ID</Label>
              <Input 
                id="orderIdInput"
                value={requestOrderId}
                onChange={(e) => setRequestOrderId(e.target.value)}
                className="mt-2"
                placeholder="Order ID"
              />
            </div>
            
            <Button 
              className="w-full bg-green-400 hover:bg-green-500 text-black"
              onClick={handleSubmitSackEditRequest}
            >
              Request edit
            </Button>
          </div>
        </div>
      </div>
      
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
                  onChange={(e) => handleNameChange(e)}
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
              
              <Button 
                variant="destructive" 
                onClick={handleDeleteItem}
                className="w-full flex items-center justify-center gap-2"
              >
                <Trash2 className="h-4 w-4" />
                Delete Item
              </Button>
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

      <Sheet open={isAddModalOpen} onOpenChange={setIsAddModalOpen}>
        <SheetContent>
          <SheetHeader>
            <SheetTitle>Add New Clothing Item</SheetTitle>
          </SheetHeader>
          
          <div className="py-6 space-y-6">
            <div className="space-y-2">
              <Label htmlFor="newItemName">Clothing Item</Label>
              <Input 
                id="newItemName" 
                value={newItem.name} 
                onChange={(e) => handleNameChange(e, true)}
                placeholder="Enter clothing item name"
                className="text-base" 
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="newQuantity">Quantity</Label>
              <div className="flex items-center space-x-4 bg-gray-50 p-3 rounded-md">
                <Button 
                  variant="outline" 
                  size="icon" 
                  onClick={() => handleQuantityChange('decrease', true)}
                  disabled={newItem.quantity <= 1}
                  className="rounded-full h-8 w-8 p-0 flex items-center justify-center"
                >
                  <Minus className="h-4 w-4" />
                </Button>
                <div className="flex-1 text-center font-medium text-xl">
                  {newItem.quantity}
                </div>
                <Button 
                  variant="outline" 
                  size="icon" 
                  onClick={() => handleQuantityChange('increase', true)}
                  className="rounded-full h-8 w-8 p-0 flex items-center justify-center"
                >
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
          
          <SheetFooter className="mt-auto">
            <Button onClick={() => setIsAddModalOpen(false)} variant="outline" className="w-full sm:w-auto">
              Cancel
            </Button>
            <Button onClick={handleAddNewItem} className="w-full sm:w-auto">
              Add Item
            </Button>
          </SheetFooter>
        </SheetContent>
      </Sheet>
    </div>
  );
};

export default OrderDetailsPage;
