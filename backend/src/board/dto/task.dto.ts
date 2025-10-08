import { IsOptional, IsString, IsISO8601 } from "class-validator";

export class TaskDto {
  @IsString()
  id: string;

  @IsString()
  title: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsISO8601()
  createdAt?: string; // ISO string
}
