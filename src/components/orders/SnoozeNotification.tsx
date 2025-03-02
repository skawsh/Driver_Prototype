
import React from 'react';
import { Clock } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface SnoozeNotificationProps {
  snoozedUntilLast: boolean;
  snoozedTasks: string[];
  clearSnooze: () => void;
}

const SnoozeNotification = ({ snoozedUntilLast, snoozedTasks, clearSnooze }: SnoozeNotificationProps) => {
  if (!snoozedUntilLast && snoozedTasks.length === 0) return null;
  
  return (
    <div className="bg-amber-50 border border-amber-200 rounded-md p-3 mb-4 flex items-center justify-between">
      <div className="flex items-center">
        <Clock className="h-5 w-5 text-amber-500 mr-2" />
        <span className="text-amber-800">
          {snoozedUntilLast 
            ? "Snoozed until last order" 
            : "Snoozed until next order completion"}
        </span>
      </div>
      <Button 
        variant="outline" 
        size="sm"
        onClick={clearSnooze}
        className="text-amber-800 border-amber-300 hover:bg-amber-100"
      >
        Cancel Snooze
      </Button>
    </div>
  );
};

export default SnoozeNotification;
