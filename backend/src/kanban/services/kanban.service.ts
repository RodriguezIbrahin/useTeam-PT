import { Injectable } from '@nestjs/common';
import { CreateKanbanDto } from '@app/kanban/dto/create-kanban.dto';
import { UpdateKanbanDto } from '@app/kanban/dto/update-kanban.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Kanban } from '@app/kanban/shemas/kanban.schema';
import { Model } from 'mongoose';
import { BaseKanbanDto } from '@app/kanban/dto/base-kanban.dto';

@Injectable()
export class KanbanService {
  constructor(
    @InjectModel(Kanban.name) private readonly kanbanModel: Model<Kanban>,
  ) {}

  async create(createKanbanDto: CreateKanbanDto) {
    const kanban = new this.kanbanModel(createKanbanDto);
    return await kanban.save();
  }

  async findAll() {
    return await this.kanbanModel.find().exec();
  }

  async findOne(id: string) {
    return await this.kanbanModel.findById(id).exec();
  }

  async update(id: string, updateKanbanDto: BaseKanbanDto) {
    return await this.kanbanModel
      .findByIdAndUpdate(id, updateKanbanDto, { new: true })
      .exec();
  }

  async remove(id: string) {
    return await this.kanbanModel.findByIdAndDelete(id).exec();
  }
}
