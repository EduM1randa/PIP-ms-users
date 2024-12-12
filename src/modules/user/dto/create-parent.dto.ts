import {
  IsString,
  IsEmail,
  IsOptional,
  IsArray,
  IsDateString,
} from "class-validator";

export class CreateParentDto {
  @IsString()
  firstName!: string;

  @IsString()
  lastName!: string;

  @IsString()
  password!: string;

  @IsEmail()
  email!: string;

  @IsString()
  phone!: string;

  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  childrens?: string[];

  @IsString()
  @IsOptional()
  resetPasswordToken?: string;

  @IsDateString()
  @IsOptional()
  resetPasswordExpires?: Date;
}
