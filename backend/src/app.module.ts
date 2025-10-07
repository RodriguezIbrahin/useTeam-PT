import { Module } from '@nestjs/common';
import { TasksModule } from '@app/tasks/tasks.module';
import { ColumnsModule } from '@app/columns/columns.module';
import { RoomsModule } from '@app/rooms/rooms.module';
import { KanbanModule } from '@app/kanban/kanban.module';
import { MongooseModule } from '@nestjs/mongoose';

@Module({
  imports: [
    TasksModule,
    MongooseModule.forRoot(process.env.MONGO_URI ?? ''),
    ColumnsModule,
    RoomsModule,
    KanbanModule,
  ],
})
export class AppModule {}
