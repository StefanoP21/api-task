import { HttpException, Injectable } from '@nestjs/common';
import { CreateTaskDto } from '../dto/create-task.dto';
import { UpdateTaskDto } from '../dto/update-task.dto';
import { Task } from '../entities/task.entity';
import { Repository } from 'typeorm';
import { mappingTaskDto } from '../dto/response.dto';
import { ResponseDto } from '../../../common/dtos/response.dto';
import { OperationService } from '../../../common/services/trace.service';
import { errors } from '../../../common/helpers/errors';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class TaskService {
  constructor(
    @InjectRepository(Task)
    private readonly taskRepository: Repository<Task>,
  ) {}

  private setTrace() {
    const trace: string = OperationService.getTrace();
    return trace;
  }

  async create(createTaskDto: CreateTaskDto) {
    const trace = this.setTrace();
    try {
      const task = new Task(createTaskDto);
      await this.taskRepository.save(task);
      return ResponseDto.format(trace, mappingTaskDto(task));
    } catch (err) {
      throw new HttpException(
        errors.internalServerError.message,
        errors.internalServerError.status,
        { cause: errors.internalServerError.code },
      );
    }
  }

  async findAll(userId: number) {
    const trace = this.setTrace();
    try {
      const tasks = await this.taskRepository.find({ where: { userId } });
      return ResponseDto.format(trace, tasks.map(mappingTaskDto));
    } catch (err) {
      throw new HttpException(
        errors.internalServerError.message,
        errors.internalServerError.status,
        { cause: errors.internalServerError.code },
      );
    }
  }

  async findOne(id: number, userId: number) {
    const trace = this.setTrace();
    try {
      const task = await this.taskRepository.findOne({ where: { id, userId } });
      if (!task) {
        throw new HttpException(
          errors.taskNotExist.message,
          errors.taskNotExist.status,
          { cause: errors.taskNotExist.code },
        );
      }
      return ResponseDto.format(trace, mappingTaskDto(task));
    } catch (err) {
      throw new HttpException(
        errors.internalServerError.message,
        errors.internalServerError.status,
        { cause: errors.internalServerError.code },
      );
    }
  }

  async update(id: number, updateTaskDto: UpdateTaskDto, userId: number) {
    const trace = this.setTrace();
    try {
      const task = await this.taskRepository.findOne({ where: { id, userId } });
      if (!task) {
        throw new HttpException(
          errors.taskNotExist.message,
          errors.taskNotExist.status,
          { cause: errors.taskNotExist.code },
        );
      }
      await this.taskRepository.update(id, updateTaskDto);
      return ResponseDto.format(trace, mappingTaskDto(task));
    } catch (err) {
      throw new HttpException(
        errors.internalServerError.message,
        errors.internalServerError.status,
        { cause: errors.internalServerError.code },
      );
    }
  }

  async remove(id: number, userId: number) {
    const trace = this.setTrace();
    try {
      const task = await this.taskRepository.findOne({ where: { id, userId } });
      if (!task) {
        throw new HttpException(
          errors.taskNotExist.message,
          errors.taskNotExist.status,
          { cause: errors.taskNotExist.code },
        );
      }
      await this.taskRepository.delete(id);
      return ResponseDto.format(trace, mappingTaskDto(task));
    } catch (err) {
      throw new HttpException(
        errors.internalServerError.message,
        errors.internalServerError.status,
        { cause: errors.internalServerError.code },
      );
    }
  }
}
