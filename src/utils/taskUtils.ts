
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
  // First, we identify which subtasks are snoozed
  const snoozedSubtasks = subtasks.filter(subtask => 
    snoozedTasks.includes(subtask.id) || 
    (snoozedUntilLast && isPartOfTaskBeforeLast(subtask.id, tasks))
  );
  
  // Then we get the active subtasks that are not snoozed
  const activeNonSnoozedSubtasks = subtasks.filter(subtask => 
    !snoozedTasks.includes(subtask.id) && 
    !(snoozedUntilLast && isPartOfTaskBeforeLast(subtask.id, tasks))
  );
  
  // Find the closest non-snoozed subtask
  const closestSubtask = getClosestSubtask(activeNonSnoozedSubtasks);
  
  // Mark all subtasks accordingly
  return subtasks.map(subtask => {
    const isSnoozed = snoozedTasks.includes(subtask.id) || 
                     (snoozedUntilLast && isPartOfTaskBeforeLast(subtask.id, tasks));
    
    return {
      ...subtask,
      isClosest: closestSubtask ? subtask.id === closestSubtask.id : false,
      isSnoozed: isSnoozed
    };
  });
};

// Helper function to determine if a subtask is part of a task before the last task
function isPartOfTaskBeforeLast(subtaskId: string, tasks: Task[]): boolean {
  if (tasks.length <= 1) return false;
  
  const lastTaskId = tasks[tasks.length - 1].id;
  
  for (let i = 0; i < tasks.length - 1; i++) {
    if (tasks[i].subtasks.some(st => st.id === subtaskId)) {
      return true;
    }
  }
  
  return false;
}

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
