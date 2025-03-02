
import { SubTask, Task, DriverState, Location } from '@/types/task';
import { calculateDistance, sortSubtasksByDistance, getClosestSubtask } from '@/utils/distance';

export const getActiveSubtasks = (tasks: Task[], driverState: DriverState) => {
  const activeSubtasks: SubTask[] = [];
  
  tasks.forEach(task => {
    task.subtasks.forEach(subtask => {
      if (subtask.enabled && subtask.status !== 'completed') {
        const distance = calculateDistance(driverState.currentLocation, subtask.location);
        activeSubtasks.push({
          ...subtask,
          distance: distance
        });
      }
    });
  });
  
  return sortSubtasksByDistance(activeSubtasks, driverState.currentLocation);
};

export const markClosestSubtask = (subtasks: SubTask[], snoozedTasks: string[], snoozedUntilLast: boolean, tasks: Task[]) => {
  const filteredSubtasks = subtasks.filter(subtask => {
    if (snoozedTasks.includes(subtask.id)) {
      return false;
    }
    
    if (snoozedUntilLast) {
      const parentTask = tasks.find(task => 
        task.subtasks.some(st => st.id === subtask.id)
      );
      
      if (parentTask && tasks[tasks.length - 1].id === parentTask.id) {
        return true;
      }
      return false;
    }
    
    return true;
  });
  
  const closestSubtask = getClosestSubtask(filteredSubtasks);
  
  return subtasks.map(subtask => ({
    ...subtask,
    isClosest: closestSubtask ? subtask.id === closestSubtask.id : false
  }));
};

export const filterSubtasksByWashType = (subtasks: SubTask[], tasks: Task[], type: 'express' | 'standard') => {
  return subtasks.filter(subtask => {
    const parentTask = tasks.find(task => task.subtasks.some(st => st.id === subtask.id));
    return parentTask && (
      type === 'express' 
        ? (parentTask.washType === 'express' || parentTask.washType === 'both')
        : parentTask.washType === 'standard'
    );
  });
};

export const completeSubtask = (tasks: Task[], subtaskId: string): {
  updatedTasks: Task[];
  taskCompleted: boolean;
  newLocation: Location | null;
} => {
  const updatedTasks = [...tasks];
  let taskCompleted = false;
  let newLocation: Location | null = null;
  
  for (let i = 0; i < updatedTasks.length; i++) {
    const task = updatedTasks[i];
    const subtaskIndex = task.subtasks.findIndex(st => st.id === subtaskId);
    
    if (subtaskIndex !== -1) {
      task.subtasks[subtaskIndex].status = 'completed';
      newLocation = task.subtasks[subtaskIndex].location;
      
      if (subtaskIndex < task.subtasks.length - 1) {
        task.subtasks[subtaskIndex + 1].enabled = true;
        task.status = 'in-progress';
      } else {
        task.status = 'completed';
        taskCompleted = true;
      }
      break;
    }
  }
  
  return {
    updatedTasks,
    taskCompleted,
    newLocation
  };
};
