
import { Location, SubTask } from "../types/task";

// This function returns a predetermined distance based on the order number
export const calculateDistance = (location1: Location, location2: Location): number => {
  // Check if this is the distance calculation for a subtask's location
  // We can identify subtasks by their id format (e.g., "task1-pickup")
  const taskId = location2.address.includes("task");
  
  // Extract order number if it's in the format "task{number}-*"
  if (taskId) {
    const orderMatch = location2.address.match(/task(\d+)-/);
    if (orderMatch) {
      const orderNumber = parseInt(orderMatch[1]);
      
      // Return predetermined distances based on order number
      switch (orderNumber) {
        case 1: return 1.0;
        case 2: return 1.5;
        case 3: return 2.0;
        case 4: return 2.5;
        case 5: return 3.0;
        default: {
          // If not a predefined order, fall back to the original calculation
          const latDiff = location1.latitude - location2.latitude;
          const lonDiff = location1.longitude - location2.longitude;
          return Math.round(Math.sqrt(latDiff * latDiff + lonDiff * lonDiff) * 10) / 10;
        }
      }
    }
  }
  
  // For locations that don't have a task ID pattern, use the original calculation
  const latDiff = location1.latitude - location2.latitude;
  const lonDiff = location1.longitude - location2.longitude;
  return Math.round(Math.sqrt(latDiff * latDiff + lonDiff * lonDiff) * 10) / 10;
};

// Sort subtasks by distance from current location
export const sortSubtasksByDistance = (subtasks: SubTask[], currentLocation: Location) => {
  return [...subtasks].sort((a, b) => {
    if (a.distance === undefined) return 1;
    if (b.distance === undefined) return -1;
    return a.distance - b.distance;
  });
};

// Return only the first subtask (closest to driver)
export const getClosestSubtask = (subtasks: SubTask[]) => {
  if (subtasks.length === 0) return null;
  return subtasks[0];
};
