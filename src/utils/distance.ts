
import { Location, SubTask } from "../types/task";

// This is a simplified distance calculation
// In a real app, we would use a proper geodesic calculation or mapping API
export const calculateDistance = (location1: Location, location2: Location): number => {
  // Simple Euclidean distance as a placeholder
  // In a real app, this would use the Haversine formula or an API call
  const latDiff = location1.latitude - location2.latitude;
  const lonDiff = location1.longitude - location2.longitude;
  
  // We round to 1 decimal place for display purposes
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
