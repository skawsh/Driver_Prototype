
import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Scale } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';

const OrderDetailsPage = () => {
  const { taskId, orderId } = useParams<{ taskId: string; orderId: string }>();
  const navigate = useNavigate();
  
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
    // Navigate back to the task success page
    navigate(`/task-success/${taskId}/${orderId}`);
  };
  
  const handleEditItem = (sectionId: string, itemId: number) => {
    // For now, just log the edit action
    console.log(`Edit item ${itemId} in section ${sectionId}`);
  };
  
  const handleAddItem = () => {
    // For now, just log the add action
    console.log("Add new item");
  };
  
  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-lg mx-auto">
        {/* Header with back button */}
        <div className="flex items-center mb-6">
          <Button variant="ghost" size="icon" onClick={handleBack} className="mr-2">
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <h1 className="text-xl font-semibold">ID {orderData.id}</h1>
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
            <div className="flex items-center">
              <span className="text-gray-400 mr-1">——</span>
              <span className="font-medium">Kg</span>
            </div>
          </div>
        </div>
        
        {/* Clothing items section */}
        <div className="bg-white rounded-xl p-6 mb-6">
          <h3 className="font-semibold mb-4">Add Clothing items</h3>
          
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
        
        {/* Action buttons - we're not implementing their functionality for now */}
        <div className="grid grid-cols-2 gap-4">
          <Button variant="secondary" className="bg-green-100 text-green-600 hover:bg-green-200">
            Request sack edit
          </Button>
          <Button>
            Save changes
          </Button>
        </div>
      </div>
    </div>
  );
};

export default OrderDetailsPage;
