import { IsMongoId, IsNotEmpty } from 'class-validator';

export class FindKanbanDto {
  @IsMongoId({
    message: JSON.stringify({
      message: 'El ID del kanban debe ser un ObjectId válido.',
    }),
  })
  @IsNotEmpty({
    message: JSON.stringify({
      message: 'El ID del kanban es obligatorio.',
    }),
  })
  id: string;
}
