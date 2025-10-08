import { IsEmail, IsOptional, IsString } from "class-validator";

export class BacklogExportDto {
  @IsEmail()
  email: string;

  @IsOptional()
  @IsString()
  boardId?: string;

  @IsOptional()
  board?: any;

  @IsOptional()
  @IsString()
  note?: string;
}
