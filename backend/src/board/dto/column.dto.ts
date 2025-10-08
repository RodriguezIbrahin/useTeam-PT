import {
  IsString,
  IsArray,
  ValidateNested,
  ArrayMinSize,
  IsOptional,
} from "class-validator";
import { Type } from "class-transformer";
import { TaskDto } from "./task.dto";

export class ColumnDto {
  @IsString()
  id: string;

  @IsString()
  title: string;

  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => TaskDto)
  tasks?: TaskDto[];

  @IsOptional()
  position?: number;
}
