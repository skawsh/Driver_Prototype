
import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Scale, Copy, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { toast } from 'sonner';

const OrderDetailsPage = () => {
  const { taskId, orderId } = useParams<{ taskId: string; orderId: string }>();
  const navigate = useNavigate();
  const [actualWeight, setActualWeight] = useState<string>("");
  const [copied, setCopied] = useState(false);
  
  // Sample data - in a real app, this would come from an API
  const orderData = {
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
  };
  
  const handleBack = () => {
    // Navigate back to the previous page
    navigate(-1);
  };
  
  const handleEditItem = (sectionId: string, itemId: number) => {
    // Log the edit action
    console.log(`Edit item ${itemId} in section ${sectionId}`);
    toast.success(`Editing ${sectionId} item ${itemId}`);
  };
  
  const handleAddItem = () => {
    // Log the add action
    console.log("Add new item");
    toast.success("Adding new item");
  };
  
  const handleCopyOrderId = () => {
    navigator.clipboard.writeText(orderData.id)
      .then(() => {
        setCopied(true);
        toast.success("Order ID copied to clipboard");
        setTimeout(() => setCopied(false), 2000);
      })
      .catch(() => {
        toast.error("Failed to copy order ID");
      });
  };
  
  const handleRequestSackEdit = () => {
    toast.success("Sack edit requested");
  };
  
  const handleSaveChanges = () => {
    toast.success("Changes saved successfully");
  };
  
  const handleWeightChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setActualWeight(e.target.value);
  };
  
  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-lg mx-auto">
        {/* Header with back button, order ID and copy button */}
        <div className="bg-white rounded-xl p-4 mb-6 flex items-center justify-between">
          <div className="flex items-center">
            <Button variant="ghost" size="icon" onClick={handleBack} className="mr-2">
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <h1 className="text-xl font-semibold">ID {orderData.id}</h1>
          </div>
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={handleCopyOrderId} 
            className="text-gray-500"
          >
            {copied ? <Check className="h-5 w-5 text-green-500" /> : <Copy className="h-5 w-5" />}
          </Button>
        </div>
        
        {/* Clothing items section - Wash & Fold First */}
        <div className="bg-white rounded-xl p-6 mb-6">
          <h3 className="font-semibold mb-4">Clothing items</h3>
          
          {/* Wash & Fold section */}
          <div className="mb-6">
            <h4 className="text-center font-medium mb-4">Wash & Fold</h4>
            <div className="space-y-3">
              {orderData.washAndFold.map((item) => (
                <div key={item.id} className="flex justify-between items-center">
                  <div className="flex items-center">
                    <span className="text-gray-500 mr-2">{item.id}.</span>
                    <span>{item.name}</span>
                  </div>
                  <div className="flex items-center justify-between w-1/2">
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
          </div>
          
          <Button 
            variant="ghost" 
            className="text-blue-500 w-full justify-start mb-6"
            onClick={handleAddItem}
          >
            Add or edit items (+)
          </Button>
          
          <Separator className="mb-6" />
          
          {/* Dry cleaning section */}
          <div>
            <h4 className="text-center font-medium mb-4">Dry cleaning</h4>
            <div className="space-y-3">
              {orderData.dryCleaning.map((item) => (
                <div key={item.id} className="flex justify-between items-center">
                  <div className="flex items-center">
                    <span className="text-gray-500 mr-2">{item.id}.</span>
                    <span>{item.name}</span>
                  </div>
                  <div className="flex items-center justify-between w-1/2">
                    <span className="font-medium">X {item.quantity}</span>
                    <Button 
                      variant="ghost" 
                      className="text-blue-500 h-auto py-1 px-2"
                      onClick={() => handleEditItem('dryCleaning', item.id)}
                    >
                      Edit
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </div>
          
          <p className="text-center text-gray-400 text-sm mt-6 italic">
            Other clothing items can only be modified by user
          </p>
        </div>
        
        {/* Weight details section */}
        <div className="bg-white rounded-xl p-6 mb-6">
          <div className="flex items-center justify-center mb-4">
            <Scale className="h-5 w-5 mr-2" />
            <h2 className="text-lg font-medium">Weight details</h2>
          </div>
          
          <div className="flex justify-between items-center mb-3">
            <span className="text-gray-700">Estimated weight</span>
            <span className="font-medium">{orderData.estimatedWeight} Kg</span>
          </div>
          
          <div className="flex justify-between items-center">
            <span className="text-gray-700">Actual weight</span>
            <div className="flex items-center gap-2">
              <Input 
                type="number"
                placeholder="Enter weight"
                value={actualWeight}
                onChange={handleWeightChange}
                className="w-20 text-right"
              />
              <span className="font-medium">Kg</span>
            </div>
          </div>
        </div>
        
        {/* Action buttons */}
        <div className="grid grid-cols-2 gap-4">
          <Button 
            variant="secondary" 
            className="bg-green-100 text-green-600 hover:bg-green-200"
            onClick={handleRequestSackEdit}
          >
            Request sack edit
          </Button>
          <Button onClick={handleSaveChanges}>
            Save changes
          </Button>
        </div>
      </div>
    </div>
  );
};

export default OrderDetailsPage;
