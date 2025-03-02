
import React from 'react';
import { Button } from '@/components/ui/button';
import { Timer, Zap } from 'lucide-react';

interface OrderTypeSelectorProps {
  selectedWashType: 'express' | 'standard';
  setSelectedWashType: (type: 'express' | 'standard') => void;
  expressOrdersCount: number;
  standardOrdersCount: number;
}

const OrderTypeSelector = ({ 
  selectedWashType, 
  setSelectedWashType, 
  expressOrdersCount, 
  standardOrdersCount 
}: OrderTypeSelectorProps) => {
  return (
    <div className="flex flex-wrap gap-3 mb-2">
      <Button 
        variant={selectedWashType === 'express' ? "default" : "outline"}
        onClick={() => setSelectedWashType('express')}
        className="rounded-full flex items-center gap-1"
      >
        <Zap className="h-4 w-4 text-amber-500" />
        Express ({expressOrdersCount})
      </Button>
      <Button 
        variant={selectedWashType === 'standard' ? "default" : "outline"}
        onClick={() => setSelectedWashType('standard')}
        className="rounded-full flex items-center gap-1"
      >
        <Timer className="h-4 w-4 text-blue-500" />
        Standard ({standardOrdersCount})
      </Button>
    </div>
  );
};

export default OrderTypeSelector;
