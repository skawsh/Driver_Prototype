
import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, AlertTriangle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { toast } from 'sonner';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

type IssueOption = {
  value: string;
  label: string;
  description: string;
};

const issueOptions: IssueOption[] = [
  {
    value: 'not_responding',
    label: 'Customer Not Responding',
    description: 'Driver has tried calling/messaging, but the customer is not answering.'
  },
  {
    value: 'invalid_contact',
    label: 'Customer Gave Invalid Contact Number',
    description: 'The phone number provided is incorrect or out of service.'
  },
  {
    value: 'not_present',
    label: 'Customer Not Present at Location',
    description: 'Driver arrives, but no one is there to hand over the clothes.'
  },
  {
    value: 'wrong_address',
    label: 'Wrong Address Provided',
    description: 'The address given does not exist or leads to a different place.'
  }
];

const ReportIssuePage = () => {
  const { taskId, orderId } = useParams<{ taskId: string; orderId: string }>();
  const navigate = useNavigate();
  const [selectedIssue, setSelectedIssue] = useState<string>('');
  const [additionalDetails, setAdditionalDetails] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleBack = () => {
    navigate(-1);
  };

  const handleIssueChange = (value: string) => {
    setSelectedIssue(value);
  };

  const handleDetailsChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setAdditionalDetails(e.target.value);
  };

  const handleSubmit = () => {
    if (!selectedIssue) {
      toast.error('Please select an issue type');
      return;
    }

    setIsSubmitting(true);

    // In a real app, this would be an API call
    setTimeout(() => {
      const selectedOption = issueOptions.find(option => option.value === selectedIssue);
      
      toast.success('Issue reported successfully', {
        description: `The order has been rescheduled and will appear in the admin panel.`,
        duration: 5000,
      });
      
      setIsSubmitting(false);
      
      // Navigate back to home screen instead of task details
      setTimeout(() => {
        navigate('/'); // Navigate to home page instead of back to task
      }, 1500);
    }, 1000);
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <div className="bg-gray-100 py-3 px-4 flex items-center shadow-sm">
        <Button variant="ghost" size="icon" onClick={handleBack} className="mr-2">
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <h1 className="text-lg font-semibold">Report an Issue</h1>
      </div>
      
      <div className="flex-1 p-4 max-w-md mx-auto w-full">
        <div className="bg-white rounded-lg p-6 shadow-sm">
          <div className="flex items-center mb-6 text-red-500">
            <AlertTriangle className="h-6 w-6 mr-2" />
            <h2 className="text-xl font-bold">Report an Issue</h2>
          </div>
          
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium mb-2">
                What's the issue?
              </label>
              <Select onValueChange={handleIssueChange} value={selectedIssue}>
                <SelectTrigger className="w-full bg-white">
                  <SelectValue placeholder="Select an issue type" />
                </SelectTrigger>
                <SelectContent>
                  {issueOptions.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              
              {selectedIssue && (
                <p className="text-sm text-gray-500 mt-2">
                  {issueOptions.find(o => o.value === selectedIssue)?.description}
                </p>
              )}
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-2">
                Additional Details
              </label>
              <Textarea 
                value={additionalDetails}
                onChange={handleDetailsChange}
                placeholder="Please provide any additional details that might help our support team..."
                className="min-h-[120px] border-green-200 border-2 rounded-md"
              />
            </div>
            
            <Button 
              className="w-full bg-red-500 hover:bg-red-600 text-white py-2 rounded-md flex items-center justify-center gap-2"
              onClick={handleSubmit}
              disabled={isSubmitting}
            >
              <AlertTriangle className="h-5 w-5" />
              {isSubmitting ? 'Submitting...' : 'Report Issue'}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReportIssuePage;
