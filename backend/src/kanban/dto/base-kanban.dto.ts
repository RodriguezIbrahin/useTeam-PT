import { IsNotEmpty, IsString, MaxLength } from 'class-validator';

export class BaseKanbanDto {
  @IsString({
    message: JSON.stringify({ message: 'El título debe ser un texto.' }),
  })
  @IsNotEmpty({
    message: JSON.stringify({ message: 'El título es obligatorio.' }),
  })
  @MaxLength(50, {
    message: JSON.stringify({
      message: 'El título no puede tener más de 50 caracteres.',
    }),
  })
  title: string;

  @IsString({
    message: JSON.stringify({ message: 'La descripción debe ser un texto.' }),
  })
  @MaxLength(255, {
    message: JSON.stringify({
      message: 'La descripción no puede tener más de 255 caracteres.',
    }),
  })
  description?: string;
}
