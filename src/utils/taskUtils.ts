
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
  // Identify which subtasks are snoozed
  const snoozedSubtasks = subtasks.filter(subtask => 
    snoozedTasks.includes(subtask.id) || 
    (snoozedUntilLast && isPartOfTaskBeforeLast(subtask.id, tasks))
  );
  
  // Get active subtasks that are not snoozed
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
  
  // Find task containing this subtask
  const taskContainingSubtask = tasks.find(task => 
    task.subtasks.some(st => st.id === subtaskId)
  );
  
  if (!taskContainingSubtask) return false;
  
  // Get the last task in the array
  const lastTask = tasks[tasks.length - 1];
  
  // If task containing subtask is not the last task, then it's "before the last"
  return taskContainingSubtask.id !== lastTask.id;
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
  
  // After completing a subtask, check if we need to enable any snoozed tasks
  const snoozeInfoStr = localStorage.getItem('snoozeInfo');
  if (snoozeInfoStr) {
    const snoozeInfo = JSON.parse(snoozeInfoStr);
    
    // For 'last' type snoozing, we enable the task only if all other tasks are completed
    if (snoozeInfo.snoozeType === 'last') {
      // Count remaining non-snoozed active tasks
      const remainingActiveTasks = updatedTasks.filter(task => 
        task.status !== 'completed' && 
        task.id !== snoozeInfo.taskId
      );
      
      // If no other active tasks remain, enable the snoozed task
      if (remainingActiveTasks.length === 0) {
        // Find the snoozed task and make it enabled
        for (const task of updatedTasks) {
          if (task.id === snoozeInfo.taskId) {
            task.subtasks.forEach(subtask => {
              if (subtask.status === 'pending') {
                subtask.enabled = true;
                subtask.isSnoozed = false;
              }
            });
            break;
          }
        }
        
        // Clear the snooze info as we've now enabled the task
        localStorage.removeItem('snoozeInfo');
      }
    }
  }
  
  return {
    updatedTasks,
    taskCompleted,
    newLocation
  };
};
