import { TaskModel } from '../models/task.model';

export interface TaskResponseDto {
  id?: number;
  title: string;
  description: string;
  status: string;
  endDate: Date;
  userId: number;
  createdAt: Date;
  updatedAt: Date;
}

const mappingTaskDto = (task: TaskModel): TaskResponseDto => ({
  id: task.id,
  title: task.title,
  description: task.description,
  status: task.status,
  endDate: task.endDate,
  userId: task.userId,
  createdAt: task.createdAt,
  updatedAt: task.updatedAt,
});

export { mappingTaskDto };
