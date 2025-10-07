import { IsMongoId, IsNotEmpty } from 'class-validator';

export class DeleteKanbanDto {
  @IsMongoId({
    message: JSON.stringify({ message: 'El ID del kanban no es válido.' }),
  })
  @IsNotEmpty({
    message: JSON.stringify({ message: 'El ID del kanban es obligatorio.' }),
  })
  id: string;
}
