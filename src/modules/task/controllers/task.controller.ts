import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Request,
} from '@nestjs/common';
import { TaskService } from '../services/task.service';
import { CreateTaskDto } from '../dto/create-task.dto';
import { UpdateTaskDto } from '../dto/update-task.dto';
import { AuthenticationGuard } from '../../../common/guards/authentication.guard';

@Controller('task')
@UseGuards(AuthenticationGuard)
export class TaskController {
  constructor(private readonly taskService: TaskService) {}

  @Post()
  create(
    @Request() req: Request & { user: { id: number; email: string } },
    @Body() createTaskDto: CreateTaskDto,
  ) {
    return this.taskService.create({ ...createTaskDto, userId: req.user.id });
  }

  @Get()
  findAll(@Request() req: Request & { user: { id: number; email: string } }) {
    return this.taskService.findAll(req.user.id);
  }

  @Get(':id')
  findOne(
    @Request() req: Request & { user: { id: number; email: string } },
    @Param('id') id: string,
  ) {
    return this.taskService.findOne(+id, req.user.id);
  }

  @Patch(':id')
  update(
    @Request() req: Request & { user: { id: number; email: string } },
    @Param('id') id: string,
    @Body() updateTaskDto: UpdateTaskDto,
  ) {
    return this.taskService.update(+id, updateTaskDto, req.user.id);
  }

  @Delete(':id')
  remove(
    @Request() req: Request & { user: { id: number; email: string } },
    @Param('id') id: string,
  ) {
    return this.taskService.remove(+id, req.user.id);
  }
}
