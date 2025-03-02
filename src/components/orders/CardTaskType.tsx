
import React from 'react';
import { SubTask } from '@/types/task';

interface CardTaskTypeProps {
  type: string;
}

export const getSubtaskTypeName = (type: string) => {
  switch (type) {
    case 'pickup':
      return 'Pick Up';
    case 'drop':
      return 'Drop';
    case 'collect':
      return 'Collect';
    case 'delivery':
      return 'Deliver';
    default:
      return type;
  }
};

export const getSubtaskColor = (type: string) => {
  switch (type) {
    case 'pickup':
      return 'bg-blue-500';
    case 'drop':
      return 'bg-indigo-500';
    case 'collect':
      return 'bg-green-500';
    case 'delivery':
      return 'bg-yellow-500';
    default:
      return 'bg-gray-500';
  }
};

export const getSubtaskBadgeVariant = (type: string): "default" | "secondary" | "outline" | "destructive" => {
  switch (type) {
    case 'pickup':
      return 'secondary';
    case 'drop':
      return 'outline';
    case 'collect':
      return 'default';
    case 'delivery':
      return 'destructive';
    default:
      return 'default';
  }
};

const CardTaskType = ({ type }: CardTaskTypeProps) => {
  return <span>{getSubtaskTypeName(type)}</span>;
};

export default CardTaskType;
