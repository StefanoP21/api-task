export class TaskModel {
  id?: number;
  title: string;
  description?: string;
  status: string;
  endDate: Date;
  userId: number;
  createdAt: Date;
  updatedAt?: Date;
}
