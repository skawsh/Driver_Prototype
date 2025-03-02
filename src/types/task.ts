
export interface Location {
  latitude: number;
  longitude: number;
  address: string;
}

export interface SubTask {
  id: string;
  type: 'pickup' | 'drop' | 'collect' | 'delivery';
  status: 'pending' | 'completed';
  enabled: boolean;
  location: Location;
  customerName: string;
  mobileNumber?: string;
  distance?: number; // Distance from current location
  isClosest?: boolean; // Whether this is the closest task
  isSnoozed?: boolean; // Whether this task is snoozed
}

export interface Task {
  id: string;
  orderNumber: string;
  items: number;
  subtasks: SubTask[];
  status: 'pending' | 'in-progress' | 'completed';
  washType: 'express' | 'standard' | 'both'; // Updated to be required
}

export interface DriverState {
  currentLocation: Location;
}
