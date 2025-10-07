import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { KanbanService } from '@app/kanban/services/kanban.service';
import { CreateKanbanDto } from '@app/kanban/dto/create-kanban.dto';
import { UpdateKanbanDto } from '@app/kanban/dto/update-kanban.dto';
import { FindKanbanDto } from '@app/kanban/dto/find-kanban.dto';
import { DeleteKanbanDto } from '@app/kanban/dto/delete-kanban.dto';
import { BaseKanbanDto } from '@app/kanban/dto/base-kanban.dto';

@Controller('kanban')
export class KanbanController {
  constructor(private readonly kanbanService: KanbanService) {}

  @Post()
  create(@Body() createKanbanDto: CreateKanbanDto) {
    return this.kanbanService.create(createKanbanDto);
  }

  @Get()
  findAll() {
    return this.kanbanService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') { id }: FindKanbanDto) {
    return this.kanbanService.findOne(id);
  }

  @Patch(':id')
  update(
    @Param('id') { id }: UpdateKanbanDto,
    @Body() updateKanbanDto: BaseKanbanDto,
  ) {
    return this.kanbanService.update(id, updateKanbanDto);
  }

  @Delete(':id')
  remove(@Param('id') { id }: DeleteKanbanDto) {
    return this.kanbanService.remove(id);
  }
}
