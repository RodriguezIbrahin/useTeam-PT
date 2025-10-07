import { PartialType } from '@nestjs/mapped-types';
import { BaseKanbanDto } from './base-kanban.dto';
import { IsMongoId, IsNotEmpty } from 'class-validator';

export class UpdateKanbanDto extends PartialType(BaseKanbanDto) {
  @IsMongoId({
    message: JSON.stringify({ message: 'El ID del kanban no es válido.' }),
  })
  @IsNotEmpty({
    message: JSON.stringify({ message: 'El ID del kanban es obligatorio.' }),
  })
  id: string;
}
