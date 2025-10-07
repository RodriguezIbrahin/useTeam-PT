import { Module } from '@nestjs/common';
import { TasksService } from '@app/tasks/services/tasks.service';
import { TasksGateway } from '@app/tasks/gateway/tasks.gateway';

@Module({
  providers: [TasksGateway, TasksService],
})
export class TasksModule {}
