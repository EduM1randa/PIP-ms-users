import {
  IsString,
  IsEmail,
  IsOptional,
  IsArray,
  IsDateString,
} from "class-validator";

export class CreateTeacherDto {
  @IsString()
  firstName!: string;

  @IsString()
  lastName!: string;

  @IsString()
  password!: string;

  @IsEmail()
  email!: string;

  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  subjects?: string[];

  @IsString()
  @IsOptional()
  resetPasswordToken?: string;

  @IsDateString()
  @IsOptional()
  resetPasswordExpires?: Date;
}
