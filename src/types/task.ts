
export interface Location {
  latitude: number;
  longitude: number;
  address: string;
}

export interface SubTask {
  id: string;
  type: 'pickup' | 'delivery';
  status: 'pending' | 'completed';
  enabled: boolean;
  location: Location;
  customerName: string;
  distance?: number; // Distance from current location
}

export interface Task {
  id: string;
  orderNumber: string;
  items: number;
  subtasks: {
    pickup: SubTask;
    delivery: SubTask;
  };
  status: 'pending' | 'in-progress' | 'completed';
}

export interface DriverState {
  currentLocation: Location;
}
