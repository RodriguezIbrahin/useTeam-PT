import {
  WebSocketGateway,
  SubscribeMessage,
  MessageBody,
} from '@nestjs/websockets';
import { TasksService } from '@app/tasks/services/tasks.service';
import { CreateTaskDto } from '@app/tasks/dto/create-task.dto';
import { UpdateTaskDto } from '@app/tasks/dto/update-task.dto';

@WebSocketGateway()
export class TasksGateway {
  constructor(private readonly tasksService: TasksService) {}

  @SubscribeMessage('createTask')
  create(@MessageBody() createTaskDto: CreateTaskDto) {
    return this.tasksService.create(createTaskDto);
  }

  @SubscribeMessage('findAllTasks')
  findAll() {
    return this.tasksService.findAll();
  }

  @SubscribeMessage('findOneTask')
  findOne(@MessageBody() id: number) {
    return this.tasksService.findOne(id);
  }

  @SubscribeMessage('updateTask')
  update(@MessageBody() updateTaskDto: UpdateTaskDto) {
    return this.tasksService.update(updateTaskDto.id, updateTaskDto);
  }

  @SubscribeMessage('removeTask')
  remove(@MessageBody() id: number) {
    return this.tasksService.remove(id);
  }
}
