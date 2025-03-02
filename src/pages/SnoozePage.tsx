
import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Clock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';

const SnoozePage = () => {
  const { taskId, orderId } = useParams<{ taskId: string; orderId: string }>();
  const navigate = useNavigate();
  const [snoozeOption, setSnoozeOption] = useState<string>('next');

  const handleBack = () => {
    navigate(-1);
  };

  const handleSnooze = () => {
    const snoozeMessage = snoozeOption === 'next' 
      ? "You will be notified after completion of the next order" 
      : "You will be notified after completion of the last order";
    
    toast.success("Snooze activated!", {
      description: snoozeMessage,
    });
    
    setTimeout(() => {
      navigate('/');
    }, 1500);
  };

  return (
    <div className="h-screen w-full bg-gray-50 p-4">
      <div className="flex items-center mb-6">
        <Button variant="ghost" size="icon" onClick={handleBack}>
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <h1 className="text-xl font-semibold ml-2">Snooze Settings</h1>
      </div>
      
      <Card className="overflow-hidden rounded-3xl border-2 border-primary shadow-lg max-w-md mx-auto">
        <CardContent className="p-6">
          <div className="flex items-center mb-6">
            <Clock className="h-6 w-6 text-blue-500 mr-2" />
            <h2 className="text-lg font-bold">Select the duration of snooze</h2>
          </div>
          
          <RadioGroup 
            value={snoozeOption} 
            onValueChange={setSnoozeOption}
            className="space-y-4 mb-8"
          >
            <div className="flex items-start space-x-2">
              <RadioGroupItem value="next" id="next" />
              <Label htmlFor="next" className="font-medium cursor-pointer">
                Snooze until completion of next order
              </Label>
            </div>
            <div className="flex items-start space-x-2">
              <RadioGroupItem value="last" id="last" />
              <Label htmlFor="last" className="font-medium cursor-pointer">
                Snooze to the last order in the list
              </Label>
            </div>
          </RadioGroup>
          
          <Button 
            className="w-full h-12 text-lg font-semibold bg-blue-500 hover:bg-blue-600 rounded-full"
            onClick={handleSnooze}
          >
            Confirm
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default SnoozePage;
