import { Module } from '@nestjs/common';
import { KanbanService } from '@app/kanban/services/kanban.service';
import { KanbanController } from '@app/kanban/controllers/kanban.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { KanbanSchema } from '@app/kanban/shemas/kanban.schema';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: 'Kanban', schema: KanbanSchema }]),
  ],
  controllers: [KanbanController],
  providers: [KanbanService],
})
export class KanbanModule {}
