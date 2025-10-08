import { IsEmail, IsString, IsOptional } from "class-validator";

export class SendEmailDto {
  @IsEmail()
  email: string;

  @IsString()
  csv: string;

  @IsOptional()
  @IsString()
  fileName?: string;
}
