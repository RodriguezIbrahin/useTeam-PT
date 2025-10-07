import { BaseKanbanDto } from './base-kanban.dto';
import { IsOptional } from 'class-validator';

export declare class CreateKanbanDto extends BaseKanbanDto {
  @IsOptional()
  description?: string;
}
